const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const TALENT_API_BASE = 'https://api.talentprotocol.com';
const API_KEY = process.env.TALENT_API_KEY;

function generateSVG(profileData) {
  const { name, builderScore, verified } = profileData;
  const scoreColor = builderScore >= 80 ? '#4CAF50' : builderScore >= 60 ? '#FF9800' : '#F44336';
  const verifiedIcon = verified ? '✓' : '';
  
  return `
<svg width="400" height="120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="400" height="120" rx="10" fill="url(#bg)"/>
  
  <text x="20" y="30" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="white">
    Talent Protocol ${verifiedIcon}
  </text>
  
  <text x="20" y="55" font-family="Arial, sans-serif" font-size="14" fill="white" opacity="0.9">
    ${name || 'Builder'}
  </text>
  
  <text x="20" y="80" font-family="Arial, sans-serif" font-size="12" fill="white" opacity="0.8">
    Builder Score
  </text>
  
  <text x="20" y="100" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="${scoreColor}">
    ${builderScore || 'N/A'}
  </text>
  
  <circle cx="350" cy="60" r="35" fill="none" stroke="white" stroke-width="3" opacity="0.3"/>
  <circle cx="350" cy="60" r="35" fill="none" stroke="${scoreColor}" stroke-width="3" 
          stroke-dasharray="${(builderScore / 100) * 220} 220" transform="rotate(-90 350 60)"/>
  
  <text x="350" y="65" font-family="Arial, sans-serif" font-size="16" font-weight="bold" 
        fill="white" text-anchor="middle">
    ${builderScore || 0}
  </text>
</svg>`.trim();
}

app.get('/widget/:profileId', async (req, res) => {
  try {
    const { profileId } = req.params;
    
    console.log(`Fetching widget for profile: ${profileId}`);
    console.log(`API Key configured: ${!!API_KEY}`);
    
    if (!API_KEY) {
      console.error('No API key configured');
      return res.status(500).send(generateSVG({
        name: 'No API Key',
        builderScore: 0,
        verified: false
      }));
    }
    
    const response = await axios.get(`${TALENT_API_BASE}/accounts`, {
      headers: {
        'X-API-KEY': API_KEY
      },
      params: {
        identifier: profileId
      }
    });
    
    const profileData = response.data;
    const builderScore = profileData.builder_score || profileData.score || 0;
    const name = profileData.name || profileData.username || 'Builder';
    const verified = profileData.verified || profileData.is_verified || false;
    
    const svg = generateSVG({
      name,
      builderScore,
      verified
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
      name: `Error ${error.response?.status || 'Unknown'}`,
      builderScore: 0,
      verified: false
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

app.get('/test/:profileId', async (req, res) => {
  try {
    const { profileId } = req.params;
    
    if (!API_KEY) {
      return res.json({ error: 'No API key configured' });
    }
    
    const response = await axios.get(`${TALENT_API_BASE}/accounts`, {
      headers: {
        'X-API-KEY': API_KEY
      },
      params: {
        identifier: profileId
      }
    });
    
    res.json({
      success: true,
      data: response.data,
      status: response.status
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
  console.log(`Widget URL: http://localhost:${PORT}/widget/[PROFILE_ID]`);
});