#!/bin/bash
# PBAG Deployment Script
# Run this from your terminal to bypass Google Drive syncing issues that freeze automated deployments.

echo "Deploying PBAG Frontend to Vercel..."
cd apps/web
npx --yes vercel --prod --yes
echo "Frontend deployment complete!"

echo "To deploy the backend to Google Cloud Run, run the following:"
echo "cd ../apps/api"
echo "gcloud run deploy pbag-api --source . --region us-central1 --allow-unauthenticated"
