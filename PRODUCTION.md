# Production Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the Arabic Restaurant Menu System to production. The system is built with Next.js 15, TypeScript, Prisma ORM, and SQLite database.

## System Requirements

### Minimum Requirements
- Node.js 18.x or higher
- npm 8.x or higher
- 512MB RAM minimum (1GB recommended)
- 1GB disk space

### Recommended Requirements
- Node.js 20.x or higher
- 2GB RAM or more
- Multi-core CPU
- SSD storage

## Environment Configuration

### 1. Environment Variables

Create a `.env.production` file in the project root:

```bash
# Production Environment Variables
NODE_ENV=production

# Database Configuration
DATABASE_URL="file:./db/custom.db"

# Application Configuration
PORT=3000
HOSTNAME=0.0.0.0

# Security Configuration
NEXTAUTH_SECRET="your-super-secret-nextauth-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Admin Configuration (CHANGE THESE IN PRODUCTION!)
ADMIN_EMAIL="admin@restaurant.com"
ADMIN_PASSWORD="admin123"

# Performance Configuration
ENABLE_CACHING=true
CACHE_TTL=300

# Logging Configuration
LOG_LEVEL=info
ENABLE_REQUEST_LOGGING=true

# CORS Configuration
ALLOWED_ORIGINS="http://localhost:3000,https://yourdomain.com"

# Socket.IO Configuration
SOCKET_IO_CORS_ORIGIN="*"
```

### 2. Security Considerations

**CRITICAL:** Change the default admin credentials before deploying to production:

```bash
# Update these values in your .env file
ADMIN_EMAIL="your-actual-admin-email@domain.com"
ADMIN_PASSWORD="your-secure-password-here"
```

## Deployment Methods

### Method 1: Automated Deployment Script

Use the provided deployment script for quick deployment:

```bash
# Run the deployment script
./deploy.sh
```

The script will:
- Stop any existing application
- Install dependencies
- Setup environment
- Configure database
- Build the application
- Start the application
- Perform health checks

### Method 2: Manual Deployment

#### Step 1: Install Dependencies
```bash
npm ci --production
```

#### Step 2: Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push
```

#### Step 3: Build Application
```bash
npm run build
```

#### Step 4: Start Application
```bash
NODE_ENV=production npm start
```

### Method 3: Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:./db/custom.db
    volumes:
      - ./db:/app/db
    restart: unless-stopped
```

Deploy with Docker:
```bash
docker-compose up -d --build
```

## Production Configuration

### Next.js Configuration

The `next.config.ts` file includes production optimizations:

- **Strict TypeScript checking** - No build errors allowed
- **React Strict Mode** - Enabled for better development experience
- **Image optimization** - WebP and AVIF support
- **Security headers** - XSS, CSRF, and clickjacking protection
- **Compression** - Enabled for better performance
- **Bundle optimization** - Tree shaking and code splitting

### Database Configuration

#### Connection Pooling
The application uses optimized database connections with:
- Connection pooling for better performance
- Graceful shutdown handling
- Health checks and monitoring
- Automatic reconnection on failure

#### Caching Strategy
- **Settings cache** - 5 minutes TTL
- **Categories cache** - 3 minutes TTL
- **Menu items cache** - 2 minutes TTL
- **Automatic cache invalidation** on data changes

### Error Handling and Logging

#### Logging Levels
- **DEBUG** - Detailed debugging information
- **INFO** - General application information
- **WARN** - Warning conditions
- **ERROR** - Error conditions

#### Error Types
- **Database errors** - Connection failures, constraint violations
- **Authentication errors** - Login failures, invalid tokens
- **Authorization errors** - Permission denied
- **Validation errors** - Invalid input data
- **Not found errors** - Missing resources

### Performance Monitoring

The application includes:
- **Request logging** - HTTP request/response tracking
- **Performance monitoring** - Slow operation detection
- **Health checks** - System health monitoring
- **Memory management** - Automatic cleanup and optimization

