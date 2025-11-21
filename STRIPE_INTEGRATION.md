# Stripe Payment Integration Documentation

## Overview
This document provides step-by-step instructions for setting up and using Stripe payment integration in the hotel booking system.

## Requirements Implemented

✅ **Product Catalog**: Stripe Products with default Prices for each hotel  
✅ **Embedded Checkout**: Stripe Embedded Checkout integration  
✅ **Payment Sessions**: Checkout Session creation with metadata linking  
✅ **Webhook Handling**: Process payment confirmations asynchronously  
✅ **Status Management**: Update booking status from PENDING to PAID  
✅ **Error Handling**: Handle payment failures and edge cases  

---

## 1. Stripe Dashboard Configuration

### Step 1: Create Stripe Account
1. Go to [https://stripe.com](https://stripe.com)
2. Sign up for an account (use Test Mode for development)
3. Complete account setup

### Step 2: Get API Keys
1. Navigate to **Developers → API Keys**
2. Copy your **Publishable key** (starts with `pk_test_...` or `pk_live_...`)
3. Copy your **Secret key** (starts with `sk_test_...` or `sk_live_...`)
4. Add to your `.env` files:

**Backend `.env`:**
```env
STRIPE_SECRET_KEY=sk_test_...your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_...your_webhook_secret_here
```

**Frontend `.env`:**
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...your_publishable_key_here
```

### Step 3: Configure Webhook Endpoint

#### For Production:
1. Go to **Developers → Webhooks**
2. Click **Add endpoint**
3. Enter endpoint URL: `https://your-backend.com/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `checkout.session.async_payment_failed`
5. Copy the **Signing secret** (starts with `whsec_...`)
6. Add to Backend `.env` as `STRIPE_WEBHOOK_SECRET`

#### For Local Development:
Use Stripe CLI to forward webhooks:

```bash
# Install Stripe CLI
# macOS: brew install stripe/stripe-cli/stripe
# Windows: Download from https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:8000/api/stripe/webhook

# Copy the webhook signing secret shown in terminal
# Add to Backend .env as STRIPE_WEBHOOK_SECRET
```

---

## 2. Code Implementation

### Backend Structure

#### Stripe Client (`Backend/src/application/utils/stripe.ts`)
```typescript
import Stripe from "stripe";
import { config } from "dotenv";

config();

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-10-29.clover",
});
```

#### Hotel Stripe Integration (`Backend/src/application/utils/stripe-hotel.ts`)
- Automatically creates Stripe products and prices when hotels are created
- Each hotel gets a unique `stripeProductId` and `stripePriceId`

#### Booking Creation (`Backend/src/application/booking.ts`)
- Creates embedded checkout session with `ui_mode: "embedded"`
- Returns `clientSecret` for frontend integration
- Includes metadata: `bookingId`, `userId`, `hotelId`

#### Webhook Handler (`Backend/src/api/stripe-webhook.ts`)
- Processes `checkout.session.completed` events
- Updates booking status to `PAID` when payment succeeds
- Handles `checkout.session.async_payment_failed` events
- Updates payment status to `FAILED` on payment failure

### Frontend Structure

#### Stripe Embedded Checkout Component (`Frontend/src/components/StripeEmbeddedCheckout.jsx`)
- Uses `@stripe/react-stripe-js` for embedded checkout
- Handles payment completion
- Shows booking summary
- Error handling and loading states

#### Booking Page (`Frontend/src/pages/hotel-booking.page.jsx`)
- Creates booking with PENDING status
- Shows embedded checkout after booking creation
- Handles payment success/cancel

---

## 3. Migration for Existing Hotels

If you have existing hotels without Stripe products/prices:

```bash
cd Backend
npm run migrate:stripe
```

This will:
- Find all hotels without Stripe IDs
- Create Stripe products and prices for each
- Update hotel records with Stripe IDs

---

## 4. Payment Flow

1. **User fills booking form** → Clicks "Proceed to Checkout"
2. **Backend creates booking** → Status: `PENDING`
3. **Backend creates Stripe session** → Returns `clientSecret`
4. **Frontend shows embedded checkout** → User enters payment details
5. **User completes payment** → Stripe processes payment
6. **Webhook receives event** → Updates booking to `PAID`
7. **User redirected** → Booking confirmation page shows `PAID` status

---

## 5. Error Handling

### Payment Errors
- **Card Declined**: Handled by Stripe, user sees error in checkout
- **Payment Failed**: Webhook updates status to `FAILED`
- **Session Creation Error**: Backend returns error message
- **Network Errors**: Frontend shows error toast

### Error Types Handled
- `StripeCardError`: Card declined
- `StripeRateLimitError`: Too many requests
- `StripeInvalidRequestError`: Invalid parameters
- `StripeAPIError`: Stripe API error
- `StripeConnectionError`: Network error
- `StripeAuthenticationError`: Invalid API key

---

## 6. Security Best Practices

✅ **Webhook Signature Verification**: All webhooks verified using Stripe signature  
✅ **Environment Variables**: API keys stored in `.env`, never committed  
✅ **HTTPS Required**: Production webhooks require HTTPS  
✅ **Metadata Validation**: Booking IDs validated before status updates  
✅ **Error Logging**: All errors logged without exposing sensitive data  

---

## 7. Testing

### Test Card Numbers
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

### Test Details
- **Expiry**: Any future date (e.g., `12/34`)
- **CVC**: Any 3 digits (e.g., `123`)
- **ZIP**: Any valid format (e.g., `12345`)

---

## 8. Environment Variables Checklist

### Backend `.env`
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 9. Troubleshooting

### Webhook Not Working
- Check webhook endpoint URL is correct
- Verify `STRIPE_WEBHOOK_SECRET` is set correctly
- Check webhook is registered in Stripe Dashboard
- Use Stripe CLI for local testing: `stripe listen --forward-to localhost:8000/api/stripe/webhook`

### Payment Status Not Updating
- Check webhook logs in Stripe Dashboard
- Verify webhook is receiving events
- Check backend logs for webhook processing
- Ensure booking metadata includes `bookingId`

### Embedded Checkout Not Showing
- Verify `VITE_STRIPE_PUBLISHABLE_KEY` is set
- Check browser console for errors
- Ensure `clientSecret` is received from backend
- Verify Stripe packages are installed: `npm install @stripe/stripe-js @stripe/react-stripe-js`

---

## 10. Production Checklist

- [ ] Switch to live API keys (`pk_live_...`, `sk_live_...`)
- [ ] Update webhook endpoint to production URL
- [ ] Test webhook with real payment
- [ ] Verify HTTPS is enabled
- [ ] Set up webhook retry logic (Stripe handles automatically)
- [ ] Monitor webhook logs in Stripe Dashboard
- [ ] Set up alerts for failed payments
- [ ] Test payment flow end-to-end

---

## Support

For Stripe-specific issues, refer to:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Embedded Checkout](https://stripe.com/docs/payments/checkout/embedded)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)

