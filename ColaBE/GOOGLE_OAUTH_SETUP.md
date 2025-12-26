# Google OAuth Setup Instructions

## Google Cloud Console Configuration

To complete the Google OAuth integration, you need to set up a Google Cloud Console project and obtain OAuth credentials.

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name (e.g., "ColaStore OAuth")
4. Click "Create"

### Step 2: Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API" or "Google Identity"
3. Click on "Google+ API" and click "Enable"

### Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" user type (unless you have a Google Workspace account)
3. Fill in the required information:
   - App name: ColaStore
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes (optional for basic profile access)
5. Add test users if needed during development

### Step 4: Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Choose "Web application"
4. Configure the settings:
   - Name: ColaStore Web Client
   - Authorized JavaScript origins: `http://localhost:3000` (for development)
   - Authorized redirect URIs: `http://localhost:8800/api/auth/google/callback`
5. Click "Create"

### Step 5: Update Environment Variables

1. Copy the Client ID and Client Secret from the credentials page
2. Update your `.env` file:
   ```
   GOOGLE_CLIENT_ID=your_actual_client_id_here
   GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
   ```
3. Generate a secure session secret:
   ```
   SESSION_SECRET=your_secure_random_string_here
   ```

### Production Configuration

For production deployment, make sure to:
1. Update authorized origins to your production domain
2. Update callback URL to your production API endpoint
3. Use HTTPS for all OAuth URLs
4. Generate a strong, unique session secret

### Security Notes

- Keep your Client Secret secure and never commit it to version control
- Use environment variables for all sensitive configuration
- Enable HTTPS in production for secure OAuth flows
- Regularly rotate your session secret