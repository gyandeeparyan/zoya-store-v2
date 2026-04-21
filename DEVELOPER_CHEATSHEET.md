# 🚀 Quick Reference - Developer Cheat Sheet

## File Structure at a Glance

```
src/
├── actions/              # Server actions - API bridge
│   ├── validation.ts     # User validation
│   └── payment.ts        # Payment processing
├── server/               # Server-only services
│   ├── validationService.ts
│   └── paymentService.ts
├── hooks/                # Custom React hooks
│   ├── useValidation.ts
│   └── usePayment.ts
├── lib/                  # Utilities
│   ├── errors.ts         # Error handling
│   └── apiClient.ts      # Fetch utilities
└── components/           # UI Components
    ├── PaymentForm.tsx
    ├── UserValidationForm.tsx
    ├── CustomerInfoForm.tsx
    └── PaymentSummary.tsx
```

## Key Patterns

### 1. Calling Server Actions from Client Components
```typescript
'use client';

import { validateUserAction } from '@/actions/validation';

const result = await validateUserAction(userId, serverId);
if (result.success) {
  // Handle success
} else {
  // Handle error with result.message
}
```

### 2. Creating a New Server Action
```typescript
// 1. Create server service
// src/server/myService.ts
'use server';
export async function myServerLogic(data: any) { /* ... */ }

// 2. Create server action
// src/actions/myAction.ts
'use server';
export async function myAction(input: any) {
  const result = await myServerLogic(input);
  return { success: result.success, message: result.error };
}

// 3. Create custom hook (optional)
// src/hooks/useMyFeature.ts
'use client';
export function useMyFeature() {
  const [loading, setLoading] = useState(false);
  const execute = async (input: any) => {
    setLoading(true);
    const result = await myAction(input);
    setLoading(false);
    return result.success;
  };
  return { loading, execute };
}

// 4. Use in component
// src/components/MyComponent.tsx
'use client';
const { loading, execute } = useMyFeature();
// Use execute() when needed
```

### 3. Error Handling
```typescript
import { getSafeErrorMessage, logError } from '@/lib/errors';

try {
  // Some operation
} catch (error) {
  // Show user a safe message
  toast.error(getSafeErrorMessage(error));
  // Log full details server-side
  logError('ComponentName', error, { context: 'data' });
}
```

### 4. Environment Variables
```typescript
// Public (visible to client)
process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

// Private (server-only)
process.env.RAZORPAY_KEY_SECRET

// Use in .env.local
NEXT_PUBLIC_RAZORPAY_KEY_ID=value
RAZORPAY_KEY_SECRET=value
```

## Component Checklist

### For New Components
- [ ] Decide: Client or Server?
- [ ] Add appropriate pragma ('use client' or 'use server')
- [ ] Define TypeScript interfaces
- [ ] Add JSDoc comments
- [ ] Handle loading states
- [ ] Handle error states
- [ ] Import from correct paths

### For API Integration
- [ ] Create server service in `src/server/`
- [ ] Create server action in `src/actions/`
- [ ] Create custom hook if reusable
- [ ] Use server action from client component
- [ ] Add proper error handling
- [ ] Add environment variables if needed

## Common Tasks

### Validate User Input on Server
```typescript
'use server';

export async function myAction(input: any) {
  // Validate
  if (!input.name?.trim()) {
    return { success: false, message: 'Name is required' };
  }

  // Sanitize
  const name = input.name.trim().slice(0, 100);

  // Process
  return { success: true };
}
```

### Call External API Safely
```typescript
'use server';

export async function fetchFromExternalAPI(url: string) {
  try {
    // API URL can include secrets - only on server
    const fullUrl = `${url}?key=${process.env.API_KEY}`;
    const response = await fetch(fullUrl);

    if (!response.ok) {
      return { success: false, message: 'API call failed' };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('[ServiceName] Error:', error);
    return { success: false, message: 'Request failed' };
  }
}
```

### Display Loading State
```typescript
'use client';

import { Loader2 } from 'lucide-react';

export function MyComponent() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <button disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="animate-spin" />
          Loading...
        </>
      ) : (
        'Click Me'
      )}
    </button>
  );
}
```

## DO's and DON'Ts

### ✅ DO

- ✅ Use server actions for external API calls
- ✅ Keep API URLs in environment variables
- ✅ Validate input on server
- ✅ Return safe error messages to client
- ✅ Log full errors server-side
- ✅ Mark client components with 'use client'
- ✅ Mark server functions with 'use server'
- ✅ Use TypeScript interfaces for type safety

### ❌ DON'T

- ❌ Call external APIs from client components
- ❌ Expose API URLs in browser
- ❌ Send full error details to client
- ❌ Store secrets in environment variables prefixed with NEXT_PUBLIC_
- ❌ Trust user input - always validate server-side
- ❌ Log sensitive information
- ❌ Make direct fetch calls without error handling
- ❌ Mix server and client logic in one function

## File Naming Conventions

```
Server Actions:     src/actions/myAction.ts
Server Services:    src/server/myService.ts
Custom Hooks:       src/hooks/useMyHook.ts
Components:         src/components/MyComponent.tsx
Utilities:          src/lib/myUtil.ts
Context:            src/context/myContext.tsx
Models:             src/models/myModel.ts
Types:              src/types/myTypes.ts
```

## Terminal Commands

```bash
# Development
npm run dev                    # Start dev server

# Build & Deploy
npm run build                  # Build for production
npm run start                  # Start production server

# Code Quality
npm run lint                   # Run ESLint
npx tsc --noEmit              # Check types

# Database
# npx mongoose generate:model   # Generate model (if using mongoose CLI)
```

## Useful Links

- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [React Hooks Documentation](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Common Errors & Solutions

| Error | Solution |
|-------|----------|
| "RAZORPAY_KEY_SECRET is undefined" | Add to `.env.local` and restart server |
| "API URL not found" | Check `.env.local` has NEXT_PUBLIC_* variables |
| "Cannot find module '@/..'" | Check path alias in `tsconfig.json` |
| "Hydration mismatch" | Client/Server content doesn't match - check 'use client' pragma |
| "FormData undefined on server" | FormData not available in server actions |

## Performance Tips

1. **Memoize expensive computations**
   ```typescript
   const memoized = useMemo(() => expensiveFunction(data), [data]);
   ```

2. **Cache server action results**
   ```typescript
   export const cachedAction = unstable_cache(
     async (input) => { /* ... */ },
     ['cache-key'],
     { revalidate: 3600 }
   );
   ```

3. **Code split components**
   ```typescript
   const HeavyComponent = dynamic(() => import('./Heavy'), {
     loading: () => <div>Loading...</div>
   });
   ```

---

**Version**: 2.0 | **Last Updated**: April 2026
