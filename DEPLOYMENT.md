# 🚀 Deployment Guide - VinValuation Pro API

## 🎯 **Recommended: Railway (Easiest)**

### 1. Prepare Your Repository
```bash
# Ensure all files are committed
git add .
git commit -m "feat: ready for deployment"
git push origin main
```

### 2. Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables:
   ```
   CLAUDE_API_KEY=sk-ant-api03-your-key-here
   GROK_API_KEY=your-grok-api-key-here (optional)
   AUTO_DEV_API_KEY=your-auto-dev-key-here
   AI_SERVICE=claude (or grok)
   PORT=3001
   NODE_ENV=production
   ```
6. Deploy!

### 3. Get Your Live URL
- Railway will provide: `https://your-app-name.railway.app`
- Test your API: `https://your-app-name.railway.app/api/health`

## 🥈 **Alternative: Render**

### 1. Deploy to Render
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your repository
5. Configure:
   - **Name**: `vinvaluation-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add environment variables (same as Railway)
7. Deploy!

## 🥉 **Alternative: Heroku**

### 1. Install Heroku CLI
```bash
# macOS
brew install heroku/brew/heroku

# Or download from heroku.com
```

### 2. Deploy
```bash
# Login to Heroku
heroku login

# Create app
heroku create vinvaluation-api

# Add environment variables
heroku config:set CLAUDE_API_KEY=your-key-here
heroku config:set AUTO_DEV_API_KEY=your-key-here
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

## 🔧 **Pre-Deployment Checklist**

### ✅ **Code Ready**
- [ ] All files committed to git
- [ ] `package.json` has correct start script
- [ ] Environment variables documented
- [ ] No hardcoded API keys

### ✅ **API Keys Ready**
- [ ] Claude API key from [console.anthropic.com](https://console.anthropic.com/)
- [ ] Auto.dev API key from [auto.dev](https://auto.dev/)
- [ ] Keys are valid and have sufficient credits

### ✅ **Testing**
- [ ] Local server runs: `npm start`
- [ ] Health check works: `GET /api/health`
- [ ] Test endpoint works: `POST /api/test-valuation`
- [ ] Real endpoint works: `POST /api/valuation`

## 🌐 **Post-Deployment**

### 1. Test Your Live API
```bash
# Health check
curl https://your-app.railway.app/api/health

# Test valuation
curl -X POST https://your-app.railway.app/api/test-valuation \
  -H "Content-Type: application/json" \
  -d '{"vin": "1G1ZD5ST8JF134138"}'
```

### 2. Monitor Performance
- Check Railway/Render dashboard for logs
- Monitor API response times
- Watch for any errors in deployment logs

### 3. Set Up Custom Domain (Optional)
- Railway: Add custom domain in project settings
- Render: Add custom domain in service settings
- Heroku: `heroku domains:add yourdomain.com`

## 💰 **Cost Analysis**

### Railway
- **Free tier**: 500 hours/month
- **Paid**: $5/month for unlimited
- **Perfect for**: Development and small production

### Render
- **Free tier**: 750 hours/month
- **Paid**: $7/month for unlimited
- **Perfect for**: Production with more resources

### Heroku
- **No free tier**: $5/month minimum
- **Perfect for**: Enterprise applications

## 🚨 **Troubleshooting**

### Common Issues:
1. **Environment variables not set**: Check platform dashboard
2. **Build fails**: Check `package.json` scripts
3. **API keys invalid**: Verify keys are correct
4. **CORS errors**: Add your frontend domain to CORS config

### Debug Commands:
```bash
# Check logs
railway logs
# or
heroku logs --tail

# Check environment
railway variables
# or
heroku config
```

## 🎉 **Success!**

Once deployed, your API will be available at:
- **Health**: `https://your-app.railway.app/api/health`
- **Test**: `https://your-app.railway.app/api/test-valuation`
- **Production**: `https://your-app.railway.app/api/valuation`

**Ready to start making money with vehicle valuations! 🚗💰** 