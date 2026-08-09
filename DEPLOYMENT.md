# Deployment

## Backend on Render

Render can use the root `render.yaml` blueprint. Add values for these secret environment variables in Render:

- `MONGO_URI`
- `CORS_ORIGIN` set to your Vercel frontend URL, for example `https://your-app.vercel.app`
- `STRIPE_SECRET_KEY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

The backend health check is `/api/health`.

## Frontend on Vercel

Deploy the frontend with either of these options:

- Import the repo root and let the root `vercel.json` build `Frontend`.

Add this Vercel environment variable:

- `VITE_API_BASE_URL=https://your-render-service.onrender.com/api`

After both services are deployed, update Render's `CORS_ORIGIN` to the final Vercel URL and redeploy the backend.
