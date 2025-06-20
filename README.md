# The AMPD Project

This is the official website for The AMPD Project, a veteran-founded 501(c)(3) non-profit organization dedicated to empowering students and veterans through their passion for media and entertainment production. The website is built with Next.js and showcases the organization's mission, allows users to donate, and subscribe to a newsletter.

## Built With

*   [Next.js](https://nextjs.org/) - React Framework
*   [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
*   [Tailwind CSS](https://tailwindcss.com/) - Utility-First CSS Framework
*   [Motion](https://motion.dev/) - Animation Library
*   [Airtable](https://airtable.com/) - Backend for Newsletter Subscriptions
*   [Vercel](https://vercel.com/) - Deployment Platform

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js (version 20 or later) and npm installed on your machine.

*   npm
    ```sh
    npm install npm@latest -g
    ```

### Installation

1.  **Clone the repository**
    ```sh
    git clone https://github.com/your_username/next-ampd.git
    cd next-ampd
    ```

2.  **Install NPM packages**
    ```sh
    npm install
    ```

3.  **Set up environment variables**
    Create a `.env.local` file in the root of your project and add the following variables. These are necessary for the newsletter functionality.

    ```env
    # Airtable Credentials
    AIRTABLE_BASE_ID=your_airtable_base_id
    AIRTABLE_API_KEY=your_airtable_api_key

    # Cloudflare Turnstile Keys
    NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key
    TURNSTILE_SECRET_KEY=your_turnstile_secret_key
    ```

4.  **Run the development server**
    ```sh
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

In the project directory, you can run:

*   `npm run dev`: Runs the app in development mode with Turbopack.
*   `npm run build`: Builds the app for production.
*   `npm run start`: Starts a Next.js production server.
*   `npm run lint`: Runs ESLint to find and fix problems in your code.

## Contributing with GitHub

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

### 1. Clone the Repository

If you are a collaborator, you can clone the repository directly.

```sh
git clone <repository-url>
```

### 2. Create a New Branch

Create a new branch for your feature or bug fix. This keeps the `main` branch clean and deployable.

```sh
git checkout -b feature/YourAmazingFeature
```

### 3. Make Changes and Commit

Make your changes to the codebase. Once you are done, stage and commit your changes with a descriptive message.

```sh
git add .
git commit -m "feat: Add some AmazingFeature"
```

### 4. Push to Your Branch

Push your changes up to the remote repository.

```sh
git push origin feature/YourAmazingFeature
```

### 5. Create a Pull Request

Go to the repository on GitHub and you will see a prompt to create a Pull Request (PR) from your new branch. Fill out the PR template with details about your changes. Submit the PR for review. Your changes will be merged into the main branch after a review