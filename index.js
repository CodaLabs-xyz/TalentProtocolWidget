require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const TALENT_API_BASE = 'https://api.talentprotocol.com';
const API_KEY = process.env.TALENT_API_KEY;

function generateSVG(profileData) {
  const { builderScore, calculating, displayName, bio, location, profileId } = profileData;
  const statusText = calculating ? 'Calculating...' : 'Builder Score';
  
  // Truncate bio to fit in widget
  const truncatedBio = bio && bio.length > 60 ? bio.substring(0, 57) + '...' : bio;
  
  return `
<svg width="500" height="180" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0A0A0A;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1A1A1A;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="buttonBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#404040;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#505050;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="500" height="180" rx="12" fill="url(#bg)" stroke="#404040" stroke-width="1"/>
  
  <!-- Left Section: Profile Info -->
  <!-- Talent Protocol Logo -->
  <g transform="translate(30, 25)">
    <path d="M15.6946 18.0951C16.1754 18.5746 16.8166 18.8143 17.618 18.8143L25.8148 18.8143L24.8916 16.1773L18.366 16.1773C17.8674 16.1773 17.618 15.911 17.618 15.3782L17.618 8.8908L15 8L15 16.1773C15 16.9764 15.2315 17.6157 15.6946 18.0951Z" fill="white"/>
    <path d="M15.6946 31.2807C16.1754 31.7601 16.8166 31.9999 17.618 31.9999L25.8148 31.9999L24.8916 29.3629L18.366 29.3629C17.8674 29.3629 17.618 29.0965 17.618 28.5638L17.618 22.0763L15 21.1855L15 29.3629C15 30.162 15.2315 30.8012 15.6946 31.2807Z" fill="white"/>
  </g>
  
  <!-- Name -->
  <text x="90" y="35" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#E0E0E0">
    ${displayName || 'Builder'}
  </text>
  
  <!-- Location -->
  ${location ? `
  <text x="90" y="55" font-family="Arial, sans-serif" font-size="14" fill="#B0B0B0">
    📍 ${location}
  </text>
  ` : ''}
  
  <!-- Bio -->
  ${truncatedBio ? `
  <text x="90" y="80" font-family="Arial, sans-serif" font-size="12" fill="#C0C0C0">
    ${truncatedBio}
  </text>
  ` : ''}
  
  <!-- View Profile Button -->
  ${profileId ? `
  <a href="https://app.talentprotocol.com/${profileId}" target="_blank">
    <rect x="90" y="100" width="120" height="28" rx="14" fill="url(#buttonBg)" stroke="#707070" stroke-width="1" style="cursor:pointer"/>
    <text x="150" y="118" font-family="Arial, sans-serif" font-size="12" font-weight="bold" 
          fill="#E0E0E0" text-anchor="middle">View Profile →</text>
  </a>
  ` : ''}
  
  <!-- Right Section: Score Display -->
  <text x="380" y="35" font-family="Arial, sans-serif" font-size="12" fill="#B0B0B0" text-anchor="middle">
    ${statusText}
  </text>
  <text x="380" y="60" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#E0E0E0" text-anchor="middle">
    ${builderScore || 'N/A'}
  </text>
  <text x="380" y="75" font-family="Arial, sans-serif" font-size="11" fill="#909090" text-anchor="middle">
    ${calculating ? 'updating...' : 'points'}
  </text>
  
  <!-- Score Circle Background -->
  <circle cx="380" cy="120" r="35" fill="none" stroke="#404040" stroke-width="3"/>
  <circle cx="380" cy="120" r="35" fill="none" stroke="#606060" stroke-width="2" 
          stroke-dasharray="${Math.min((builderScore / 500) * 220, 220)} 220" transform="rotate(-90 380 120)"/>
  
  <text x="380" y="125" font-family="Arial, sans-serif" font-size="14" font-weight="bold" 
        fill="#E0E0E0" text-anchor="middle">
    ${Math.round((builderScore / 500) * 100) || 0}%
  </text>
</svg>`.trim();
}

app.get('/widget/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    console.log(`Fetching widget for wallet: ${walletAddress}`);
    console.log(`API Key configured: ${!!API_KEY}`);
    
    if (!API_KEY) {
      console.error('No API key configured');
      return res.status(500).send(generateSVG({
        builderScore: 0,
        calculating: false,
        displayName: 'No API Key',
        bio: '',
        location: '',
        profileId: ''
      }));
    }
    
    // Make both API calls in parallel
    const [profileResponse, scoreResponse] = await Promise.all([
      axios.get(`${TALENT_API_BASE}/profile`, {
        headers: {
          'X-API-KEY': API_KEY
        },
        params: {
          id: walletAddress
        }
      }),
      axios.get(`${TALENT_API_BASE}/score`, {
        headers: {
          'X-API-KEY': API_KEY
        },
        params: {
          id: walletAddress
        }
      })
    ]);
    
    const profileData = profileResponse.data.profile || {};
    const displayName = profileData.display_name || 'Builder';
    const bio = profileData.bio || '';
    const location = profileData.location || '';
    const profileId = profileData.id || '';
    
    const builderScore = scoreResponse.data.score?.points || 0;
    const calculating = scoreResponse.data.score?.calculating_score || false;
    
    console.log(`Profile data:`, { displayName, bio, location, profileId, builderScore, calculating });
    
    const svg = generateSVG({
      builderScore,
      calculating,
      displayName,
      bio,
      location,
      profileId
    });
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(svg);
    
  } catch (error) {
    console.error('Error fetching profile:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    
    const errorSvg = generateSVG({
      builderScore: 0,
      calculating: false,
      displayName: `Error ${error.response?.status || 'Unknown'}`,
      bio: '',
      location: '',
      profileId: ''
    });
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(errorSvg);
  }
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    hasApiKey: !!API_KEY
  });
});

app.get('/test/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    if (!API_KEY) {
      return res.json({ error: 'No API key configured' });
    }
    
    // Test both endpoints
    const [profileResponse, scoreResponse] = await Promise.all([
      axios.get(`${TALENT_API_BASE}/profile`, {
        headers: {
          'X-API-KEY': API_KEY
        },
        params: {
          id: walletAddress
        }
      }),
      axios.get(`${TALENT_API_BASE}/score`, {
        headers: {
          'X-API-KEY': API_KEY
        },
        params: {
          id: walletAddress
        }
      })
    ]);
    
    res.json({
      success: true,
      profile: {
        data: profileResponse.data,
        status: profileResponse.status
      },
      score: {
        data: scoreResponse.data,
        status: scoreResponse.status
      }
    });
    
  } catch (error) {
    res.json({
      error: true,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
});

app.listen(PORT, () => {
  console.log(`Talent Protocol Widget server running on port ${PORT}`);
  console.log(`Widget URL: http://localhost:${PORT}/widget/[WALLET_ADDRESS]`);
});