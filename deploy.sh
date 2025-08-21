#!/bin/bash

# Production Deployment Script for Arabic Restaurant Menu System

set -e

echo "🚀 Starting production deployment..."

# Configuration
PROJECT_NAME="arabic-restaurant-menu"
NODE_ENV="production"
PORT=3000

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
        exit 1
    fi
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        log_error "package.json not found. Please run this script from the project root."
        exit 1
    fi
    
    log_info "Prerequisites check passed"
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."
    
    npm ci --production
    log_info "Dependencies installed successfully"
}

# Build the application
build_application() {
    log_info "Building application..."
    
    # Generate Prisma client
    npm run db:generate
    
    # Build Next.js application
    npm run build
    
    log_info "Application built successfully"
}

# Setup environment
setup_environment() {
    log_info "Setting up environment..."
    
    # Copy production environment file if it doesn't exist
    if [ ! -f ".env.production" ]; then
        log_warn ".env.production not found. Creating from template..."
        cp .env.production .env
        log_warn "Please update .env with your production values"
    fi
    
    # Set environment variables
    export NODE_ENV=production
    export PORT=$PORT
    
    log_info "Environment setup completed"
}

# Database setup
setup_database() {
    log_info "Setting up database..."
    
    # Push database schema
    npm run db:push
    
    log_info "Database setup completed"
}

# Start the application
start_application() {
    log_info "Starting application..."
    
    # Start in background
    nohup npm start > server.log 2>&1 &
    
    # Get the process ID
    PID=$!
    echo $PID > .pid
    
    log_info "Application started with PID: $PID"
    log_info "Check server.log for application logs"
}

# Health check
health_check() {
    log_info "Performing health check..."
    
    # Wait for application to start
    sleep 10
    
    # Check if application is running
    if curl -f http://localhost:$PORT/api/health > /dev/null 2>&1; then
        log_info "Health check passed"
    else
        log_error "Health check failed"
        exit 1
    fi
}

# Stop existing application
stop_application() {
    log_info "Stopping existing application..."
    
    if [ -f ".pid" ]; then
        PID=$(cat .pid)
        if ps -p $PID > /dev/null; then
            kill $PID
            log_info "Application stopped"
        else
            log_warn "Application was not running"
        fi
        rm .pid
    else
        log_warn "No PID file found"
    fi
}

# Main deployment process
main() {
    log_info "Starting deployment process for $PROJECT_NAME"
    
    # Stop existing application
    stop_application
    
    # Check prerequisites
    check_prerequisites
    
    # Install dependencies
    install_dependencies
    
    # Setup environment
    setup_environment
    
    # Setup database
    setup_database
    
    # Build application
    build_application
    
    # Start application
    start_application
    
    # Health check
    health_check
    
    log_info "🎉 Deployment completed successfully!"
    log_info "Application is running on http://localhost:$PORT"
    log_info "Admin panel: http://localhost:$PORT/admin"
    log_info "Default admin credentials: admin@restaurant.com / admin123"
}

# Run main function
main "$@"