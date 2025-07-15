# Supabase Integration Setup

This guide will help you set up Supabase authentication and database integration for the Tech Companies Portugal application.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js and npm installed

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `tech-companies-portugal` (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Choose the closest region to your users
5. Click "Create new project"

## Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)
   - **service_role** key (starts with `eyJ`, keep this secret!)

## Step 3: Set Up Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

## Step 4: Set Up Database Schema

1. Generate the database migration:
   ```bash
   npm run db:generate
   ```

2. Apply the migration to your Supabase database:
   ```bash
   npm run db:migrate
   ```

## Step 5: Configure Supabase Authentication

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following:

   **Site URL**: `http://localhost:3000` (for development)
   
   **Redirect URLs**: Add these URLs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/api/auth/callback`
   - `https://your-domain.com/auth/callback` (for production)
   - `https://your-domain.com/api/auth/callback` (for production)

3. **Email Templates** (optional):
   - Customize the confirmation and reset password email templates
   - Update the sender email address

## Step 6: Enable Email Authentication

1. In **Authentication** → **Providers**
2. Make sure **Email** is enabled
3. Configure email settings:
   - **Enable email confirmations**: ✅ (recommended)
   - **Enable secure email change**: ✅ (recommended)
   - **Enable double confirm changes**: ✅ (recommended)

## Step 7: Test the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/auth`
3. Try signing up with a new account
4. Check your email for the confirmation link
5. Sign in with your credentials

## Database Schema

The application uses the following database schema:

### `user_profiles` table
- `id` (UUID, Primary Key): User ID from Supabase Auth
- `email` (Text): User's email address
- `full_name` (Text): User's full name
- `avatar_url` (Text): URL to user's avatar image
- `is_active` (Boolean): Whether the user account is active
- `created_at` (Timestamp): When the profile was created
- `updated_at` (Timestamp): When the profile was last updated

## Features Implemented

### Authentication
- ✅ Email/password sign up and sign in
- ✅ Email confirmation
- ✅ Password reset
- ✅ Sign out functionality
- ✅ Protected routes (configurable)
- ✅ User session management

### User Interface
- ✅ Sign in/Sign up form with validation
- ✅ Loading states and error handling
- ✅ Success messages
- ✅ Responsive design
- ✅ Consistent styling with existing design system

### Database Integration
- ✅ User profile creation on sign up
- ✅ Drizzle ORM integration
- ✅ Database migrations
- ✅ Type-safe database operations

## Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **Service Role Key**: Keep the service role key secret and only use it server-side
3. **CORS**: Configure CORS settings in Supabase if needed
4. **Rate Limiting**: Consider implementing rate limiting for auth endpoints
5. **Email Verification**: Enable email confirmation for production

## Production Deployment

1. Update environment variables with production URLs
2. Set up proper redirect URLs in Supabase
3. Configure email templates for your domain
4. Set up monitoring and logging
5. Consider implementing additional security measures

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**:
   - Check that your environment variables are correctly set
   - Verify the API keys in your Supabase dashboard

2. **"Redirect URL not allowed" error**:
   - Add your redirect URLs to the Supabase authentication settings
   - Make sure the URLs match exactly (including protocol and port)

3. **Database connection errors**:
   - Verify your `DATABASE_URL` is correct
   - Check that your database password is properly URL-encoded
   - Ensure your IP is allowed in Supabase database settings

4. **Email not sending**:
   - Check Supabase email settings
   - Verify your email templates are configured
   - Check spam folder for confirmation emails

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [Drizzle Documentation](https://orm.drizzle.team)