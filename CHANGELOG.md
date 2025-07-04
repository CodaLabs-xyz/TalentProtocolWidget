# Changelog

All notable changes to this project will be documented in this file.

## [1.5.0] - 2025-06-14

### Added
- **Multiline Bio Support**: Bio text now displays across up to 2 lines with smart word wrapping
- **HTML Entity Escaping**: Safe rendering of special characters in bio, name, and location
- **Adaptive Button Positioning**: Button automatically adjusts position based on bio length
- **Enhanced Score Display**: Larger 22px score in progress ring for better visibility

### Changed
- **Bio Character Limit**: Increased to 70 characters (35 per line) with intelligent word breaks
- **Progress Ring Scaling**: Now scales to 1000 max points for more accurate representation
- **Widget Layout**: Optimized 2-column design with better element spacing
- **Error Handling**: Improved XML parsing with proper character escaping

### Fixed
- **XML Parsing Errors**: Resolved "Cannot use 'in' operator" errors in browsers
- **Bio Display Issues**: Bio text now always visible with proper multiline rendering
- **Button Visibility**: "View Profile →" button always shows with proper positioning

## [1.4.0] - 2025-06-14

### Removed
- **Profile Avatar**: Removed profile image/avatar circle to fix GitHub markdown compatibility issues
- **External Image Dependencies**: Eliminated external image loading for better GitHub performance

### Changed
- **2-Column Layout**: Redesigned with profile info (left) and score display (right)
- **Talent Protocol Logo**: Added official logo to top-left of widget
- **Enhanced Spacing**: Improved vertical spacing between all elements
- **Button Design**: Metallic gray button with better positioning

### Fixed
- **Image Loading Issues**: Resolved profile image display problems in GitHub READMEs
- **Layout Consistency**: Ensures consistent display across all platforms

## [1.3.0] - 2025-06-14

### Added
- **Interactive Profile Button**: Clickable "View Profile →" button that opens user's Talent Protocol profile in new tab
  - Uses `profile.id` from API response to construct URL: `https://app.talentprotocol.com/{id}`
  - Green gradient button design with hover cursor
  - Opens in new tab for seamless GitHub browsing experience

### Changed
- **Progress Ring Position**: Moved to accommodate the new profile button
- **Button Layout**: Positioned in top-right corner for optimal visibility

## [1.2.0] - 2025-06-14

### Added
- **Enhanced Profile Information**: Widget now displays comprehensive profile data
  - Profile image with circular clipping and fallback to initials
  - User biography (truncated to 60 characters)
  - Geographic location with 📍 icon
- **Improved Visual Design**: 
  - Increased widget size to 500x160px for better information display
  - Better layout organization with profile section and score section
  - Enhanced typography and spacing

### Changed
- **Profile API Integration**: Now extracts additional fields from `/profile` endpoint:
  - `profile.image_url` for avatar display
  - `profile.bio` for user description
  - `profile.location` for geographic information
  - `profile.id` for creating profile links
- **Widget Layout**: Reorganized to accommodate richer profile information
- **Example Usage**: Updated documentation to use `0xc2564e41B7F5Cb66d2d99466450CfebcE9e8228f` as example wallet address

## [1.1.0] - 2025-06-14

### Added
- Support for wallet addresses instead of profile IDs
- Display user's actual name from Talent Protocol profile
- Parallel API calls for better performance
- Test endpoint `/test/:walletAddress` for debugging
- Environment variable support with dotenv
- Enhanced error handling and logging
- Vercel deployment configuration

### Changed
- **BREAKING**: Widget endpoint now accepts wallet address instead of profile ID
  - Old: `/widget/4e9db003-da84-466e-a951-c4c8973dfda9`
  - New: `/widget/0xc2564e41B7F5Cb66d2d99466450CfebcE9e8228f`
- API integration now uses two endpoints:
  - `/profile?id=WALLET_ADDRESS` for display name
  - `/score?id=WALLET_ADDRESS` for Builder Score points
- Updated SVG layout to prominently display user's name
- Score visualization now scales based on points (max 500) instead of percentage
- Enhanced README with troubleshooting section

### Fixed
- Corrected Talent Protocol API endpoint usage
- Proper response parsing for score data
- Environment variable loading issues

## [1.0.0] - 2025-06-14

### Added
- Initial release
- Basic SVG widget generation
- Express.js server setup
- Talent Protocol API integration
- GitHub README widget functionality
- Error handling and caching
- MIT license