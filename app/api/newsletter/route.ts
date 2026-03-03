import { type NextRequest, NextResponse } from "next/server"
import { checkBotId } from "botid/server"
import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore, FieldValue } from "firebase-admin/firestore"
import axios from "axios"
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
      tags: ["web-ampdproject", "newsletter-signup"],
      subscribedAt: FieldValue.serverTimestamp(),
    })

    const promises: Promise<any>[] = [firestorePromise]

    if (mailchimpEnabled) {
      console.log(
        "[v0] Mailchimp API URL:",
        `https://${mailchimpDatacenter}.api.mailchimp.com/3.0/lists/${mailchimpListId}/members`,
      )

      const mailchimpPromise = axios.post(
        `https://${mailchimpDatacenter}.api.mailchimp.com/3.0/lists/${mailchimpListId}/members`,
        {
          email_address: email,
          status: "subscribed",
          tags: ["web-ampdproject", "newsletter-signup"],
        },
        {
          auth: {
            username: "apikey",
            password: mailchimpApiKey,
          },
          headers: {
            "Content-Type": "application/json",
          },
          validateStatus: (status) => status < 500, // Don't throw on 4xx errors
        },
      )

      promises.push(mailchimpPromise)
    }

    const results = await Promise.allSettled(promises)

    const firestoreResult = results[0]
    const mailchimpResult = mailchimpEnabled ? results[1] : null

    const errors = []

    if (firestoreResult.status === "rejected") {
      console.error("Firestore error:", firestoreResult.reason)
      errors.push("Firestore subscription failed")
    }

    if (mailchimpEnabled && mailchimpResult && mailchimpResult.status === "rejected") {
      console.error("Mailchimp error:", mailchimpResult.reason)

      const error = mailchimpResult.reason
      if (error?.response?.data) {
        const responseData = error.response.data
        if (typeof responseData === "string" && responseData.includes("<!DOCTYPE")) {
          console.error("Mailchimp returned HTML error page - likely authentication issue")
          errors.push("Mailchimp authentication failed")
        } else if (responseData?.title === "Member Exists") {
          console.log("Email already exists in Mailchimp, updating tags")
          // Try to update existing member with tags
          try {
            const emailHash = crypto.createHash("md5").update(email.toLowerCase()).digest("hex")
            await axios.patch(
              `https://${mailchimpDatacenter}.api.mailchimp.com/3.0/lists/${mailchimpListId}/members/${emailHash}`,
              {
                tags: ["web-ampdproject", "newsletter-signup"],
              },
              {
                auth: {
                  username: "apikey",
                  password: mailchimpApiKey,
                },
                headers: {
                  "Content-Type": "application/json",
                },
              },
            )
          } catch (updateError) {
            console.error("Failed to update existing Mailchimp member:", updateError)
            errors.push("Mailchimp update failed")
          }
        } else {
          errors.push("Mailchimp subscription failed")
        }
      } else {
        errors.push("Mailchimp subscription failed")
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
