# Quick Start Guide

Get Q-Persona up and running in 5 minutes!

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- (Optional) PostgreSQL database

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Farid-Ze/Q-Persona.git
   cd Q-Persona
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

That's it! You should see the Q-Persona homepage with all 6 modules.

## What You Can Do Now

### 1. Explore the UI
- View the homepage showing all modules
- Test the authentication flow (sign up / sign in)
- Experience persona-based onboarding
- Access the dashboard and template builder
- See the lean architecture features

### 2. Try the Form Builder
- Navigate to the dashboard after signing in
- Create a new template with the visual drag-and-drop builder
- Preview in Typeform-style single-question mode
- Publish and share questionnaires

### 2. Test the API
```bash
# Get all users
curl http://localhost:3000/api/users

# Create a user (or use the signup form)
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"pass123"}'

# Get system personas
curl http://localhost:3000/api/personas?system_only=true
```

### 3. Build for Production
```bash
npm run build
npm start
```

## Next Steps

### Connect to a Database

1. **Copy environment variables**
   ```bash
   cp .env.example .env
   ```

2. **Set up Supabase (Recommended)**
   
   - Go to [Supabase](https://supabase.com) and create a free account
   - Create a new project
   - Go to Settings → API and copy your credentials
   
3. **Update `.env` with your credentials**
   ```env
   # Required - Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   
   # Optional - Stripe (for monetization features)
   STRIPE_SECRET_KEY=sk_test_your_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   STRIPE_PRICE_PRO=price_your_pro_id
   STRIPE_PRICE_BUSINESS=price_your_business_id
   
   # Optional - PostHog (for analytics)
   NEXT_PUBLIC_POSTHOG_KEY=phc_your_key
   NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
   ```

4. **Run the database schema**
   - In Supabase dashboard, go to SQL Editor
   - Copy the contents of `database/schema.sql`
   - Paste and click "Run"
   
5. **Restart the development server**
   ```bash
   npm run dev
   ```

### Deploy to Production

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on deploying to:
- Vercel (recommended)
- Netlify
- Railway
- Others

### Add Stripe Monetization (Optional)

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Dashboard
3. Create products and prices for Pro and Business plans
4. Add credentials to `.env`:
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PRICE_PRO=price_...
   STRIPE_PRICE_BUSINESS=price_...
   ```
5. See [MONETIZATION_ANALYTICS.md](MONETIZATION_ANALYTICS.md) for detailed setup

### Add PostHog Analytics (Optional)

1. Create a PostHog account at [posthog.com](https://posthog.com)
2. Create a new project
3. Get your project key
4. Add to `.env`:
   ```env
   NEXT_PUBLIC_POSTHOG_KEY=phc_...
   NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
   ```
5. See [MONETIZATION_ANALYTICS.md](MONETIZATION_ANALYTICS.md) for event tracking guide

### Customize the UI

- Edit `src/app/page.tsx` for the homepage
- Modify `src/app/globals.css` for global styles
- Update `tailwind.config.ts` for theme customization

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Documentation

- [README.md](README.md) - Complete documentation with project status
- [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture details (Indonesian)
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [MONETIZATION_ANALYTICS.md](MONETIZATION_ANALYTICS.md) - Stripe & PostHog integration
- [FORM_BUILDER.md](FORM_BUILDER.md) - Form builder features
- [SUPABASE_INTEGRATION.md](SUPABASE_INTEGRATION.md) - Supabase setup guide
- [API_TESTING.md](API_TESTING.md) - API testing guide
- [PACKAGE_UPDATES.md](PACKAGE_UPDATES.md) - Latest package updates

## Project Structure

```
Q-Persona/
├── src/
│   ├── app/              # Next.js pages and API routes
│   ├── components/       # React components
│   ├── lib/              # Utilities
│   └── types/            # TypeScript types
├── database/             # PostgreSQL schema
└── [config files]        # Next.js, TypeScript, etc.
```

## Troubleshooting

### Port 3000 already in use
```bash
# Use a different port
PORT=3001 npm run dev
```

### Build errors
```bash
# Clean and reinstall
rm -rf node_modules package-lock.json .next
npm install
npm run build
```

### Module not found
```bash
# Make sure you're in the project directory
cd Q-Persona
npm install
```

## Support

- 📖 Check the [README.md](README.md) for detailed documentation
- 🐛 Report issues on GitHub
- 💬 Join discussions on GitHub Discussions

## What's Included

✅ Next.js 16 with App Router and Turbopack  
✅ React 19 with latest features  
✅ TypeScript 5.9 configuration  
✅ Tailwind CSS styling  
✅ Supabase authentication and database  
✅ Stripe payment processing (optional)  
✅ PostHog analytics (optional)  
✅ Persona-based onboarding with 4 system personas  
✅ Visual drag-and-drop form builder  
✅ Typeform-style preview modes  
✅ 6 API endpoints (Users, Personas, Templates, Questionnaires, Respondents, Answers)  
✅ PostgreSQL database schema with subscriptions support  
✅ Server Actions for type-safe mutations  
✅ Comprehensive documentation  
✅ Production-ready build configuration  
✅ Security best practices  
✅ All packages at @latest versions  

Happy coding! 🚀
