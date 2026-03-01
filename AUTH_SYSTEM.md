# Authentication System Documentation

## Overview

The AI Workshop Platform now includes a comprehensive authentication system with session management, protected routes, and user role support.

## Features

### 1. User Authentication
- **Login**: Email and password authentication
- **Signup**: New user registration with validation
- **Logout**: Secure session termination
- **Session Management**: 24-hour session duration with automatic expiry

### 2. User Roles
- **Student**: Regular workshop participants (max 60)
- **Admin**: Platform administrators with full access

### 3. Security Features
- Password validation (minimum 6 characters)
- Email format validation
- Duplicate email/USN prevention
- Session expiry checking
- Protected routes with automatic redirect

### 4. UI/UX Features
- Modern gradient design with glassmorphism
- Show/hide password toggle
- Real-time validation feedback
- Loading states and animations
- Responsive design for all devices
- Student count display with spots remaining

## File Structure

```
workshop/
├── lib/
│   ├── auth.ts              # Core authentication logic
│   └── AuthContext.tsx      # React context for global auth state
├── components/
│   └── ProtectedRoute.tsx   # HOC for route protection
├── app/
│   ├── login/
│   │   └── page.tsx         # Login page
│   ├── signup/
│   │   └── page.tsx         # Signup page
│   ├── dashboard/
│   │   └── page.tsx         # Protected dashboard
│   └── layout.tsx           # Root layout with AuthProvider
```

## Usage

### Protecting Routes

Wrap any page component with `ProtectedRoute`:

```tsx
import ProtectedRoute from '@/components/ProtectedRoute';

export default function MyPage() {
  return (
    <ProtectedRoute>
      <YourContent />
    </ProtectedRoute>
  );
}
```

For admin-only routes:

```tsx
<ProtectedRoute requireAdmin={true}>
  <AdminContent />
</ProtectedRoute>
```

### Using Auth Context

Access authentication state in any component:

```tsx
import { useAuth } from '@/lib/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  
  return (
    <div>
      {isAuthenticated && <p>Welcome, {user?.name}!</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Auth Functions

Available functions from `lib/auth.ts`:

```typescript
// Authentication
login(email: string, password: string): AuthResult
signup(name: string, usn: string, email: string, password: string): AuthResult
logout(): void

// User Management
getCurrentUser(): User | null
isAuthenticated(): boolean
isAdmin(): boolean
updateProfile(updates: Partial<User>): AuthResult
changePassword(currentPassword: string, newPassword: string): AuthResult

// Validation
validateEmail(email: string): { valid: boolean; error?: string }
validatePassword(password: string): { valid: boolean; error?: string }

// Statistics
getStudentCount(): number
getAllUsers(): User[] // Admin only
```

## Default Credentials

### Admin Account
- **Email**: admin@workshop.com
- **Password**: admin123

### Student Registration
- Maximum 60 students allowed
- Requires: Name, USN, Email, Password
- Password must be at least 6 characters

## Session Management

- **Duration**: 24 hours
- **Storage**: localStorage (can be upgraded to Supabase)
- **Auto-refresh**: Checks session validity every 5 minutes
- **Expiry**: Automatic logout when session expires

## Security Notes

⚠️ **Current Implementation**: Uses localStorage for demo purposes

For production deployment:
1. Replace localStorage with secure backend (Supabase recommended)
2. Implement proper password hashing (bcrypt)
3. Add JWT tokens for API authentication
4. Enable HTTPS only
5. Add rate limiting for login attempts
6. Implement email verification
7. Add password reset functionality

## Migration to Supabase

The current system is designed to be easily migrated to Supabase:

1. Replace `lib/auth.ts` functions with Supabase Auth API calls
2. Update `AuthContext.tsx` to use Supabase session management
3. Configure Supabase client in environment variables
4. Update protected routes to use Supabase session checking

## Testing

### Test Accounts

You can create test accounts through the signup page or use the admin account.

### Testing Protected Routes

1. Visit `/dashboard` without logging in → Redirects to `/login`
2. Login with valid credentials → Access granted
3. Logout → Session cleared, redirected to login

## Troubleshooting

### Session Not Persisting
- Check browser localStorage is enabled
- Clear localStorage and try again: `localStorage.clear()`

### Can't Login
- Verify credentials are correct
- Check browser console for errors
- Ensure admin account is initialized

### Student Limit Reached
- Check current count: `getStudentCount()`
- Admin can view all users: `getAllUsers()`
- Clear test accounts if needed

## Future Enhancements

- [ ] Email verification
- [ ] Password reset via email
- [ ] Two-factor authentication
- [ ] Social login (Google, GitHub)
- [ ] Remember me functionality
- [ ] Account deletion
- [ ] Profile picture upload
- [ ] Activity logging
- [ ] Admin dashboard for user management
