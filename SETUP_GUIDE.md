/**
 * Configuration and Setup Guide for Revamped Zoya Store
 *
 * This file provides step-by-step instructions for setting up
 * and using the new modular, secure architecture.
 */

# ⚙️ Configuration & Setup Guide

## 1. Environment Variables

Create `.env.local` in the project root:

```env
# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_here
RAZORPAY_KEY_ID=rzp_test_your_key_here
RAZORPAY_KEY_SECRET=your_secret_key_here

# Validation API
NEXT_PUBLIC_VALIDATION_API_URL=https://api.isan.eu.org/nickname/ml

# MongoDB Connection
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Environment Variable Breakdown

| Variable | Type | Purpose | Visibility |
|----------|------|---------|------------|
| `RAZORPAY_KEY_ID` | Secret | Razorpay API authentication | Server-only |
| `RAZORPAY_KEY_SECRET` | Secret | Payment signature verification | Server-only |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Public | Client-side Razorpay initialization | Browser |
| `NEXT_PUBLIC_VALIDATION_API_URL` | Public | User validation API endpoint | Server-only (used via server actions) |
| `MONGODB_URI` | Secret | Database connection | Server-only |
| `NEXT_PUBLIC_APP_URL` | Public | Application URL for redirects | Browser |

## 2. Development Setup

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

## 3. Using the New Architecture

### Example: Adding a New Feature with Server-Side API

#### Step 1: Create Server Service
```typescript
// src/server/myService.ts
'use server';

export async function myServerOperation(data: any) {
  try {
    // Call external API or database
    const result = await fetch('external-api');
    return { success: true, data: result };
  } catch (error) {
    console.error('[MyService] Error:', error);
    return { success: false, error: 'Operation failed' };
  }
}
```

#### Step 2: Create Server Action
```typescript
// src/actions/myAction.ts
'use server';

import { myServerOperation } from '@/server/myService';

export async function myAction(input: any) {
  const result = await myServerOperation(input);

  if (!result.success) {
    return { success: false, message: result.error };
  }

  return { success: true, message: 'Success', data: result.data };
}
```

#### Step 3: Create Custom Hook (Optional)
```typescript
// src/hooks/useMyFeature.ts
'use client';

import { useState } from 'react';
import { myAction } from '@/actions/myAction';

