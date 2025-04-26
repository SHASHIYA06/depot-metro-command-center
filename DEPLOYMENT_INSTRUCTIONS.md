
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
   - Set `SUPABASE_URL` to your Supabase project URL
   - Set `SUPABASE_ANON_KEY` to your Supabase anon key

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
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Important Notes

- The application uses Express.js for serving the built files
- The server is configured as an ES module (using import/export) which matches the project's "type": "module" setting in package.json
- Make sure your Node.js version is at least 18.0.0 for ES modules support
- For local development, continue using `npm run dev` command
- The server is set up to handle client-side routing by redirecting all routes to the index.html file
- The listen address is set to '0.0.0.0' to ensure proper binding in cloud environments

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
5. **Path-to-regexp errors**: We've addressed these by using simple string paths in Express routes
6. **Connection issues**: If facing connection problems, check that the server is binding to '0.0.0.0' and not 'localhost'
7. **Static file serving**: Verify the dist directory is being correctly accessed

## Render.yaml Configuration

A `render.yaml` file is included in the project root that defines the service configuration.
This allows for Infrastructure as Code deployment if you're using Render's Blueprint feature.
