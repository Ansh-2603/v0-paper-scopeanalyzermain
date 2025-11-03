# PaperScope Setup Instructions

## 1. Database Setup

### Create the Chat History Table

The app now includes a migration script to create the `chat_history` table where user analysis sessions are stored.

**Steps:**
1. Go to your Supabase project at https://app.supabase.com
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `scripts/01-create-chat-history-table.sql`
5. Click **Run**

The table will be created with:
- Row Level Security (RLS) enabled to ensure users can only access their own data
- Automatic timestamps for created_at and updated_at
- Indexes for fast queries
- Foreign key constraint to auth.users table

---

## 2. Google OAuth Setup in Supabase

### Configure Redirect URLs

1. Go to your Supabase project: https://app.supabase.com
2. Navigate to **Authentication** → **Providers** → **Google**
3. Make sure the following redirect URLs are configured in both Supabase AND Google Cloud Console:
   - For production: `https://fnurgcnpqluiqfkzknne.supabase.co/auth/v1/callback`
   - For local development: `http://localhost:3000/auth/callback`

### Check Google Console Settings

1. Visit https://console.cloud.google.com/apis/credentials
2. Click your OAuth 2.0 Client ID (110545073691-vi993pdkatqvvv5vrmshj5na6m59j55.apps.googleusercontent.com)
3. Under **Authorized redirect URIs**, ensure both URLs from above are listed
4. Save changes

---

## 3. Gemini API Key Fallback

The app now includes automatic fallback to a secondary Gemini API key if the primary key's quota is exceeded.

- Primary key: `AIzaSyBt1X2KlkaAhLhojgIcPHg_FMoPK50aMGc`
- Fallback key: `AIzaSyDKH7Oylnula--xuIjDPSiqEzcb9WNwe3o`

If you experience "quota exceeded" errors, the app will automatically retry with the fallback key.

---

## 4. Environment Variables

Make sure these are set in your v0 project's **Vars** section:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://fnurgcnpqluiqfkzknne.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZudXJnY25wcWx1aXFma3prbm5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNDcwMTEsImV4cCI6MjA3NzcyMzAxMX0.Tw9v3Dtv1ZexedRJDdkcBEXY2Pou6Qqq3bVKu59Gv0I
\`\`\`

---

## Testing

1. **Test Email/Password Auth:**
   - Create an account with email and password
   - Verify you can log in

2. **Test Google OAuth:**
   - Click "Continue with Google"
   - You should be redirected to Google login
   - After authentication, you should be redirected back to the app

3. **Test Analysis Storage:**
   - Upload documents and run analysis
   - Check that the analysis appears in your chat history
   - Refresh the page and verify the history persists

---

## Troubleshooting

### "Auth not available" or missing environment variables
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in Vars

### Google OAuth not redirecting
- Verify the redirect URLs are exact (no trailing slashes, include `/auth/v1/callback`)
- Check both Supabase and Google Cloud Console have matching URLs
- Clear browser cache and try again

### Analysis not saving to history
- Ensure you're logged in (check user email in console)
- Verify the `chat_history` table exists in Supabase
- Check Row Level Security is allowing your user to insert data
