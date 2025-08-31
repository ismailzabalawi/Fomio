# Discourse API Setup Guide

## Configuration

The app is now configured to connect to `https://meta.techrebels.info` by default.

To use the Discourse API with authentication, you can optionally set up environment variables:

1. Create a `.env` file in your project root
2. Add the following variables:

```bash
# Discourse API Configuration (optional - app works without these)
EXPO_PUBLIC_DISCOURSE_URL=https://meta.techrebels.info
EXPO_PUBLIC_DISCOURSE_API_KEY=your_api_key_here
EXPO_PUBLIC_DISCOURSE_USERNAME=your_username_here
```

## Getting API Key

1. Go to your Discourse instance
2. Navigate to your user preferences
3. Go to "API" tab
4. Generate a new API key
5. Copy the key and username

## Testing

The app now includes a test component that will:
- Try to connect to your Discourse instance
- Show demo data if no instance is configured
- Fetch latest topics when properly configured
- Display connection status and topic counts

**Note**: The app currently runs in "Demo Mode" until you configure a real Discourse instance.

## API Endpoints Implemented

- `GET /latest.json` - Fetch latest topics
- `GET /t/{id}.json` - Fetch topic details
- `GET /categories.json` - Fetch categories
- `POST /session` - User login
- `POST /posts` - Create posts/topics
- `GET /u/{username}.json` - Fetch user profile
- `GET /search.json` - Search topics

## Error Handling

The API includes comprehensive error handling for:
- Network errors
- Authentication failures
- Server errors
- Validation errors
