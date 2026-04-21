# 🔧 Payment Flow Troubleshooting Guide

## Issue: "Proceed to Payment" doesn't trigger anything

### Step 1: Check Environment Variables

⚠️ **Most Common Issue**: Placeholder values still set in `.env.local`

Open `.env.local` and verify:

```env
# ❌ WRONG (Placeholder)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# ✅ CORRECT (Actual Keys)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_actual_secret_key
```

**Action Required**:
1. Get your Razorpay keys from [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Replace placeholder values in `.env.local`
3. **Restart the dev server**: `npm run dev`

### Step 2: Open Browser Console

Open DevTools (`F12` or `Ctrl+Shift+I`) → Console tab

You should see logs like:
```
[usePayment] Starting payment process...
[usePayment] Order created: ORD123456789
[usePayment] Razorpay loaded
[usePayment] Opening Razorpay with options: {...}
[usePayment] Razorpay payment window opened
```

**If you see these logs** → Payment is working, just waiting for payment popup

**If you see errors** → Note the error message and check below

### Step 3: Check for Common Errors

#### Error: "Razorpay is not configured"
```
⚠️ Razorpay is not configured. Please set NEXT_PUBLIC_RAZORPAY_KEY_ID in .env.local
```
**Fix**: Update `.env.local` with actual Razorpay keys (see Step 1)

#### Error: "Payment gateway is not configured"
```
⚠️ Payment gateway is not configured
```
**Fix**: Restart dev server after updating `.env.local`

#### Error: "Order creation failed"
```
❌ Order creation failed: [message]
```
**Possible fixes**:
- Check MongoDB connection in `.env.local`
- Verify database is accessible
- Check server logs for detailed error

#### Error: "Failed to load Razorpay"
```
❌ Failed to load Razorpay
```
**Possible fixes**:
- Check internet connection
- Razorpay CDN might be blocked
- Try in incognito mode to avoid cache issues

### Step 4: Check Network Tab

DevTools → Network tab → Proceed to Payment

Look for:
1. `createPaymentOrderAction` call → Should return order details
2. `checkout.razorpay.com/v1/checkout.js` → Razorpay script loading
3. No errors in request/response

### Step 5: Verify Database Connection

In `.env.local`, ensure `MONGODB_URI` is correct:

```env
# ❌ WRONG
MONGODB_URI=your_mongodb_uri

# ✅ CORRECT
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
```

### Step 6: Test with Console Logging

Add this to browser console:

```javascript
// Check if Razorpay key is set
console.log('Razorpay Key:', process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

// Try to manually load Razorpay
fetch('https://checkout.razorpay.com/v1/checkout.js')
  .then(r => console.log('Razorpay CDN: OK', r.status))
  .catch(e => console.error('Razorpay CDN: FAILED', e));
```

## Complete Checklist

- [ ] `.env.local` has real Razorpay keys (not "your_razorpay_key_id")
- [ ] Dev server restarted after `.env.local` changes
- [ ] MongoDB URI is correct in `.env.local`
- [ ] Items added to cart
- [ ] Validation step completed
- [ ] Customer info filled
- [ ] Browser console shows no errors
- [ ] Network tab shows order creation API call
- [ ] Razorpay payment popup appears (or error shown)

## Getting Razorpay Keys

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to Settings → API Keys
3. Copy Key ID and Key Secret
4. Use Test keys first (start with `rzp_test_`)

## Test Payment Details

When Razorpay popup appears, use these test credentials:

**Test Card**:
- Number: `4111 1111 1111 1111`
- Expiry: Any future date (e.g., 12/25)
- CVV: Any 3 digits

**Test UPI**: `success@razorpay`

**Test Wallet**: Any test credentials from [Razorpay Docs](https://razorpay.com/docs/payments/test-mode/)

## Still Not Working?

### Check server logs:
```bash
# Terminal where npm run dev is running
# Look for [Payment Service] or [createPaymentOrderAction] logs
```

### Enable debug logging:

Create `DEBUG_PAYMENT=true` in `.env.local`:
```env
DEBUG_PAYMENT=true
```

Then check browser console for extra logs.

### Common Issues Database

| Symptom | Cause | Fix |
|---------|-------|-----|
| Nothing happens after click | Razorpay key not set | Update `.env.local` + restart |
| Payment popup appears but frozen | Razorpay script loading failed | Check internet, try incognito |
| Order creation fails | DB connection issue | Check MongoDB URI |
| Silent failure with no console logs | Client/server mismatch | Check browser vs server console |
| "undefined" errors | Missing environment variables | Restart dev server |

## Debug Tips

### To isolate the problem:

1. **Add this to PaymentForm.tsx** (temporarily):
```typescript
const handleProceedToPayment = async () => {
  console.log('1. Starting payment...');
  console.log('2. Purchase details:', purchaseDetails);
  console.log('3. Customer data:', customerData);
  console.log('4. Razorpay key:', process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
  // ... rest of function
};
```

2. **Check order creation**:
- Open MongoDB and look for recent orders in `couponspurchases` collection
- If order exists → Problem is with Razorpay loading
- If order doesn't exist → Problem is with order creation

3. **Test Razorpay directly**:
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
<script>
var options = {
  key: "YOUR_KEY_HERE",
  amount: 5000,
  order_id: "order_test",
  currency: "INR",
  name: "Test",
  description: "Test Payment",
  handler: function(response) {
    console.log('Payment successful:', response);
  }
};
var rzp = new Razorpay(options);
rzp.open();
</script>
```

## Getting Help

If still stuck:

1. **Check the logs**:
   - Browser Console (F12)
   - Server Terminal (where npm run dev runs)

2. **Verify configuration**:
   - `.env.local` has real keys
   - MongoDB connection works
   - Internet is stable

3. **Try these**:
   - Restart dev server: `npm run dev`
   - Clear cache: Hard refresh (Ctrl+Shift+R)
   - Try incognito mode: F12 → Console → New Incognito window
   - Check firewall/VPN settings

---

**Last Updated**: April 21, 2026
**Version**: Diagnostic Guide v1.0
