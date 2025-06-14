# Talent Protocol GitHub Widget

A GitHub widget that displays your Talent Protocol Builder Score and display name in your README.

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

- **Profile Information**: Display name, profile image, bio, and location from Talent Protocol
- **Builder Score**: Shows points with color-coded progress ring (green ≥400, orange ≥200, red <200)
- **Interactive Button**: "View Profile →" button that opens user's Talent Protocol profile in new tab
- **Profile Image**: User's avatar with circular clipping, or initials fallback
- **Bio & Location**: Truncated bio text and location with 📍 icon
- **Status Indicator**: Shows if score is currently calculating
- **Responsive Design**: 500x160px SVG that scales well in GitHub READMEs
- **Caching**: Results cached for 1 hour for better performance
- **Error Handling**: Graceful fallback displays for API errors

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

## Example Usage

```markdown
![Talent Protocol Score](https://talent-protocol-widget.vercel.app/widget/0xc2564e41B7F5Cb66d2d99466450CfebcE9e8228f)
```

## Dependencies

- `express` - Web server framework
- `axios` - HTTP client for API calls
- `dotenv` - Environment variable loader

## Troubleshooting

1. **"No API key configured" error**: Make sure you have a `.env` file with `TALENT_API_KEY` set
2. **Port already in use**: Change the port in `.env` or kill the process using the port
3. **API errors**: Use the `/test/:walletAddress` endpoint to debug API responses

## License

MIT