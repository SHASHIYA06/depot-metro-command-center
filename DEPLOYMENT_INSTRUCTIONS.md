
# Deployment Instructions for Metro Depot Command Center

## Render.com Deployment

### Prerequisites
- A Render.com account
- Your code pushed to a Git repository (GitHub, GitLab, etc.)

### Setup Steps

1. **Log in to Render.com**

2. **Create a New Web Service**
   - Click "New +" button
   - Select "Web Service"
   - Connect your repository

3. **Configure the Service**
   - **Name**: metro-depot-command-center (or your preferred name)
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server.js`
   - **Node Version**: 18 (minimum)

4. **Environment Variables**
   - Set `NODE_ENV` to `production`
   - Set `PORT` to `10000` (Render will automatically assign this port to your app)
   - Add any other environment variables your app requires

### Build Command
```
npm install && npm run build
```

### Start Command
```
node server.js
```

### Environment Variables
Required environment variables:
- `NODE_ENV`: Set to `production`
- `PORT`: Automatically set by Render (default to 10000)

Optional environment variables (if used by your application):
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

## Important Notes

- The application uses Express.js for serving the built files
- The server is configured as an ES module (using import/export) which matches the project's "type": "module" setting in package.json
- Make sure your Node.js version is at least 18.0.0 for ES modules support
- For local development, continue using `npm run dev` command
- The server is set up to handle client-side routing by redirecting all routes to the index.html file

## Manual Deployment Steps

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run build` to build the application
4. Run `node server.js` to start the server
5. Access the application at http://localhost:3000 (or the PORT specified in environment variables)

## Troubleshooting

If you encounter any issues during deployment:

1. **Check Render logs** for error messages
2. **Verify environment variables** are correctly set
3. **Ensure Node version compatibility** (Node 18+)
4. **Check build output** for any compilation errors
