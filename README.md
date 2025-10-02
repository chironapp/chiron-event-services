# Chiron Event Services 🏃‍♂️

A **web-only** platform for hosting start lists and race results for endurance events managed through the [Chiron](https://www.chironapp.com) training application.

## About This Project

This project is specifically designed to complement the Chiron ecosystem by providing a public-facing web interface where:

- Athletes can find and register for upcoming events
- Race results and timing data are displayed
- Event organizers can manage start lists and publish results

**Web Platform Only**: This application is built exclusively for web deployment and is not intended for mobile app stores.

## Open Source & Race Timing Community

Feel free to use some or all of this code for your own race timing projects! The components and architecture patterns here can be adapted for various endurance sports timing applications.

### Key Reusable Components:

- `SearchInput` - Themed search functionality
- `ToggleSwitch` - Results/Upcoming event filtering
- `NoResultsFound` - Empty state handling
- Theme system with light/dark mode support

## Get Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the web development server

   ```bash
   npm run web
   ```

3. Open your browser to view the application

This project uses [Expo Router](https://docs.expo.dev/router/introduction) for file-based routing and is optimized for web deployment.

## Project Structure

```
/app                    # Expo Router pages
├── index.tsx          # Find Your Race (home page)
├── about.tsx          # About Chiron Event Services
└── _layout.tsx        # Root layout configuration

/components            # Reusable components
├── /input             # Input components (SearchInput, ToggleSwitch)
├── /ui                # UI components (NoResultsFound)
├── TopNav.tsx         # Navigation header
└── Footer.tsx         # Site footer

/constants             # Theme and configuration
└── theme.ts           # Color system and styling constants
```

## Technology Stack

- **[Expo](https://expo.dev)** - React Native for web platform
- **[Expo Router](https://docs.expo.dev/router/)** - File-based routing system
- **TypeScript** - Type safety and development experience
- **React Native Web** - Cross-platform component system

## Deployment

This project is designed for static web hosting and can be deployed to platforms like:

- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

Build for production:

```bash
npx expo export -p web
```

## Contributing to Race Timing Projects

If you're building your own race timing solution, consider these architectural patterns from this project:

- **Theme-based design system** for consistent UI
- **Toggle-based filtering** for results vs upcoming events
- **Search functionality** with proper empty states
- **Responsive web-first design** for public event pages

## Learn More

- [Expo documentation](https://docs.expo.dev/) - Learn about the expo and web deployment
- [Chiron](https://www.chironapp.com) - The endurance training platform
