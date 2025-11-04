# Deployment Guide

This guide covers deploying the Q-Persona application to various platforms.

## Prerequisites

- Git repository set up
- Database provider account (Supabase, Neon, Railway, etc.)
- Deployment platform account (Vercel, Netlify, etc.)

## Option 1: Vercel (Recommended)

Vercel is the recommended platform for Next.js applications.

### Steps

1. **Push your code to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your Q-Persona repository

3. **Configure Environment Variables**
   
   In the Vercel dashboard, add these environment variables:
   ```
   DB_HOST=your-database-host.com
   DB_PORT=5432
   DB_NAME=q_persona
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_SSL=true
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app
   - Your app will be live at `https://your-project.vercel.app`

### Custom Domain (Optional)

1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Option 2: Netlify

### Steps

1. **Push code to GitHub**

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository

3. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Functions directory: `netlify/functions` (optional)

4. **Environment Variables**
   
   Add in Site settings → Environment variables:
   ```
   DB_HOST=your-database-host.com
   DB_PORT=5432
   DB_NAME=q_persona
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_SSL=true
   ```

5. **Deploy**

## Option 3: Railway

Railway provides both hosting and database in one platform.

### Steps

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Initialize Project**
   ```bash
   railway init
   ```

3. **Add PostgreSQL**
   ```bash
   railway add postgresql
   ```

4. **Set Environment Variables**
   Railway will auto-configure database variables. Add any custom ones:
   ```bash
   railway variables set KEY=VALUE
   ```

5. **Deploy**
   ```bash
   railway up
   ```

## Database Setup

### Option A: Supabase

1. **Create Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for database provisioning

2. **Run Schema**
   - Go to SQL Editor
   - Paste contents of `database/schema.sql`
   - Click "Run"

3. **Get Connection Details**
   - Go to Project Settings → Database
   - Copy connection string
   - Update your environment variables

### Option B: Neon

1. **Create Project**
   - Go to [neon.tech](https://neon.tech)
   - Create a new project
   - Select region closest to your users

2. **Get Connection String**
   - Copy the connection string from dashboard
   - Parse it for individual components:
     ```
     postgres://user:pass@host/dbname
     ```

3. **Run Schema**
   - Use psql or any PostgreSQL client
   ```bash
   psql "postgres://user:pass@host/dbname" -f database/schema.sql
   ```

### Option C: Railway PostgreSQL

1. **Add PostgreSQL**
   ```bash
   railway add postgresql
   ```

2. **Connect and Run Schema**
   ```bash
   railway connect postgresql
   # In PostgreSQL prompt:
   \i database/schema.sql
   ```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | Database host | `db.xxx.supabase.co` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `q_persona` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `your_secure_password` |
| `DB_SSL` | Enable SSL | `true` |

## Post-Deployment Checklist

- [ ] Verify the application loads correctly
- [ ] Test all API endpoints
- [ ] Check database connectivity
- [ ] Verify environment variables are set
- [ ] Test creating/reading data through the API
- [ ] Set up custom domain (if needed)
- [ ] Configure SSL/HTTPS (usually automatic)
- [ ] Set up monitoring and error tracking
- [ ] Configure analytics (optional)
- [ ] Set up backup strategy for database

## Continuous Deployment

### Automatic Deployments

Most platforms support automatic deployments:

1. **Vercel/Netlify**: Automatically deploys on git push
2. **Railway**: Configure GitHub integration for auto-deploy

### Manual Deployments

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod

# Railway
railway up
```

## Monitoring

### Recommended Tools

1. **Sentry** - Error tracking
   ```bash
   npm install @sentry/nextjs
   ```

2. **Vercel Analytics** - Built-in for Vercel deployments

3. **LogRocket** - Session replay and monitoring

## Scaling Considerations

### Database

- Enable connection pooling
- Set up read replicas for high traffic
- Monitor query performance
- Consider caching layer (Redis)

### Application

- Serverless functions scale automatically
- Use CDN for static assets
- Enable Next.js image optimization
- Implement rate limiting

## Troubleshooting

### Build Failures

1. Check build logs in platform dashboard
2. Verify all dependencies in `package.json`
3. Test build locally: `npm run build`
4. Check Node.js version compatibility

### Database Connection Issues

1. Verify environment variables are set correctly
2. Check SSL settings (`DB_SSL=true` for cloud databases)
3. Verify database is accessible from deployment platform
4. Check firewall/security group settings

### Runtime Errors

1. Check application logs in platform dashboard
2. Enable error tracking (Sentry)
3. Verify API routes are working
4. Check database connection pool settings

## Security Best Practices

1. **Never commit `.env` files**
2. **Use environment variables** for all sensitive data
3. **Enable SSL** for database connections
4. **Implement rate limiting** on API endpoints
5. **Use HTTPS** for all traffic (enabled by default on most platforms)
6. **Regular security updates**: Keep dependencies updated
7. **Database backups**: Set up automatic backups

## Cost Optimization

### Free Tier Options

- **Vercel**: Free for hobby projects
- **Netlify**: 100GB bandwidth/month free
- **Supabase**: 500MB database free
- **Neon**: 3GB storage free
- **Railway**: $5 credit/month free

### Tips

1. Use serverless functions efficiently
2. Implement caching where possible
3. Optimize images with Next.js Image component
4. Monitor bandwidth usage
5. Set up spending alerts

## Support

For deployment issues:
- Check platform documentation
- Review error logs
- Open an issue on GitHub
- Contact platform support

## Next Steps

After successful deployment:
1. Set up CI/CD pipeline
2. Configure monitoring and alerts
3. Implement backup strategy
4. Add authentication
5. Set up staging environment
6. Configure custom domain
7. Enable analytics
