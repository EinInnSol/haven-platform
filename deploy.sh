#!/bin/bash

# HAVEN Platform - Quick Deploy Script
# Run this to deploy the entire platform to Cloudflare

set -e

echo "🏠 HAVEN Platform Deployment"
echo "=============================="
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler not found. Installing..."
    npm install -g wrangler
fi

# Check if logged in
echo "📋 Checking Cloudflare authentication..."
if ! wrangler whoami &> /dev/null; then
    echo "🔐 Please login to Cloudflare..."
    wrangler login
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create D1 database if it doesn't exist
echo "🗄️  Setting up database..."
DATABASE_ID=$(wrangler d1 list | grep "haven_db" | awk '{print $2}' || echo "")

if [ -z "$DATABASE_ID" ]; then
    echo "Creating new D1 database..."
    wrangler d1 create haven_db
    DATABASE_ID=$(wrangler d1 list | grep "haven_db" | awk '{print $2}')
    
    # Update wrangler.toml with database ID
    sed -i.bak "s/YOUR_D1_DATABASE_ID/$DATABASE_ID/g" wrangler.toml
    echo "✅ Database created: $DATABASE_ID"
else
    echo "✅ Database already exists: $DATABASE_ID"
fi

# Initialize database schema
echo "📊 Initializing database schema..."
wrangler d1 execute haven_db --remote --file=./src/database/schema.sql

# Seed demo data
echo "🌱 Seeding demo data..."
wrangler d1 execute haven_db --remote --file=./src/database/seed.sql

# Set secrets (if not already set)
echo "🔑 Checking API keys..."
echo "Please ensure you have set the following secrets:"
echo "  - ANTHROPIC_API_KEY"
echo "  - OPENAI_API_KEY (optional)"
echo ""
echo "To set secrets, run:"
echo "  wrangler secret put ANTHROPIC_API_KEY"
echo "  wrangler secret put OPENAI_API_KEY"
echo ""
read -p "Have you set the required secrets? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please set secrets before deploying."
    exit 1
fi

# Deploy to Cloudflare
echo "🚀 Deploying to Cloudflare..."
wrangler deploy

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📱 Your HAVEN Platform is live!"
echo "Visit your worker URL to access the platform."
echo ""
echo "Next steps:"
echo "1. Visit your worker URL in a browser"
echo "2. Go to /admin to generate QR codes"
echo "3. Test the intake flow at /intake/demo"
echo "4. Access caseworker dashboard at /caseworker/demo"
echo ""
echo "🎉 Ready for your demo!"
