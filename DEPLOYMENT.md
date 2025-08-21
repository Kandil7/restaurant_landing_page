# Deployment Guide

This guide covers how to deploy the restaurant menu system to production environments.

## Quick Start

### Automatic Deployment (Recommended)

The easiest way to deploy is using Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/restaurant-menu)

### Manual Deployment

#### 1. Prerequisites
- Node.js 18+ installed
- Git installed
- Account on deployment platform (Vercel, Netlify, etc.)

#### 2. Clone and Setup
```bash
git clone <your-repository-url>
cd restaurant-menu
npm install
```

#### 3. Environment Variables
Create a `.env.local` file with:
```env
DATABASE_URL="file:./dev.db"
```

#### 4. Build and Test
```bash
npm run build
npm start
```

## Deployment Platforms

### Vercel (Recommended)

#### Step 1: Connect to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

#### Step 2: Configure Environment Variables
In Vercel dashboard:
1. Go to your project settings
2. Add environment variable:
   - `DATABASE_URL`: `file:./dev.db`

#### Step 3: Deploy
```bash
# Deploy to production
vercel --prod
```

### Netlify

#### Step 1: Build the Project
```bash
npm run build
```

#### Step 2: Create netlify.toml
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Step 3: Deploy to Netlify
1. Drag and drop the `.next` folder to Netlify
2. Or connect your Git repository

### Railway

#### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

#### Step 2: Login and Initialize
```bash
railway login
railway init
```

#### Step 3: Configure
```bash
# Add environment variables
railway variables set DATABASE_URL=file:./dev.db

# Deploy
railway up
```

### Digital Ocean App Platform

#### Step 1: Install doctl
```bash
brew install doctl
```

#### Step 2: Authenticate
```bash
doctl auth init
```

#### Step 3: Create App
```bash
doctl apps create --spec spec.yaml
```

Create `spec.yaml`:
```yaml
name: restaurant-menu
services:
- name: web
  source_dir: /
  github:
    repo: your-username/restaurant-menu
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: DATABASE_URL
    value: file:./dev.db
```

## Production Setup

### 1. Security Configuration

#### Change Default Admin Password
1. Go to `/admin` in your deployed app
2. Login with default credentials:
   - Email: admin@restaurant.com
   - Password: admin123
3. Update password immediately

#### Environment Variables for Production
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NODE_ENV="production"
```

### 2. Customization

#### Update Restaurant Information
1. Login to admin panel
2. Go to "إعدادات المطعم" tab
3. Update:
   - Restaurant name
   - Contact information
   - Working hours
   - Colors and branding

#### Upload Custom Images
1. Replace images in `/public` folder:
   - `restaurant-logo.png` - Main logo
   - `appetizers.jpg` - Appetizers section
   - `main-dishes.jpg` - Main dishes section
   - `grills.jpg` - Grills section
   - `desserts.jpg` - Desserts section
   - `drinks.jpg` - Drinks section

### 3. Database Management

#### Backup Strategy
- The system uses SQLite which stores data in a single file
- Regular backups of the `.db` file are recommended
- Location: `prisma/dev.db`

#### Data Seeding
- Automatic seeding occurs on first deployment
- If database is empty, default data is populated
- Includes 30 menu items across 5 categories

## Performance Optimization

### 1. Image Optimization
- Images are automatically optimized by Next.js
- Use WebP format for better performance
- Compress images before uploading

### 2. Caching Strategy
- Static assets are cached by default
- API responses include proper cache headers
- Browser caching for improved performance

### 3. Bundle Analysis
```bash
# Analyze bundle size
npm run analyze
```

## Monitoring and Analytics

### 1. Error Tracking
Consider adding error tracking:
```bash
npm install @sentry/nextjs
```

### 2. Analytics
Add Google Analytics or similar:
```javascript
// pages/_app.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  
  useEffect(() => {
    const handleRouteChange = (url) => {
      // Track page views
    };
    
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  return <Component {...pageProps} />;
}
```

## SSL/HTTPS Configuration

### Vercel
- SSL is automatically enabled
- Custom domains get free SSL certificates

### Netlify
- SSL is automatically enabled
- Custom domains supported

### Custom Servers
- Use Let's Encrypt for free SSL
- Configure Nginx or Apache for HTTPS

## Domain Configuration

### Custom Domain Setup

#### Vercel
1. In Vercel dashboard, go to project settings
2. Add your custom domain
3. Follow DNS instructions

#### Netlify
1. In Netlify dashboard, go to domain settings
2. Add custom domain
3. Update DNS records

#### General DNS Settings
```
A record: @ -> IP address
CNAME record: www -> your-domain.com
```

## Maintenance

### 1. Updates
```bash
# Update dependencies
npm update

# Check for outdated packages
npm outdated
```

### 2. Database Maintenance
- Regular backups of the SQLite file
- Monitor database size
- Clean up old data if needed

### 3. Security Updates
- Keep Node.js version updated
- Regular dependency updates
- Monitor security advisories

## Troubleshooting

### Common Issues

#### 1. Blank Page on Deployment
- Check build logs for errors
- Ensure all environment variables are set
- Verify database connection

#### 2. Images Not Loading
- Check file paths in `/public` folder
- Verify image file permissions
- Check browser console for errors

#### 3. Admin Login Issues
- Verify database is properly seeded
- Check environment variables
- Clear browser cache and cookies

#### 4. Styling Issues
- Ensure Tailwind CSS is properly built
- Check for CSS conflicts
- Verify responsive design classes

### Debug Commands
```bash
# Check build process
npm run build

# Test locally in production mode
npm run build && npm start

# Check environment variables
vercel env ls

# View logs
vercel logs
```

## Support

For deployment issues:
1. Check this guide first
2. Review platform-specific documentation
3. Check GitHub issues
4. Contact development team

## Backup and Recovery

### Automated Backups
```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
cp prisma/dev.db backups/restaurant_$DATE.db
```

### Recovery Process
1. Stop the application
2. Restore database file from backup
3. Restart the application

### Manual Backup
- Download the `.db` file regularly
- Store backups in multiple locations
- Test backup restoration process

---

This guide covers the essential steps for deploying and maintaining the restaurant menu system in production.