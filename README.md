# Talent Protocol GitHub Widget

A GitHub widget that displays your Talent Protocol Builder Score in your README.

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
   npm start
   ```

## Usage

Add this to your GitHub README.md:

```markdown
![Talent Protocol Score](https://your-domain.com/widget/YOUR_PROFILE_ID)
```

Replace `YOUR_PROFILE_ID` with your Talent Protocol profile ID (e.g., `4e9db003-da84-466e-a951-c4c8973dfda9`).

## Deploy

You can deploy this widget to any platform that supports Node.js:

- Heroku
- Vercel 
- Railway
- DigitalOcean App Platform

Make sure to set the `TALENT_API_KEY` environment variable on your deployment platform.

## Widget Features

- Displays Builder Score with color-coded progress ring
- Shows verification status
- Responsive SVG design
- Caches results for 1 hour
- Error handling with fallback display

## API Endpoints

- `GET /widget/:profileId` - Returns SVG widget for profile
- `GET /health` - Health check endpoint

## License

MIT