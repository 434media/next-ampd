import { type NextRequest, NextResponse } from "next/server"
import { checkBotId } from "botid/server"
import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore, FieldValue } from "firebase-admin/firestore"
import crypto from "crypto"

// Initialize Firebase Admin SDK
const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
if (!serviceAccountKey) {
  throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY is not defined")
}

if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(serviceAccountKey)),
  })
}

const db = getFirestore()

const mailchimpApiKey = process.env.MAILCHIMP_API_KEY
const mailchimpListId = process.env.MAILCHIMP_AUDIENCE_ID

const mailchimpDatacenter = mailchimpApiKey ? mailchimpApiKey.split("-").pop() : null

const NEWSLETTER_TAGS = ["web-ampdproject", "newsletter-signup"]

type MailchimpResult = { status: number; json: boolean; data: { title?: string } | null }

// Calls the Mailchimp API with native fetch. Errors never carry the request,
// so the API key cannot end up in a log line the way an axios error's config did.
async function mailchimp(path: string, method: "POST" | "PUT", body: unknown): Promise<MailchimpResult> {
  const res = await fetch(`https://${mailchimpDatacenter}.api.mailchimp.com/3.0/lists/${mailchimpListId}${path}`, {
    method,
    headers: {
      Authorization: `Basic ${Buffer.from(`apikey:${mailchimpApiKey}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
  const json = (res.headers.get("content-type") ?? "").includes("json")
  const data = json && res.status !== 204 ? await res.json().catch(() => null) : null
  return { status: res.status, json, data }
}

export async function POST(request: NextRequest) {
  try {
    // Verify the request is not from a bot
    const verification = await checkBotId()
    if (verification.isBot) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const { email } = await request.json()

    const mailchimpEnabled = mailchimpApiKey && mailchimpListId
    if (!mailchimpEnabled) {
      console.warn("Mailchimp integration disabled - missing API key or Audience ID")
    }

    // Save to Firestore
    const firestorePromise = db.collection("newsletter_signups").add({
      email,
      source: "AMPD",
      tags: NEWSLETTER_TAGS,
      subscribedAt: FieldValue.serverTimestamp(),
    })

    const promises: Promise<unknown>[] = [firestorePromise]

    if (mailchimpEnabled) {
      promises.push(
        mailchimp("/members", "POST", {
          email_address: email,
          status: "subscribed",
          tags: NEWSLETTER_TAGS,
        }),
      )
    }

    const results = await Promise.allSettled(promises)

    const firestoreResult = results[0]
    const mailchimpResult = mailchimpEnabled ? (results[1] as PromiseSettledResult<MailchimpResult>) : null

    const errors = []

    if (firestoreResult.status === "rejected") {
      console.error("Firestore error:", firestoreResult.reason)
      errors.push("Firestore subscription failed")
    }

    if (mailchimpEnabled && mailchimpResult) {
      if (mailchimpResult.status === "rejected") {
        // A network failure; the reason carries no request details.
        console.error("Mailchimp request failed:", String(mailchimpResult.reason))
        errors.push("Mailchimp subscription failed")
      } else {
        const { status, json, data } = mailchimpResult.value
        if (status >= 200 && status < 300) {
          // Subscribed.
        } else if (!json) {
          console.error(`Mailchimp returned a non-JSON ${status} response - likely an authentication issue`)
          errors.push("Mailchimp authentication failed")
        } else if (data?.title === "Member Exists") {
          // Already on the list: add the tags to the existing member. Tags on an
          // existing member are set through the member's tags endpoint.
          const emailHash = crypto.createHash("md5").update(String(email).toLowerCase()).digest("hex")
          try {
            const tagged = await mailchimp(`/members/${emailHash}/tags`, "POST", {
              tags: NEWSLETTER_TAGS.map((name) => ({ name, status: "active" })),
            })
            if (tagged.status >= 300) {
              console.error(`Mailchimp tag update returned ${tagged.status}`)
              errors.push("Mailchimp update failed")
            }
          } catch (updateError) {
            console.error("Mailchimp tag update failed:", String(updateError))
            errors.push("Mailchimp update failed")
          }
        } else {
          console.error(`Mailchimp subscription returned ${status}: ${data?.title ?? "unknown error"}`)
          errors.push("Mailchimp subscription failed")
        }
      }
    }

    const totalServices = mailchimpEnabled ? 2 : 1
    if (errors.length < totalServices) {
      return NextResponse.json(
        {
          message: "Newsletter subscription successful",
          warnings: errors.length > 0 ? errors : undefined,
          mailchimpEnabled,
        },
        { status: 200 },
      )
    } else {
      return NextResponse.json(
        {
          error: mailchimpEnabled ? "Both services failed" : "Firestore service failed",
          details: errors,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error subscribing to newsletter:", error)
    return NextResponse.json({ error: "An error occurred while subscribing to the newsletter" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
