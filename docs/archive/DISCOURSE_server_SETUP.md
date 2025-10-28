# Discourse User API Key Setup Guide

This guide will help you set up Discourse User API Key authentication for your Fomio MCP Server.

## Understanding Discourse User API Keys

Your Fomio MCP Server uses **Discourse User API Keys** (not OAuth2). This is the recommended method for mobile applications and provides per-user authentication with granular scopes.

### How It Works:

1. Your app initiates authentication by calling `/auth/start`
2. Server generates a User API Key authorization URL
3. User is redirected to Discourse to authorize the application
4. Discourse redirects back with user credentials
5. Server stores encrypted User API Key for making authenticated requests

## Prerequisites

- Access to Discourse forum at https://meta.techrebels.info
- **No admin access required** - this is user-level authentication
- Your application must be accessible via a public URL for the callback

## Step 1: Configure Application Details

In your `.env` file, you need to set:

```bash
# Your application identifier (can be any unique string)
DISCOURSE_CLIENT_ID=fomio-mobile-app

# Where Discourse should redirect after authorization
DISCOURSE_REDIRECT_URI=http://localhost:8080/auth/callback
```

**For Development:**

- Use `http://localhost:8080/auth/callback` for local testing
- **Note:** Discourse may block localhost redirects - use ngrok (see below)

**For Production:**

- Must use HTTPS: `https://your-domain.com/auth/callback`

## Step 2: Enable User API Keys on Discourse

User API Keys should be enabled by default on most Discourse instances. To verify:

1. **Check if User API Keys are enabled:**
   - Visit: https://meta.techrebels.info/user-api-key/new
   - If you see "User API Keys are not enabled", contact the admin

2. **Contact Forum Administrator (if needed):**
   - Ask them to enable "User API Keys" in Discourse settings
   - Path: Admin → Settings → Users → Enable "allow user api keys"

## Step 3: Test the Authentication Flow

```bash
# 1. Start your MCP server
npm run docker:dev

# 2. Initiate authentication
curl -X POST http://localhost:8080/auth/start

# Response will include:
# {
#   "authUrl": "https://meta.techrebels.info/user-api-key/new?client_id=..."
# }

# 3. Open the authUrl in a browser
# 4. Authorize the application on Discourse
# 5. You'll be redirected back to your callback URL
```

## Step 4: Handling Localhost for Development

Discourse requires a publicly accessible callback URL. For local development:

### Option A: Use ngrok (Recommended)

```bash
# Install ngrok
brew install ngrok  # macOS
# or download from https://ngrok.com

# Create tunnel to your local server
ngrok http 8080

# Update .env with ngrok URL:
DISCOURSE_REDIRECT_URI=https://your-ngrok-url.ngrok.io/auth/callback
```

### Option B: Use a Development Server

Deploy your MCP server to a development server with HTTPS for testing.

## Troubleshooting

### Common Issues

1. **"Application not authorized"**
   - User API Keys may not be enabled on the Discourse instance
   - Contact forum administrator

2. **Redirect URI Mismatch**
   - Ensure callback URL is publicly accessible
   - Check that DISCOURSE_REDIRECT_URI matches exactly

3. **Localhost Blocked**
   - Discourse blocks localhost for security
   - Use ngrok or a public development server

4. **Scopes Not Granted**
   - User must approve all requested scopes
   - Required: `read`, `write`, `bookmarks`, `notifications`

## What Happens After Authorization

1. User authorizes on Discourse
2. Discourse redirects to your callback with:
   - `state` (CSRF protection)
   - `nonce` (replay protection)
   - `payload` (encrypted user data)
3. Your server:
   - Validates state/nonce
   - Extracts User API Key
   - Encrypts and stores the key
   - Issues JWT tokens to the mobile app

## Scopes Explained

Your application requests these scopes:

- **read**: View topics, posts, user data
- **write**: Create/edit posts and topics
- **bookmarks**: Manage user bookmarks
- **notifications**: Access user notifications

## Production Deployment

For production:

1. **Use HTTPS**

   ```bash
   DISCOURSE_REDIRECT_URI=https://api.yourapp.com/auth/callback
   ```

2. **SSL Certificate Required**
   - Discourse requires valid SSL certificates
   - Use Let's Encrypt or your hosting provider's SSL

3. **Update Mobile App**
   - Ensure your Expo app opens the auth URL in a browser
   - Handle the deep link callback: `fomio://auth`

## Additional Resources

- [Discourse User API Keys Documentation](https://meta.discourse.org/t/user-api-keys-specification/48536)
- [Discourse API Documentation](https://docs.discourse.org/)
- Contact meta.techrebels.info administrator for instance-specific help

## Note on OAuth2 vs User API Keys

**Why User API Keys instead of OAuth2?**

- User API Keys are Discourse's recommended method for mobile apps
- No server-side OAuth2 application setup required
- Per-user authentication with granular scopes
- Simpler implementation for mobile use cases
