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
- **Display Name**: User's Talent Protocol display name with Talent logo
- **Multiline Bio**: Smart word-wrapped biography (up to 2 lines, 35 chars/line)
- **Location**: Geographic location with 📍 icon
- **Clean Layout**: Professional 2-column design optimized for GitHub

### 📊 Builder Score
- **Large Score Display**: Prominent 22px score in progress ring
- **Progress Ring**: Visual indicator scaled to 1000 max points
- **Status Label**: "Builder Score" with "points" descriptor
- **Real-time Updates**: Shows if score is currently calculating

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

### Step 3: Working Example
**Copy this exact code for the demo profile:**
```markdown
[![Talent Protocol Score](https://talent-protocol-widget.vercel.app/widget/0xc2564e41B7F5Cb66d2d99466450CfebcE9e8228f)](https://app.talentprotocol.com/4e9db003-da84-466e-a951-c4c8973dfda9)
```

**For your own profile, replace with your details:**
```markdown
[![Talent Protocol Score](https://talent-protocol-widget.vercel.app/widget/YOUR_WALLET_ADDRESS)](https://app.talentprotocol.com/YOUR_PROFILE_ID)
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

### Widget Specifications
- **Dimensions**: 500×180px SVG optimized for GitHub
- **Layout**: 2-column design (profile left, score right)
- **Typography**: Arial font family with multiple sizes
- **Color Scheme**: Talent Protocol black with metallic gray accents

### GitHub Compatibility
- **SVG Format**: Renders consistently across all devices
- **HTML Entity Escaping**: Safe rendering of special characters
- **No External Images**: Avoids GitHub security restrictions
- **Markdown Optimized**: Works with GitHub's image CDN

### API Integration
- **Parallel Requests**: Profile and score data fetched simultaneously
- **1-hour Caching**: Reduces API calls and improves performance
- **Error Handling**: Graceful fallbacks with informative displays
- **Rate Limiting**: Respects Talent Protocol API limits

### Performance
- **Serverless**: Deployed on Vercel for global edge performance
- **Fast SVG Generation**: Optimized template rendering
- **Automatic Updates**: Refreshes data every hour
- **Scalable**: Handles high traffic efficiently

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