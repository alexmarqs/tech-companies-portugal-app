# Authentication Page

This directory contains the authentication functionality for the Tech Companies Portugal application, integrated with Supabase Auth and PostgreSQL database.

## Features

- **Supabase Integration**: Full authentication with Supabase Auth
- **Sign In/Sign Up Toggle**: Users can switch between sign in and sign up modes
- **Email Confirmation**: Automatic email verification for new accounts
- **Password Reset**: Forgot password functionality with email reset
- **Form Validation**: Real-time validation with error messages
- **Loading States**: Visual feedback during form submission
- **User Session Management**: Automatic session handling and persistence
- **Responsive Design**: Works on all device sizes
- **Consistent Styling**: Uses the existing design system components

## Authentication Flow

### Sign Up Process
1. User fills out sign up form (email, password, full name)
2. Form validation checks all required fields
3. Supabase creates user account
4. User receives confirmation email
5. User clicks confirmation link
6. User profile is created in PostgreSQL database
7. User is redirected to home page

### Sign In Process
1. User enters email and password
2. Supabase validates credentials
3. User session is created and stored
4. User is redirected to home page
5. Navbar updates to show user email and sign out button

### Password Reset Process
1. User clicks "Forgot your password?"
2. User enters email address
3. Supabase sends password reset email
4. User clicks reset link in email
5. User sets new password
6. User can sign in with new password

## Components Used

- `RetroContainer`: Main container with retro styling
- `Card`: Form container with header and content sections
- `Input`: Form input fields with error states
- `Button`: Submit button with loading state
- `Label`: Form field labels
- `useAuth`: Custom hook for authentication state management

## Design Patterns

The authentication page follows the existing design patterns from the codebase:

- **Retro Container**: Uses the `RetroContainer` component with default variant for the main form container
- **Typography**: Uses `font-mono` for consistent monospace font styling
- **Color Scheme**: Uses the existing CSS custom properties for colors
- **Spacing**: Follows the established spacing patterns with Tailwind classes
- **Interactive States**: Hover effects and focus states match the existing components

## Form Validation

- Email validation with regex pattern
- Password minimum length (6 characters)
- Password confirmation matching for sign up
- Required field validation
- Real-time error clearing when user starts typing
- Supabase error message display

## Database Integration

### User Profiles Table
- `id`: UUID (matches Supabase Auth user ID)
- `email`: User's email address
- `full_name`: User's full name
- `avatar_url`: Optional avatar image URL
- `is_active`: Account status
- `created_at`: Profile creation timestamp
- `updated_at`: Last update timestamp

### Automatic Profile Creation
When a user signs up and confirms their email, a profile is automatically created in the PostgreSQL database using Drizzle ORM.

## Navigation

- "Sign In" button in navbar (when not authenticated)
- User email display and "Sign Out" button in navbar (when authenticated)
- "Back to Home" button on the auth page
- Toggle between sign in and sign up modes

## Security Features

- Email confirmation required for new accounts
- Secure password reset via email
- Session management with automatic cleanup
- Protected routes (configurable)
- Environment variable protection
- Type-safe database operations

## API Routes

- `/api/auth/callback`: Handles Supabase auth callbacks and profile creation
- Middleware: Manages authentication state and protected routes

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_supabase_postgresql_connection_string
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Setup Instructions

See `SUPABASE_SETUP.md` in the project root for detailed setup instructions.

## Future Enhancements

- Social login providers (Google, GitHub, etc.)
- Two-factor authentication
- User profile management page
- Admin dashboard for user management
- Advanced role-based access control
- Audit logging for security events