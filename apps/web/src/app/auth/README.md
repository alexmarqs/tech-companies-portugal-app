# Authentication Page

This directory contains the authentication functionality for the Tech Companies Portugal application.

## Features

- **Sign In/Sign Up Toggle**: Users can switch between sign in and sign up modes
- **Form Validation**: Real-time validation with error messages
- **Loading States**: Visual feedback during form submission
- **Responsive Design**: Works on all device sizes
- **Consistent Styling**: Uses the existing design system components

## Components Used

- `RetroContainer`: Main container with retro styling
- `Card`: Form container with header and content sections
- `Input`: Form input fields with error states
- `Button`: Submit button with loading state
- `Label`: Form field labels

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
- Password confirmation matching
- Required field validation
- Real-time error clearing when user starts typing

## Navigation

- "Sign In" button in the navbar links to `/auth`
- "Back to Home" button on the auth page
- Toggle between sign in and sign up modes

## Future Enhancements

- Integration with authentication service (Auth0, Firebase, etc.)
- Password reset functionality
- Social login options
- Remember me functionality
- Session management
- Protected route implementation