export function useMyFeature() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (input: any) => {
    setLoading(true);
    setError(null);

    try {
      const result = await myAction(input);
      if (!result.success) {
        setError(result.message);
        return false;
      }
      return true;
    } catch (err) {
      setError('An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, execute };
}
```

#### Step 4: Use in Client Component
```typescript
// src/components/MyComponent.tsx
'use client';

import { useMyFeature } from '@/hooks/useMyFeature';

export function MyComponent() {
  const { loading, error, execute } = useMyFeature();

  const handleSubmit = async (data: any) => {
    const success = await execute(data);
    if (success) {
      // Handle success
    }
  };

  return (
    <div>
      <button onClick={() => handleSubmit({})}>
        {loading ? 'Loading...' : 'Submit'}
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

## 4. Component Communication Pattern

```
┌─────────────────────────────────────────────┐
│  Client Component ('use client')            │
│  - Handles UI/UX                            │
│  - User interactions                        │
│  - Calls server actions                     │
└──────────────┬──────────────────────────────┘
               │
               ├─→ Server Action ('use server')
               │   - Input validation
               │   - Delegates to service
               │   - Returns safe results
               │
               └─→ Server Service ('use server')
                   - External API calls
                   - Database operations
                   - Sensitive operations
                   - Error logging
```

## 5. Error Handling Pattern

### Creating Safe Errors

```typescript
import { SafeError, ValidationError, PaymentError } from '@/lib/errors';

// Validation errors
throw new ValidationError('Email is invalid');

// Payment errors
throw new PaymentError('Card declined');

// Generic safe errors
throw new SafeError('Operation failed', 'OPERATION_FAILED');
```

### Handling Errors

```typescript
import { getSafeErrorMessage, logError } from '@/lib/errors';

try {
  // Some operation
} catch (error) {
  // User sees safe message
  const userMessage = getSafeErrorMessage(error);
  toast.error(userMessage);

  // Server logs full details
  logError('MyComponent', error, { userId: 123 });
}
```

## 6. Database Operations

### Example: Creating an Order
```typescript
// src/server/orderService.ts
'use server';

import dbConnect from '@/database/dbConnect';
import { Order } from '@/models/order.model';

export async function createOrderServer(data: any) {
  try {
    await dbConnect();

    const order = await Order.create({
      ...data,
      createdAt: new Date()
    });

    return { success: true, orderId: order._id };
  } catch (error) {
    console.error('[OrderService] Error creating order:', error);
    return { success: false, error: 'Failed to create order' };
  }
}
```

## 7. TypeScript Best Practices

### Define Input/Output Types
```typescript
interface CreateOrderInput {
  amount: number;
  customerId: string;
  items: OrderItem[];
}

interface CreateOrderOutput {
  success: boolean;
  orderId?: string;
  error?: string;
}

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderOutput> {
  // Implementation
}
```

### Using Zod for Validation
```typescript
import { z } from 'zod';

const OrderSchema = z.object({
  amount: z.number().positive(),
  customerId: z.string().min(1),
  items: z.array(z.object({
    id: z.string(),
    quantity: z.number().positive()
  }))
});

type Order = z.infer<typeof OrderSchema>;

export async function createOrder(input: unknown) {
  const validated = OrderSchema.parse(input);
  // Now safely use validated data
}
```

## 8. Testing Server Actions

```typescript
// Example test
import { validateUserAction } from '@/actions/validation';

describe('validateUserAction', () => {
  it('should validate user successfully', async () => {
    const result = await validateUserAction('user123', 'server456');

    expect(result.success).toBe(true);
    expect(result.username).toBeDefined();
  });

  it('should handle validation failure', async () => {
    const result = await validateUserAction('invalid', 'invalid');

    expect(result.success).toBe(false);
    expect(result.message).toBeDefined();
  });
});
```

## 9. Monitoring & Debugging

### Enable Detailed Logging
```typescript
// In server services
console.error('[ServiceName] Error context:', {
  userId: user?.id,
  timestamp: new Date().toISOString(),
  errorMessage: error.message,
  stack: error.stack
});
```

### Check Server Logs
```bash
# Development
npm run dev
# Check terminal for logs

# Production
# Check your hosting provider's logs (Vercel, etc.)
```

## 10. Performance Optimization

### Caching Server Action Results
```typescript
import { unstable_cache } from 'next/cache';

export const cachedValidation = unstable_cache(
  async (userId: string) => {
    return await validateUserServer(userId);
  },
  ['user-validation'], // cache key
  { revalidate: 3600 } // 1 hour
);
```

### Rate Limiting
```typescript
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'),
});

export async function protectedAction(userId: string) {
  const { success } = await ratelimit.limit(userId);

  if (!success) {
    throw new Error('Rate limit exceeded');
  }

  // Proceed with action
}
```

## 11. Deployment Checklist

- [ ] Set environment variables in hosting provider
- [ ] Test payment integration with test keys
- [ ] Verify API endpoints are accessible
- [ ] Check error logging is working
- [ ] Test validation with real data
- [ ] Verify database connections
- [ ] Review security headers
- [ ] Set up monitoring/alerting

## 12. Troubleshooting

### "API URL exposed in console"
**Solution**: Use server actions instead of direct fetch
```typescript
// ❌ Wrong
await fetch('https://external-api.com/endpoint');

// ✅ Correct
await myServerAction();
```

### "Razorpay key undefined"
**Solution**: Ensure environment variables are set and application is restarted
```bash
# Check .env.local exists
cat .env.local

# Restart dev server
npm run dev
```

### "Database connection failed"
**Solution**: Verify MONGODB_URI is correct and network access is allowed
```typescript
// Test connection
await dbConnect();
console.log('Connected to MongoDB');
```

---

**Last Updated**: April 2026
**Version**: 2.0
