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
- See the lean architecture features

### 2. Test the API
```bash
# Get all users
curl http://localhost:3000/api/users

# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"pass123"}'
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

2. **Set up a PostgreSQL database**
   
   Choose one:
   - Local PostgreSQL
   - [Supabase](https://supabase.com) (free tier available)
   - [Neon](https://neon.tech) (free tier available)
   - [Railway](https://railway.app) (free tier available)

3. **Update `.env` with your database credentials**
   ```env
   DB_HOST=your-host
   DB_PORT=5432
   DB_NAME=q_persona
   DB_USER=your-user
   DB_PASSWORD=your-password
   DB_SSL=true
   ```

4. **Run the database schema**
   ```bash
   psql -U your-user -d q_persona -f database/schema.sql
   ```

5. **Install PostgreSQL client**
   ```bash
   npm install pg
   ```

6. **Implement database queries in API routes**
   
   See `src/app/api/*/route.ts` for TODO comments

### Deploy to Production

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on deploying to:
- Vercel (recommended)
- Netlify
- Railway
- Others

### Add Authentication

1. Install NextAuth.js
   ```bash
   npm install next-auth
   ```

2. Follow the [NextAuth.js documentation](https://next-auth.js.org/getting-started/example)

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

- [README.md](README.md) - Complete documentation
- [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture details (Indonesian)
- [API_TESTING.md](API_TESTING.md) - API testing guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide

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

✅ Next.js 14 with App Router  
✅ TypeScript configuration  
✅ Tailwind CSS styling  
✅ 6 API endpoints (Users, Personas, Templates, Questionnaires, Respondents, Answers)  
✅ PostgreSQL database schema  
✅ Comprehensive documentation  
✅ Production-ready build configuration  
✅ Security best practices  

Happy coding! 🚀
