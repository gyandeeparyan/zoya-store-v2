# 🎯 Quick Start Guide

## 5-Minute Setup

### 1. Clone & Install
```bash
cd zoya-store-v2
npm install --legacy-peer-deps
```

### 2. Configure Environment
Create `.env.local` with your credentials:
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret_key
NEXT_PUBLIC_VALIDATION_API_URL=https://api.isan.eu.org/nickname/ml
MONGODB_URI=mongodb+srv://...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Start Development
```bash
npm run dev
# Open http://localhost:3000
```

---

## Understanding the New Structure

### The Problem (Before)
- ❌ API URLs exposed in browser console
- ❌ Single 400-line component doing everything
- ❌ Hard to test and maintain
- ❌ Security concerns with sensitive data

### The Solution (After)
- ✅ API URLs hidden on server
- ✅ 4 focused, reusable components
- ✅ Clear separation of concerns
- ✅ Server-side security for sensitive operations

### Simple Example Flow

```
User visits /payment
  ↓
Component: PaymentForm (client)
  ↓ (collects user ID & server ID)
  ↓
Action: validateUserAction (server)
  ↓ (API URL is here, not exposed to browser!)
  ↓
Service: validateUserServer (server)
  ↓
External API (safely from server only)
  ↓
Response back to client
  ↓
UI updates with username
```

---

## Key Concepts

### 🔐 Server Actions
Think of them as "secure functions" that run on the server:
```typescript
// This runs ON THE SERVER - can have secrets!
'use server';
export async function validateUserAction(userId: string) {
  // API URL lives here, not sent to browser
  const response = await fetch(`${process.env.API_URL}?id=${userId}`);
  return await response.json();
}
```

### 🎣 Custom Hooks
Reusable logic for client components:
```typescript
'use client';
// This runs IN THE BROWSER - handles UI state
export function useValidation() {
  const [isValidating, setIsValidating] = useState(false);

  const validateUser = async (id: string) => {
    setIsValidating(true);
    // Calls server action (secure!)
    const result = await validateUserAction(id);
    setIsValidating(false);
    return result;
  };

  return { isValidating, validateUser };
}
```

### 📦 Modular Components
Focused, single-purpose components:
```typescript
// Before: One giant component (400 lines)
<PaymentForm />  // Does validation, payment, verification

// After: Focused components
<UserValidationForm />    // Just validates
<CustomerInfoForm />      // Just collects info
<PaymentSummary />        // Just displays summary
<PaymentForm />           // Orchestrates the flow
```

---

## Most Common Tasks

### I want to check if API URLs are hidden
```bash
1. npm run dev
2. Open browser DevTools (F12)
3. Go to Console tab
4. There should be NO "https://api.isan.eu.org" visible
5. Go to Network tab
6. All API calls should be to /api/ or internal endpoints
```

### I want to add a new payment step
```bash
# 1. Create a new component
src/components/MyPaymentStep.tsx

# 2. Add it to PaymentForm's step flow
// In PaymentForm.tsx
type PaymentStep = 'validation' | 'customer-info' | 'my-step' | 'summary';

# 3. Add UI for the step
{step === 'my-step' && <MyPaymentStep />}

# 4. Add navigation between steps
```

### I want to add a new server operation
```bash
# 1. Create server service
src/server/myService.ts
export async function myOperation() { /* ... */ }

# 2. Create server action
src/actions/myAction.ts
export async function myAction() {
  return await myOperation();
}

# 3. Create custom hook (optional)
src/hooks/useMyFeature.ts

# 4. Use in component
const { execute } = useMyFeature();
```

### I need to debug the payment flow
```bash
1. Add console.logs in server services (server logs)
2. npm run dev
3. Check terminal/console for server logs
4. Use browser DevTools to see client flow
5. No API URLs should be visible in browser
```

---

## File Map Quick Reference

```
Need to change...          → Look in...
────────────────────────────────────────
User validation logic       → src/server/validationService.ts
Payment processing logic    → src/server/paymentService.ts
Validation UI              → src/components/UserValidationForm.tsx
Customer form UI           → src/components/CustomerInfoForm.tsx
Payment summary UI         → src/components/PaymentSummary.tsx
Main payment flow          → src/components/PaymentForm.tsx
Validation hook            → src/hooks/useValidation.ts
Payment hook               → src/hooks/usePayment.ts
Error handling             → src/lib/errors.ts
API utilities              → src/lib/apiClient.ts
Environment setup          → .env.local
```

---

## Common Issues & Fixes

### Issue: "API URL shows in console"
```
❌ Problem: Using fetch directly in client component
✅ Solution: Use server action instead
```

### Issue: "Environment variable is undefined"
```
❌ Problem: Forgot to add to .env.local
✅ Solution: Add to .env.local and restart dev server
```

### Issue: "Payment fails silently"
```
❌ Problem: Not checking server logs
✅ Solution: npm run dev and watch terminal for logs
```

### Issue: "Component doesn't update after server action"
```
❌ Problem: Forgetting to call the server action
✅ Solution: Ensure hook/action is being called properly
```

---

## Testing Checklist

Before committing changes, verify:
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] No linting errors (`npm run lint`)
- [ ] Payment flow works end-to-end
- [ ] No API URLs in browser console
- [ ] Error messages are user-friendly
- [ ] Loading states show while processing
- [ ] Server logs show detailed error info

---

## Documentation Files

| File | Purpose |
|------|---------|
| **ARCHITECTURE.md** | Deep dive into the architecture |
| **SETUP_GUIDE.md** | Configuration and setup details |
| **DEVELOPER_CHEATSHEET.md** | Quick reference for developers |
| **REVAMP_SUMMARY.md** | Summary of all changes |
| **VALIDATION_CHECKLIST.md** | What was improved |
| **QUICK_START.md** | This file! |

---

## Need More Help?

### Read the code comments
Every file has detailed comments explaining:
- What it does
- How it works
- Why it's structured this way

### Check related files
Each component/hook/service shows how it's used:
- Imports show dependencies
- JSDoc shows parameters
- Examples show usage patterns

### Search for patterns
Look at similar files to understand the pattern:
```bash
# Search for "use server" to find server functions
# Search for "'use client'" to find client components
# Search for "Server action" to find action bridges
```

---

## Performance Tips

- Keep components small and focused
- Use custom hooks for reusable logic
- Cache expensive computations with `useMemo`
- Cache server actions with `unstable_cache`
- Code split heavy components with `dynamic()`

---

## Next Time You Code

### When adding a new feature:
```
1. Does it need server-side operations? → Create service
2. Need to call from component? → Create server action
3. Reusable logic? → Create custom hook
4. Just UI? → Create component
5. Complex error handling? → Use SafeError
```

### When debugging:
```
1. Browser console → Should show no API URLs
2. Server terminal → Should show detailed logs
3. Network tab → Should only show safe endpoints
4. Test the flow → Validate user → Fill form → Pay
```

---

## You're Ready! 🎉

The codebase is now:
- ✅ More Secure (API URLs hidden)
- ✅ More Modular (focused components)
- ✅ More Maintainable (clear structure)
- ✅ More Scalable (reusable patterns)

Happy coding! 🚀

---

**Version**: 2.0 | **Last Updated**: April 2026
