# First-Timer's Guide to Sanity.io Migration

Welcome! This guide will walk you through the manual steps needed to get your Astro website running with Sanity.io as its new backend. Follow these steps carefully after the migration pull request has been merged.

## Step 1: Create a Sanity.io Account and Project

1.  **Sign up for Sanity.io:** Go to [sanity.io/get-started](https://sanity.io/get-started) and create a new account.
2.  **Create a New Project:** Once you're logged in, you'll be prompted to create a new project. Give it a name (e.g., "Astro Website").
3.  **Get Your Project ID:** After creating the project, you'll be taken to your project dashboard. Your **Project ID** is a unique string of letters and numbers and is prominently displayed on the dashboard. Copy it to your clipboard.

## Step 2: Configure Your Local Sanity Studio

The code migration has already created a Sanity Studio for you in the `/sanity` directory. You just need to tell it your Project ID.

1.  Open the `sanity/sanity.config.ts` file.
2.  Find the line `projectId: 'YOUR_PROJECT_ID'` and replace `'YOUR_PROJECT_ID'` with the Project ID you copied.
3.  Open the `sanity/sanity.cli.ts` file.
4.  Do the same thing: replace `'YOUR_PROJECT_ID'` with your actual Project ID.

## Step 3: Deploy the Sanity Studio

This step will publish your content management studio to the web and create the "production" dataset where your content will live.

1.  Open your terminal and navigate into the `sanity` directory:
    ```bash
    cd sanity
    ```
2.  Install the studio's dependencies:
    ```bash
    npm install
    ```
3.  Deploy the studio:
    ```bash
    npx sanity deploy
    ```
    You may be asked to log in to your Sanity account in the browser. After deploying, you will get a URL where you can access your studio (e.g., `https://your-project-name.sanity.studio`).

## Step 4: Create a Read-Only API Token

Your Astro website needs credentials to fetch data from Sanity. We'll create a secure, read-only token for this.

1.  Go to your Sanity project management page: [manage.sanity.io](https://manage.sanity.io).
2.  Select your project.
3.  In the project navigation, go to the **API** tab.
4.  Scroll down to the **Tokens** section and click **Add API Token**.
5.  Give the token a name (e.g., "Astro Frontend").
6.  Select the **Viewer** permission level. This is crucial as it makes the token read-only.
7.  Click **Save**. Your new token will be revealed. **Copy it immediately**, as you won't be able to see it again.

## Step 5: Set Up Environment Variables in Your Astro Project

Now we'll provide the credentials to your Astro application.

1.  In the **root directory** of your project (not the `/sanity` directory), create a new file named `.env`.
2.  Add the following lines to the `.env` file, pasting your Project ID and API Token where indicated:

    ```
    PUBLIC_SANITY_PROJECT_ID="<your-project-id>"
    PUBLIC_SANITY_DATASET="production"
    PUBLIC_SANITY_API_TOKEN="<your-read-only-api-token>"
    ```

## Step 6: Add Your Content to Sanity

Your Sanity Studio is now live and connected, but your database is empty.

1.  Go to your deployed Sanity Studio URL (from Step 3).
2.  You will see all the content types we created (Product, Category, etc.) on the left-hand side.
3.  Click on a type and then click the **Create new** button to start adding your content. You can copy and paste the content from the original JSON files located in `public/data/`.

## Step 7: Run Your Astro Website

You're all set! Now you can run your Astro site, which will fetch its data from Sanity.

1.  In your terminal, make sure you are in the **root directory** of the project.
2.  If you haven't already, install the project's dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

Your website should now be running locally, with all the data coming live from your Sanity.io project. Congratulations!
