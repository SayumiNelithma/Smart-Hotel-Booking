# Quick Stripe Setup Guide

## The Error You're Seeing

If you see **"Stripe is not properly configured. Please contact support."**, it means the Stripe publishable key is missing from your environment variables.

## Quick Fix (5 minutes)

### Step 1: Get Your Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys) (use Test Mode for development)
2. Copy your **Publishable key** (starts with `pk_test_...`)
3. Copy your **Secret key** (starts with `sk_test_...`)

### Step 2: Create Frontend `.env` File

1. Navigate to the `Frontend` folder
2. Create a file named `.env` (not `.env.example`)
3. Add this line:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
```

**Important:** Replace `pk_test_your_actual_key_here` with your actual Stripe publishable key!

### Step 3: Create Backend `.env` File

1. Navigate to the `Backend` folder
2. Create a file named `.env` (not `.env.example`)
3. Add these lines:

```env
STRIPE_SECRET_KEY=sk_test_your_actual_key_here
FRONTEND_URL=http://localhost:5173
```

**Important:** Replace `sk_test_your_actual_key_here` with your actual Stripe secret key!

### Step 4: Restart Your Dev Servers

**CRITICAL:** After adding environment variables, you MUST restart your development servers:

1. **Stop** both frontend and backend servers (Ctrl+C)
2. **Restart** the backend server:
   ```bash
   cd Backend
   npm run dev
   ```
3. **Restart** the frontend server:
   ```bash
   cd Frontend
   npm run dev
   ```

### Step 5: Verify It's Working

1. Open your browser console (F12)
2. Look for: `✅ Stripe checkout ready` (no errors)
3. Try creating a booking - the payment form should appear

## Troubleshooting

### Still seeing the error?

1. **Check the file name**: Must be exactly `.env` (not `.env.txt` or `.env.example`)
2. **Check the location**: 
   - Frontend `.env` → `Frontend/.env`
   - Backend `.env` → `Backend/.env`
3. **Check the variable name**: Must be exactly `VITE_STRIPE_PUBLISHABLE_KEY` (case-sensitive)
4. **Restart your dev server**: Environment variables are only loaded when the server starts
5. **Check browser console**: Look for error messages that might give more details

### Test Mode vs Live Mode

- **Development**: Use `pk_test_...` and `sk_test_...` keys
- **Production**: Use `pk_live_...` and `sk_live_...` keys

### Don't Have Stripe Account?

1. Sign up at [stripe.com](https://stripe.com)
2. Go to Test Mode (toggle in dashboard)
3. Get your test keys from Developers → API Keys

## Need Help?

- Check `STRIPE_INTEGRATION.md` for detailed documentation
- Check browser console for specific error messages
- Verify your Stripe keys are correct in the Stripe Dashboard

