#!/bin/bash
set -e

echo "📦 Installing frontend dependencies"
cd Frontend
npm install

echo "🏗️ Building frontend..."
npm run build
cd ..

echo "🧹 Cleaning up old static files..."
rm -rf Backend/static/*

echo "📂 Copying new build to Backend/static..."
cp -r Frontend/dist/* Backend/static/

echo "✅ Build completed!"
