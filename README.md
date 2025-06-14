# Talent Protocol GitHub Widget

A sleek, interactive GitHub widget that displays your complete Talent Protocol profile including Builder Score, bio, location, and a direct link to your profile. Features Talent Protocol's signature black and metallic gray design.

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Get your Talent Protocol API key from [Talent Protocol Dashboard](https://app.talentprotocol.com/)

4. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```

5. Add your API key to `.env`:
   ```
   TALENT_API_KEY=your_api_key_here
   PORT=3000
   ```

6. Start the server:
   ```bash
   npm run dev
   ```
   or
   ```bash
   npm start
   ```

**Note:** Make sure port 3000 is available, or set a different port in your `.env` file.

## Usage

Add this to your GitHub README.md:

```markdown
![Talent Protocol Score](https://your-domain.com/widget/YOUR_WALLET_ADDRESS)
```

Replace `YOUR_WALLET_ADDRESS` with your wallet address (e.g., `0xc2564e41B7F5Cb66d2d99466450CfebcE9e8228f`).

## Deploy

You can deploy this widget to any platform that supports Node.js:

- Heroku
- Vercel 
- Railway
- DigitalOcean App Platform

Make sure to set the `TALENT_API_KEY` environment variable on your deployment platform.

## Widget Features

### 🎨 Design
- **Talent Protocol Branding**: Black background with metallic gray accents matching official design
- **Professional Look**: Sleek 500x160px SVG optimized for GitHub READMEs
- **Responsive**: Scales perfectly across different screen sizes

### 👤 Profile Information
- **Display Name**: User's Talent Protocol display name
- **Avatar**: Stylized initials in metallic circle (GitHub-compatible)
- **Bio**: Truncated biography text (60 characters max)
- **Location**: Geographic location with 📍 icon

### 📊 Builder Score
- **Score Display**: Large, prominent score with color coding:
  - 🟢 Green: ≥400 points (High)
  - 🟠 Orange: ≥200 points (Medium)  
  - 🔴 Red: <200 points (Growing)
- **Progress Ring**: Visual progress indicator
- **Status**: Shows if score is currently calculating

### 🔗 Interactive Features
- **Clickable Widget**: Single-click access to Talent Protocol profile
- **GitHub Optimized**: Works seamlessly in markdown files
- **New Tab**: Opens profile without leaving GitHub page

### ⚡ Performance
- **Fast Loading**: Parallel API calls for optimal speed
- **Caching**: 1-hour cache for improved performance
- **Error Handling**: Graceful fallbacks for API issues

## API Endpoints

- `GET /widget/:walletAddress` - Returns SVG widget for wallet address
- `GET /test/:walletAddress` - Test endpoint for debugging API calls
- `GET /health` - Health check endpoint

## API Integration

The widget makes two parallel API calls to Talent Protocol:

1. **Profile Data** - `GET /profile?id=WALLET_ADDRESS`
   - `profile.display_name` - User's display name
   - `profile.image_url` - Profile avatar image
   - `profile.bio` - User biography (truncated to 60 chars)
   - `profile.location` - Geographic location
   - `profile.id` - Profile ID for creating Talent Protocol profile link

2. **Score Data** - `GET /score?id=WALLET_ADDRESS`
   - `score.points` - Builder Score points
   - `score.calculating_score` - Whether score is being updated

Both calls require the `X-API-KEY` header with your Talent Protocol API key.

## 🚀 Quick Start

### Step 1: Get Your Identifiers
- **Wallet Address**: Your Ethereum wallet address (e.g., `0xc2564e41B7F5Cb66d2d99466450CfebcE9e8228f`)
- **Profile ID**: Found in your Talent Protocol profile URL: `https://app.talentprotocol.com/YOUR_PROFILE_ID`

### Step 2: Add to Your README

**✅ Recommended (Clickable Widget):**
```markdown
[![Talent Protocol Score](https://talent-protocol-widget.vercel.app/widget/YOUR_WALLET_ADDRESS)](https://app.talentprotocol.com/YOUR_PROFILE_ID)
```

**Basic Display (Non-clickable):**
```markdown
![Talent Protocol Score](https://talent-protocol-widget.vercel.app/widget/YOUR_WALLET_ADDRESS)
```

### Step 3: Example (Working Link)
```markdown
[![Talent Protocol Score](https://talent-protocol-widget.vercel.app/widget/0xc2564e41B7F5Cb66d2d99466450CfebcE9e8228f)](https://app.talentprotocol.com/YOUR_PROFILE_ID)
```

### 💡 Pro Tips
- Use the **clickable format** for best user experience
- Widget updates automatically every hour
- Works in any GitHub markdown file (README, issues, PRs)

## Dependencies

- `express` - Web server framework
- `axios` - HTTP client for API calls
- `dotenv` - Environment variable loader

## 📋 Technical Details

### GitHub Compatibility
The widget is specifically optimized for GitHub markdown:
- **SVG Format**: Renders consistently across all devices
- **No External Dependencies**: Self-contained for reliable display
- **Security Compliant**: Follows GitHub's content restrictions

### API Rate Limits
- **Caching**: 1-hour cache reduces API calls
- **Parallel Requests**: Profile and score data fetched simultaneously
- **Error Handling**: Graceful fallbacks if API is unavailable

### Performance
- **Fast Loading**: Optimized SVG generation
- **CDN Friendly**: Works with GitHub's image CDN
- **Scalable**: Handles high traffic via Vercel serverless functions

## 🔧 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **Widget not displaying** | Check wallet address format and API key configuration |
| **Not clickable in GitHub** | Use `[![...](widget)](profile)` format instead of `![...](widget)` |
| **Score shows as 0** | Verify wallet address has a Talent Protocol profile |
| **API errors** | Use `/test/:walletAddress` endpoint to debug responses |

### Development Issues

| Issue | Solution |
|-------|----------|
| **"No API key configured"** | Create `.env` file with `TALENT_API_KEY` |
| **Port already in use** | Change port in `.env` or kill existing process |
| **API timeout** | Check Talent Protocol API status |

### Debug Endpoints
- **Health Check**: `https://talent-protocol-widget.vercel.app/health`
- **API Test**: `https://talent-protocol-widget.vercel.app/test/YOUR_WALLET_ADDRESS`
- **Raw Widget**: `https://talent-protocol-widget.vercel.app/widget/YOUR_WALLET_ADDRESS`

## License

MIT