
# Deployment Instructions for Metro Depot Command Center

## Render.com Deployment

### Build Command
```
npm install && npm run build
```

### Start Command
```
node server.js
```

### Environment Variables
No specific environment variables are needed for basic deployment.

## Manual Deployment Steps

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run build` to build the application
4. Run `node server.js` to start the server
5. Access the application at http://localhost:3000 (or the PORT specified in environment variables)

## Important Notes

- The application uses a custom Express server for serving the built files
- This server is configured as an ES module, which is compatible with the project's "type": "module" setting
- For local development, continue using `npm run dev` command
