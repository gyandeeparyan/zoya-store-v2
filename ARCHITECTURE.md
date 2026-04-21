# Zoya Store - Architecture Guide

## Overview

This document outlines the refactored architecture focusing on modularity, security, and proper client/server separation.

## Key Improvements

### 1. **Security Enhancements**

#### 🔒 Hidden API URLs
- **Before**: External API URLs were visible in client-side components (console exposure)
- **After**: All external API calls are handled server-side through server actions
- API URLs are stored in environment variables and never sent to the browser

```
External API (e.g., https://api.isan.eu.org/)
    ↓
Server Actions (src/actions/)
    ↓
Client Components (safe - no URL exposure)
```

#### 🔐 Secure Payment Processing
- Razorpay key secret stays exclusively on the server
- Signature verification happens server-side only
- Client never receives sensitive payment information

### 2. **Modular Architecture**

```
src/
├── components/          # UI Components
│   ├── PaymentForm.tsx            # Main payment orchestrator
│   ├── UserValidationForm.tsx     # Modular validation form
│   ├── CustomerInfoForm.tsx       # Modular customer info collection
│   └── PaymentSummary.tsx         # Order summary display
│
├── actions/             # Server Actions (Next.js)
│   ├── validation.ts             # User validation actions
│   └── payment.ts                # Payment processing actions
│
├── server/              # Server-only services
│   ├── validationService.ts      # External API integration
│   └── paymentService.ts         # Razorpay integration
│
├── hooks/               # Custom React Hooks
│   ├── useValidation.ts          # Validation logic
│   ├── usePayment.ts             # Payment processing logic
│   └── use-toast.ts              # UI notifications
│
├── lib/                 # Utilities
│   ├── errors.ts                 # Error handling
│   ├── apiClient.ts              # Fetch utilities
│   └── razorpay.ts               # Razorpay loader
│
└── context/             # React Context
    ├── cartContext.tsx           # Cart state
    ├── userContext.tsx           # User info
    └── couponPurchaseContext.tsx # Purchase tracking
```

### 3. **Client vs Server Boundaries**

#### Client Components (use 'use client')
- `PaymentForm.tsx` - Orchestrates UI flow
- `UserValidationForm.tsx` - Handles user input
- `CustomerInfoForm.tsx` - Collects customer data
- `PaymentSummary.tsx` - Displays information

#### Server Actions ('use server')
- `actions/validation.ts` - Delegates to validation service
- `actions/payment.ts` - Delegates to payment service

#### Server-Only Services (never run on client)
- `server/validationService.ts` - Makes external API calls
- `server/paymentService.ts` - Manages Razorpay integration

### 4. **Data Flow**

#### User Validation Flow
```
User Input (Client)
    ↓
UserValidationForm (Client Component)
    ↓
validateUserAction (Server Action) - Server
    ↓
validateUserServer (Server Service) - Server
    ↓
External API Call (Server-side only)
    ↓
Response sent back to client (no URL exposed)
```

#### Payment Flow
```
User Submission (Client)
    ↓
PaymentForm (Client Component)
    ↓
createPaymentOrderAction (Server Action) - Server
    ↓
createOrderServer (Server Service) - Server
    ↓
Razorpay API Call (Server-side)
    ↓
Order ID returned to client
    ↓
Razorpay Popup (Client-side)
    ↓
Payment Callback
    ↓
verifyPaymentAction (Server Action) - Server
    ↓
Signature Verification (Server)
```

## Configuration

### Environment Variables

```env
# Public (visible in browser)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_VALIDATION_API_URL=https://api.isan.eu.org/nickname/ml

# Private (server-only)
RAZORPAY_KEY_SECRET=your_secret
RAZORPAY_KEY_ID=your_key
MONGODB_URI=your_mongo_uri
```

## Component Responsibilities

### PaymentForm.tsx
- Main orchestrator component
- Manages payment flow states (validation → customer-info → summary → payment)
- Handles navigation between steps
- No direct API calls

### UserValidationForm.tsx
- Collects user ID and server ID
- Calls server action for validation
- Displays validation status
- Single responsibility: user input → server action

### CustomerInfoForm.tsx
- Collects customer contact information
- Basic form validation
- No server calls
- Delegates to parent component

### PaymentSummary.tsx
- Pure presentational component
- Displays order details
- No state management or API calls

## Custom Hooks

### useValidation()
```typescript
const { isValidating, isValidated, username, error, validateUser, reset } = useValidation();

// Call server action
const success = await validateUser(userId, serverId);
```

### usePayment(onSuccess)
```typescript
const { isProcessing, isVerifying, error, processPayment } = usePayment(() => {
  // Handle success
});

// Process payment
await processPayment(paymentPayload);
```

## Error Handling

All errors are handled safely without exposing sensitive information:

```typescript
// Safe error class
export class SafeError extends Error {
  constructor(userMessage: string, code?: string) { }
}

// Usage
try {
  // Some operation
} catch (error) {
  const safeMessage = getSafeErrorMessage(error);
  toast.error(safeMessage); // User sees safe message
  // Server logs full error details
}
```

## Migration from Old Code

### Old Pattern (❌ Insecure)
```typescript
'use client';

// ❌ API URL exposed in browser
const response = await fetch(`https://api.isan.eu.org/nickname/ml?id=${id}&zone=${zone}`);
```

### New Pattern (✅ Secure)
```typescript
'use client';

// ✅ Call server action - API is hidden
const result = await validateUserAction(id, zone);
```

## API Routes (Deprecated)

Old API routes in `src/app/api/` are kept for backwards compatibility but should not be used for new features. Use server actions instead.

### Example Migration

**Before:**
```typescript
// Component makes direct API call
await fetch('/api/create-order', { method: 'POST', body });
```

**After:**
```typescript
// Component calls server action
const result = await createPaymentOrderAction(payload);
```

## Security Checklist

- ✅ External API URLs hidden on server
- ✅ API keys never exposed to client
- ✅ Razorpay signature verification server-side
- ✅ Input validation on server
- ✅ Safe error messages for users
- ✅ Detailed error logging on server
- ✅ No console.logs of sensitive data
- ✅ Proper environment variable separation

## Performance Considerations

1. **Server Actions**: Lower latency than API routes (direct server function calls)
2. **Component Splitting**: Smaller, focused components improve bundle size
3. **Custom Hooks**: Reusable logic reduces code duplication
4. **Error Recovery**: Safe error handling improves UX

## Testing

Each component can be tested independently:

```typescript
// Test component
const { getByText } = render(<UserValidationForm />);

// Mock server action
jest.mock('@/actions/validation', () => ({
  validateUserAction: jest.fn().mockResolvedValue({ success: true, username: 'testuser' })
}));
```

## Future Improvements

1. **Type Safety**: Add Zod schemas for all API responses
2. **Rate Limiting**: Implement rate limiting on server actions
3. **Caching**: Cache validation results with TTL
4. **Analytics**: Track payment flows without exposing sensitive data
5. **Error Recovery**: Implement automatic retry logic with exponential backoff
6. **Monitoring**: Set up error tracking (Sentry, etc.)

## Useful Commands

```bash
# Development
npm run dev

# Build
npm run build

# Lint
npm run lint

# Type check
npx tsc --noEmit
```

## Support

For questions about the architecture, refer to:
- Individual file comments
- This guide
- Component JSDoc comments