## Security Best Practices

### 1. Environment Security
- Never commit `.env` files to version control
- Use strong, unique passwords for admin accounts
- Regularly rotate credentials and secrets
- Use HTTPS in production

### 2. Application Security
- Input validation on all user inputs
- SQL injection prevention through Prisma ORM
- XSS protection through React and Next.js
- CSRF protection through security headers
- Rate limiting on API endpoints

### 3. Database Security
- Use parameterized queries (handled by Prisma)
- Regular database backups
- Proper user permissions
- Encrypt sensitive data

### 4. Server Security
- Keep Node.js and dependencies updated
- Use firewall rules to restrict access
- Monitor server logs for suspicious activity
- Implement DDoS protection

## Monitoring and Maintenance

### 1. Health Checks

The application provides several health check endpoints:

```bash
# Basic health check
curl http://localhost:3000/api/health

# Database health check
curl http://localhost:3000/api/health/database

# Application metrics
curl http://localhost:3000/api/health/metrics
```

### 2. Log Management

Logs are written to both console and files:
- **server.log** - Application server logs
- **dev.log** - Development logs (development only)
- **Database logs** - Query logs (development only)

### 3. Performance Monitoring

Monitor key metrics:
- Response times
- Error rates
- Database query performance
- Memory usage
- CPU usage

### 4. Backup Strategy

#### Database Backups
```bash
# Create backup
cp db/custom.db backups/custom-$(date +%Y%m%d-%H%M%S).db

# Restore backup
cp backups/custom-20231201-120000.db db/custom.db
```

#### File Backups
- Backup the entire project directory
- Include configuration files
- Include database files
- Store backups securely

## Scaling Considerations

### 1. Vertical Scaling
- Increase server resources (CPU, RAM, storage)
- Optimize database queries
- Implement caching strategies
- Use connection pooling

### 2. Horizontal Scaling
- Use load balancers
- Implement session sharing
- Use distributed caching
- Consider microservices architecture

### 3. Database Scaling
- For high traffic, consider PostgreSQL or MySQL
- Implement read replicas
- Use database clustering
- Consider NoSQL for specific use cases

## Troubleshooting

### Common Issues

#### 1. Application Won't Start
```bash
# Check logs
tail -f server.log

# Check port availability
netstat -tulpn | grep :3000

# Check Node.js version
node --version
```

#### 2. Database Connection Issues
```bash
# Check database file
ls -la db/custom.db

# Check database permissions
chmod 644 db/custom.db

# Test database connection
npx prisma db push
```

#### 3. Memory Issues
```bash
# Monitor memory usage
top -p $(cat .pid)

# Check for memory leaks
node --inspect app.js
```

#### 4. Performance Issues
```bash
# Check slow queries
grep "slow query" server.log

# Monitor response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000/api/health
```

### Emergency Procedures

#### 1. Application Crash
```bash
# Restart application
npm start

# Check logs
tail -f server.log

# Restore from backup if needed
```

#### 2. Database Corruption
```bash
# Stop application
kill $(cat .pid)

# Restore from backup
cp backups/latest.db db/custom.db

# Restart application
npm start
```

#### 3. Security Incident
```bash
# Change admin passwords immediately
# Check logs for suspicious activity
# Rotate all secrets and credentials
# Consider restoring from clean backup
```

## Support

For production support:
1. Check this documentation
2. Review application logs
3. Check health status
4. Monitor system metrics
5. Contact development team if needed

## Updates and Maintenance

### Regular Maintenance Tasks
- Update Node.js and npm regularly
- Update dependencies with `npm update`
- Monitor security advisories
- Perform database backups
- Review and optimize performance

### Update Procedure
1. Backup current installation
2. Update dependencies
3. Test in staging environment
4. Deploy to production
5. Monitor for issues
6. Rollback if necessary

---

This guide covers all aspects of deploying and maintaining the Arabic Restaurant Menu System in production. Follow these instructions to ensure a smooth and secure deployment.