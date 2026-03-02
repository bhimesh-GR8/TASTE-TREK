# Taste-Trek - Frontend Only Version

This is now a **frontend-only** static web application. All data is embedded directly in the application using mock data stored in `client/src/lib/mockData.ts`.

## What Changed

### ✅ Removed
- **Backend Server**: Express.js server code removed
- **Database Dependencies**: Removed all PostgreSQL and Drizzle ORM dependencies
- **Authentication**: Removed backend authentication (Passport.js, OpenID Client, etc.)
- **Server-only packages**: Removed Express, session management, database drivers, etc.

### ✅ Updated
- **Data Source**: All API calls now fetch from embedded mock data instead of a backend server
- **Build Process**: Simplified to frontend-only Vite build
- **Scripts**: Updated npm scripts to remove backend commands
- **Package.json**: Removed all backend dependencies, keeping only frontend packages

### ✅ What Still Works
- ✨ Full React UI with all components intact
- 🎯 Countries and Destinations browsing
- 🍽️ Restaurant and Cultural Site listings
- 🔍 Search functionality
- ❤️ Favorites (stored in localStorage)
- 🗺️ Maps and visualization components
- 📱 Responsive design

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Build for Production

```bash
# Build the frontend
npm run build

# Preview the production build locally
npm run preview
```

## Project Structure

```
Taste-Trek/
├── client/                          # Frontend React app
│   ├── src/
│   │   ├── components/             # UI Components
│   │   ├── hooks/
│   │   │   └── use-trek-data.ts   # ✅ Updated: Uses mock data
│   │   ├── lib/
│   │   │   ├── mockData.ts        # ✅ NEW: All static data here
│   │   │   └── utils.ts
│   │   ├── pages/                 # Route pages
│   │   ├── App.tsx                # Main app
│   │   └── main.tsx
│   ├── public/                    # Static assets
│   └── index.html
├── shared/                        # Shared types and schemas
│   ├── schema.ts
│   └── routes.ts
├── vite.config.ts                # ✅ Updated: Frontend-only config
├── package.json                  # ✅ Updated: Removed backend deps
└── tsconfig.json

[REMOVED] server/                 # ❌ Backend removed
[REMOVED] script/                 # ❌ Build script removed
```

## Available Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run check    # Type check with TypeScript
```

## Data Management

All application data is stored in `client/src/lib/mockData.ts`:

- **Countries**: 5 countries with details
- **Destinations**: 12 destinations across countries
- **Restaurants**: 60 restaurant listings
- **Cultural Sites**: 60 cultural site listings
- **Images**: Mix of local and Unsplash images

### Adding More Data

To add more countries, destinations, restaurants, or cultural sites:

1. Edit `client/src/lib/mockData.ts`
2. Add new entries to the corresponding mock arrays
3. The changes will automatically reflect in the app

### Favorites

Favorites are stored in **browser's localStorage** with key `"taste-trek-favorites"`:

```javascript
// Favorites structure
{
  id: number,
  userId: "local-user",
  itemType: 'country' | 'destination',
  itemId: number,
  createdAt: Date
}
```

## Deployment

### Static Hosting (Recommended)
This app can be deployed to any static hosting service:

**Vercel**
```bash
npm install -g vercel
vercel
```

**Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir dist
```

**GitHub Pages**
```bash
npm run build
# Upload dist/ folder to gh-pages branch
```

### Other Options
- AWS S3 + CloudFront
- Firebase Hosting
- Azure Static Web Apps
- Any static file server (nginx, Apache, etc.)

## Performance Optimizations

- ✅ No backend network requests
- ✅ Instant data loading (from JavaScript)
- ✅ Minimal bundle size (no server dependencies)
- ✅ Can be cached indefinitely
- ✅ Works offline once loaded

## Browser Support

Works on all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Notes

- **No Authentication**: The app no longer has authentication. Remove/update the SignIn page if not needed.
- **No Backend APIs**: All API calls have been replaced with mock data queries
- **localStorage Only**: Favorites are stored in browser's localStorage (not synced across devices)
- **Static Images**: Most images are from Unsplash - ensure compliance with usage rights

## Troubleshooting

### Port already in use
```bash
# Use a different port
npm run dev -- --port 3000
```

### Build fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Images not loading
Check that image URLs are correct in `mockData.ts`. Local images should be in `client/public/images/`.

## Future Improvements

Consider adding:
- [ ] Service Worker for offline support
- [ ] PWA manifest for installable app
- [ ] More detailed mock data
- [ ] Export functionality (to PDF/JSON)
- [ ] Filtering and sorting
- [ ] Google Maps integration (read-only)
- [ ] Multi-language support

## License

MIT
