# VinValuation Pro Backend API

A Node.js backend that combines VIN decoding with AI-powered market analysis (Claude & Grok) to provide comprehensive vehicle valuations. Built with modular architecture, enhanced reasoning prompts, and comprehensive testing capabilities.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+ installed
- Claude API key from [console.anthropic.com](https://console.anthropic.com/)
- Grok API key from [x.ai](https://x.ai/) (optional)

### 2. Setup

```bash
# Clone or create project directory
git clone <your-repo> vinvaluation-backend
cd vinvaluation-backend

# Install dependencies
npm install

# Create .env file with your API keys
cp .env.example .env
```

### 3. Configure Environment Variables

Edit `.env` file:
```bash
PORT=3001
NODE_ENV=development
AUTO_DEV_API_KEY=your_auto_dev_api_key_here
CLAUDE_API_KEY=your_claude_api_key_here
```

**Required API Keys:**
- **Claude API Key**: Get from [console.anthropic.com](https://console.anthropic.com/)
- **Grok API Key**: Get from [x.ai](https://x.ai/) (optional)
- **Auto.dev API Key**: Get from [auto.dev](https://auto.dev/)

**AI Service Configuration:**
- Set `AI_SERVICE=claude` for Claude AI (default)
- Set `AI_SERVICE=grok` for Grok AI

**Enhanced Features:**
- **Enhanced AI Reasoning**: Advanced prompts with 2025 market analysis and tools integration
- **Modular Architecture**: Organized services and prompts in dedicated directories
- **Condition-Based Pricing**: Dynamic value adjustments based on vehicle condition
- **Performance Vehicle Analysis**: Specialized analysis for high-performance vehicles
- **Enhanced Validation**: AI response validation and confidence scoring
- **Market Trend Integration**: Real-time market data analysis and 2025 economic factors

### 4. Start the Server

```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

### POST `/api/valuation`
Main endpoint that processes a VIN and returns comprehensive valuation using AI (Claude or Grok).

**Request:**
```json
{
  "vin": "1G1ZD5ST8JF134138",
  "condition": "good"
}
```

**Condition Options:**
- `excellent` (+10-15% above base value)
- `good` (base market value - default)
- `fair` (-10-15% below base value)
- `poor` (-20-30% below base value)

**Response:**
```json
{
  "success": true,
  "timestamp": "2025-02-01T12:00:00.000Z",
  "vin": "1G1ZD5ST8JF134138",
  "vehicle": {
    "year": 2018,
    "make": "Chevrolet",
    "model": "Malibu",
    "trim": "LT",
    "engine": "1.5L Turbo",
    "transmission": "6-Speed Automatic",
    "engine_specs": { "horsepower": 163, "torque": 184 },
    "mpg": { "city": "27", "highway": "36" },
    "categories": { "market": "Mainstream" }
  },
  "condition": "good",
  "analysis": {
    "market_values": {
      "retail_value": { "min": 14500, "max": 16800 },
      "private_party_value": { "min": 13200, "max": 15300 },
      "trade_in_value": { "min": 11800, "max": 13500 }
    },
    "performance_factors": {
      "engine_premium": "Efficient turbo engine adds value",
      "drivetrain_impact": "Standard FWD configuration"
    },
    "market_analysis": {
      "demand_level": "Medium",
      "price_trend": "Stable with slight upward trend"
    },
    "validation": {
      "is_valid": true,
      "confidence": "high"
    }
  },
  "report_id": "VVP-1234567890"
}
```

### POST `/api/test-valuation`
Fast testing endpoint that uses mock responses (no API costs).

**Request:**
```json
{
  "vin": "JF1GR8H6XBL831881",
  "condition": "good"
}
```

**Available Test VINs:**
- `JF1GR8H6XBL831881` - 2011 Subaru Impreza WRX STI (Enhanced Performance Analysis)
- `1G1ZD5ST8JF134138` - 2018 Chevrolet Malibu
- `1HGBH41JXMN109186` - 2021 Honda Civic  
- `1FTFW1ET5DFC10312` - 2013 Ford F-150

### POST `/api/validate-vin`
Free VIN validation (no API calls).

**Request:**
```json
{
  "vin": "1G1ZD5ST8JF134138"
}
```

### GET `/api/health`
Health check endpoint with AI service status and enhanced features.

### GET `/api/sample-vins`
Returns test VINs for development.

## 🧪 Testing

### Quick Testing (No API Costs)
```bash
# Test with mock responses
curl -X POST http://localhost:3001/api/test-valuation \
  -H "Content-Type: application/json" \
  -d '{"vin": "JF1GR8H6XBL831881"}'
```

### Full Test Suite
```bash
# Run comprehensive tests
npm test

# Or run directly
node test-api.js
```

### Test Modes
- **Development**: Uses real AI API calls (Claude or Grok)
- **Test Mode**: Uses mock responses when `NODE_ENV=test`
- **Mock Endpoint**: Always uses test data for fast development
- **Enhanced Testing**: Performance vehicle analysis with condition-specific adjustments

## 💰 Cost Analysis

### Per Request Costs:
- **Auto.dev API:** Free (included in their plan)
- **Claude API:** ~$0.08-0.15 per request
- **Grok API:** ~$0.05-0.12 per request (typically cheaper)
- **Total Cost:** ~$0.08-0.15 per valuation (depending on AI service)

### Pricing Strategy:
- **Consumer Reports:** $4.99 (98% profit margin)
- **Dealer API:** $0.50-1.00 per request
- **Enterprise:** Custom pricing

## 🏗️ Project Structure

```
autovalidation-backend/
├── server.js                    # Main Express server with enhanced routes
├── ai-services/                 # AI service modules
│   ├── claude-service.js       # Claude AI integration with enhanced prompts
│   └── grok-service.js         # Grok AI integration with enhanced prompts
├── ai-prompts/                  # Enhanced AI reasoning prompts
│   ├── ai-prompt-8-5.js        # Advanced reasoning prompt with 2025 market analysis
│   └── ai-prompts.js           # Shared prompts for consistent analysis
├── utilities/                   # Helper utilities
│   ├── vehicle-helpers.js      # Vehicle data processing utilities
│   └── vin-helpers.js          # VIN validation and processing
├── pricing/                     # Cost analysis and pricing utilities
│   ├── ai-models-pricing.js    # AI model pricing and token limits
│   └── estimate-prompt-cost.js # Cost estimation for prompts
├── testing/                     # Testing utilities
│   ├── auto-data-test.js       # Auto.dev data testing
│   └── grok-data-test.js       # Grok service testing
├── test-responses.js           # Mock responses with condition adjustments
├── test-api.js                 # Comprehensive API testing
├── package.json                # Dependencies and scripts
├── .env                        # Environment variables (not in git)
└── README.md                   # This file
```

## 🔧 Development Tips

### Enhanced Architecture
- **`ai-services/`**: Dedicated directory for AI service integrations with enhanced prompts
- **`ai-prompts/`**: Advanced reasoning prompts with 2025 market analysis and tools integration
- **`utilities/`**: Helper functions for vehicle data processing and VIN validation
- **`pricing/`**: Cost analysis and AI model pricing management
- **`testing/`**: Comprehensive testing utilities for all services
- **`server.js`**: Enhanced route handling with improved service organization

### Enhanced AI Reasoning
The new `ai-prompt-8-5.js` provides:
- **2025 Market Analysis**: Current economic factors, inflation, and supply chain impacts
- **Tools Integration**: Web search capabilities for real-time market data
- **Enhanced Mileage Analysis**: Sophisticated mileage impact calculations
- **Rarity Detection**: Identification of limited production and special features
- **Confidence Assessment**: Detailed confidence scoring with reasoning
- **Market Trend Integration**: Real-time market data analysis

### Adding Caching
To reduce costs, add Redis caching for recent VIN lookups:

```javascript
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

// Check cache before API calls
const cachedResult = await client.get(`vin:${vin}`);
if (cachedResult) {
  return JSON.parse(cachedResult);
}

// Cache result for 24 hours
await client.setex(`vin:${vin}`, 86400, JSON.stringify(result));
```

### Adding Database Storage
Store VIN lookups to build your proprietary database:

```javascript
// After successful valuation
await db.query(`
  INSERT INTO valuations (vin, vehicle_data, analysis, created_at)
  VALUES ($1, $2, $3, NOW())
`, [vin, vehicleSpecs, claudeAnalysis]);
```

### Error Handling
The API handles common errors:
- Invalid VIN format
- VIN not found in database
- Claude API failures
- Rate limiting
- Network timeouts

## 🚀 Deployment Options

### Heroku (Easiest)
```bash
# Install Heroku CLI, then:
heroku create vinvaluation-api
heroku config:set CLAUDE_API_KEY=your_key_here
git push heroku main
```

### Vercel
```bash
# Install Vercel CLI, then:
vercel
# Add environment variables in Vercel dashboard
```

### Railway
```bash
# Connect GitHub repo to Railway
# Add environment variables in Railway dashboard
```

## 📊 Monitoring & Analytics

Add these for production:

```javascript
// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Response timing
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.path} completed in ${duration}ms`);
  });
  next();
});
```

## 🔐 Security Considerations

1. **API Key Protection:** Never commit API keys to git
2. **Rate Limiting:** Add express-rate-limit for production
3. **Input Validation:** VIN format is validated, but add more checks
4. **CORS Configuration:** Restrict origins in production
5. **HTTPS Only:** Use SSL certificates in production

## 📈 Scaling Considerations

- **Horizontal Scaling:** Stateless design allows multiple instances
- **Database:** Add PostgreSQL for persistent storage
- **Caching:** Redis for frequently requested VINs
- **CDN:** CloudFlare for global distribution
- **Load Balancer:** For high-traffic scenarios

## 🚀 Features

### ✅ **Core Functionality**
- **VIN Decoding**: Extract vehicle specifications using auto.dev API
- **Enhanced AI Analysis**: Claude & Grok AI with advanced reasoning and 2025 market analysis
- **Comprehensive Reports**: Detailed market values, performance factors, and recommendations
- **Condition-Based Pricing**: Dynamic value adjustments based on vehicle condition
- **Performance Vehicle Analysis**: Specialized analysis for high-performance vehicles
- **AI Response Validation**: Confidence scoring and validation for AI-generated analysis
- **Market Trend Integration**: Real-time market data analysis and economic factor consideration

### ✅ **Enhanced Development Features**
- **Modular Architecture**: Clean separation of concerns with organized directory structure
- **Advanced AI Prompts**: Enhanced reasoning with tools integration and 2025 market analysis
- **Mock Testing**: Fast development without API costs
- **Enhanced Testing**: Performance vehicle analysis with condition-specific adjustments
- **Health Monitoring**: Service status and AI service validation
- **AI Service Switching**: Easy switching between Claude and Grok
- **Cost Management**: Comprehensive pricing analysis and cost estimation

### ✅ **Production Ready**
- **Environment Configuration**: Secure API key management for multiple services
- **CORS Support**: Cross-origin request handling
- **Input Validation**: VIN format and condition validation
- **Enhanced Response Formatting**: Structured JSON with validation and confidence scoring
- **AI Service Fallbacks**: Graceful handling of AI service failures
- **Comprehensive Error Handling**: Robust error management across all services

## 🤝 Next Steps

1. **Test the Enhanced API** with performance vehicles using `/api/test-valuation`
2. **Compare AI Services** by switching between Claude and Grok
3. **Add database** for storing results and building proprietary data
4. **Build frontend** to consume this enhanced API
5. **Add user authentication** for paid features
6. **Implement caching** to reduce costs
7. **Add monitoring** and analytics
8. **Deploy to production** platform

## 🎯 Enhanced Testing Examples

### Test Enhanced AI Reasoning:
```bash
# Test Subaru WRX STI with enhanced reasoning
curl -X POST https://your-api.railway.app/api/test-valuation \
  -H "Content-Type: application/json" \
  -d '{"vin": "JF1GR8H6XBL831881", "condition": "excellent"}'

# Test condition adjustments with enhanced analysis
curl -X POST https://your-api.railway.app/api/test-valuation \
  -H "Content-Type: application/json" \
  -d '{"vin": "JF1GR8H6XBL831881", "condition": "poor"}'
```

### Test AI Service Switching:
```bash
# Test with Claude (default)
export AI_SERVICE=claude
curl -X POST https://your-api.railway.app/api/valuation \
  -H "Content-Type: application/json" \
  -d '{"vin": "JF1GR8H6XBL831881", "condition": "good"}'

# Test with Grok
export AI_SERVICE=grok
curl -X POST https://your-api.railway.app/api/valuation \
  -H "Content-Type: application/json" \
  -d '{"vin": "JF1GR8H6XBL831881", "condition": "good"}'
```

### Test Enhanced Features:
```bash
# Test mileage impact analysis
curl -X POST https://your-api.railway.app/api/valuation \
  -H "Content-Type: application/json" \
  -d '{"vin": "JF1GR8H6XBL831881", "condition": "good", "mileage": 45000}'

# Test market trend integration
curl -X POST https://your-api.railway.app/api/valuation \
  -H "Content-Type: application/json" \
  -d '{"vin": "JF1GR8H6XBL831881", "condition": "good"}'
```

---

**Ready to start making money with enhanced vehicle valuations! 🚗💰🤖**