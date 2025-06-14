require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const TALENT_API_BASE = 'https://api.talentprotocol.com';
const API_KEY = process.env.TALENT_API_KEY;

function generateSVG(profileData) {
  const { builderScore, calculating, displayName, imageUrl, bio, location, profileId } = profileData;
  const scoreColor = builderScore >= 400 ? '#4CAF50' : builderScore >= 200 ? '#FF9800' : '#F44336';
  const statusText = calculating ? 'Calculating...' : 'Builder Score';
  
  // Truncate bio to fit in widget
  const truncatedBio = bio && bio.length > 60 ? bio.substring(0, 57) + '...' : bio;
  
  return `
<svg width="500" height="160" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0A0A0A;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1A1A1A;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="buttonBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#404040;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#505050;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#707070;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#909090;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="500" height="160" rx="12" fill="url(#bg)" stroke="#404040" stroke-width="1"/>
  
  <!-- Profile Avatar -->
  <circle cx="40" cy="40" r="25" fill="url(#accentGrad)"/>
  <text x="40" y="48" font-family="Arial, sans-serif" font-size="20" font-weight="bold" 
        fill="#0A0A0A" text-anchor="middle">${(displayName || 'B').charAt(0).toUpperCase()}</text>
  
  <!-- Name and Location -->
  <text x="80" y="30" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#E0E0E0">
    ${displayName || 'Builder'}
  </text>
  
  ${location ? `
  <text x="80" y="50" font-family="Arial, sans-serif" font-size="12" fill="#B0B0B0">
    📍 ${location}
  </text>
  ` : ''}
  
  <!-- View Profile Button -->
  ${profileId ? `
  <a href="https://app.talentprotocol.com/${profileId}" target="_blank">
    <rect x="350" y="15" width="130" height="30" rx="15" fill="url(#buttonBg)" stroke="#707070" stroke-width="1" style="cursor:pointer"/>
    <text x="415" y="33" font-family="Arial, sans-serif" font-size="12" font-weight="bold" 
          fill="#E0E0E0" text-anchor="middle">View Profile →</text>
  </a>
  ` : ''}
  
  <!-- Bio -->
  ${truncatedBio ? `
  <text x="20" y="85" font-family="Arial, sans-serif" font-size="11" fill="#C0C0C0">
    ${truncatedBio}
  </text>
  ` : ''}
  
  <!-- Score Section -->
  <text x="20" y="115" font-family="Arial, sans-serif" font-size="12" fill="#B0B0B0">
    ${statusText}
  </text>
  
  <text x="20" y="140" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="${scoreColor}">
    ${builderScore || 'N/A'}
  </text>
  
  <text x="120" y="140" font-family="Arial, sans-serif" font-size="10" fill="#909090">
    ${calculating ? 'updating...' : 'points'}
  </text>
  
  <!-- Progress Ring -->
  <circle cx="430" cy="120" r="30" fill="none" stroke="#404040" stroke-width="3"/>
  <circle cx="430" cy="120" r="30" fill="none" stroke="${scoreColor}" stroke-width="3" 
          stroke-dasharray="${Math.min((builderScore / 500) * 188, 188)} 188" transform="rotate(-90 430 120)"/>
  
  <text x="430" y="125" font-family="Arial, sans-serif" font-size="14" font-weight="bold" 
        fill="#E0E0E0" text-anchor="middle">
    ${builderScore || 0}
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
        imageUrl: '',
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
    const imageUrl = profileData.image_url || '';
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
      imageUrl,
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
      imageUrl: '',
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