# Pinewood Robotics Website

This is the official website for Pinewood Robotics, FRC team 4765. Built with modern web technologies including [Astro](https://astro.build/) and [React](https://react.dev/), featuring smooth animations, 3D graphics, and a responsive design.

## 🚀 Features

-   **Modern Tech Stack**: Built with Astro 5 and React 19
-   **Smooth Animations**: Lenis smooth scrolling and custom text animations
-   **3D Graphics**: Three.js integration with React Three Fiber
-   **Responsive Design**: Mobile-first approach with Tailwind CSS
-   **Performance Optimized**: Static site generation with image optimization
-   **Analytics**: PostHog integration for user analytics
-   **Authentication**: Clerk integration for user management
-   **Cloud Storage**: AWS S3 integration for media assets
-   **Video Streaming**: HLS.js support for video content
-   **Deployment Ready**: Cloudflare Workers deployment configuration

## 🛠️ Tech Stack

### Core Framework

-   **[Astro](https://astro.build/)** - Static site generator with islands architecture
-   **[React](https://react.dev/)** - UI component library
-   **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript

### Styling & UI

-   **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
-   **[Tailwind Animate](https://github.com/jamiebuilds/tailwindcss-animate)** - Animation utilities
-   **[Lucide React](https://lucide.dev/)** - Icon library
-   **[Class Variance Authority](https://cva.style/)** - Component variant management

### 3D & Animation

-   **[Three.js](https://threejs.org/)** - 3D graphics library
-   **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber)** - React renderer for Three.js
-   **[Lenis](https://lenis.studiofreight.com/)** - Smooth scrolling library

### Services & Integrations

-   **[Clerk](https://clerk.com/)** - Authentication and user management
-   **[PostHog](https://posthog.com/)** - Product analytics
-   **[AWS SDK](https://aws.amazon.com/sdk-for-javascript/)** - S3 storage integration
-   **[Upstash Redis](https://upstash.com/)** - Serverless Redis database
-   **[HLS.js](https://github.com/video-dev/hls.js/)** - HTTP Live Streaming

### Development Tools

-   **[PNPM](https://pnpm.io/)** - Fast, disk space efficient package manager
-   **[Wrangler](https://developers.cloudflare.com/workers/wrangler/)** - Cloudflare Workers CLI

## 📁 Project Structure

```
pwrup-site/
├── public/                 # Static assets
│   ├── PWRUP_text.svg     # Logo and branding
│   ├── Reefscape-Robot.webp # Robot images
│   └── ...
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components
│   │   ├── Welcome.tsx   # Main landing page component
│   │   ├── NavBar.tsx    # Navigation component
│   │   ├── AboutRobotics.tsx # About section
│   │   ├── Positions.tsx # Team positions
│   │   ├── Clips.tsx     # Video clips section
│   │   └── PEARL.tsx     # PEARL robot showcase
│   ├── hooks/            # Custom React hooks
│   │   └── useLenis.ts   # Smooth scrolling hook
│   ├── layouts/          # Astro layouts
│   │   └── Layout.astro  # Main page layout
│   ├── lib/              # Utility libraries
│   │   ├── auth.ts       # Authentication utilities
│   │   ├── kv.ts         # Key-value store utilities
│   │   └── utils.ts      # General utilities
│   ├── pages/            # Astro pages
│   │   ├── index.astro   # Home page
│   │   ├── sign-up.astro # Registration page
│   │   └── tech-club.astro # Tech club redirect
│   └── styles/           # Global styles
│       └── global.css    # Global CSS
├── astro.config.mjs      # Astro configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── wrangler.toml         # Cloudflare Workers configuration
├── deploy.sh             # Deployment script
└── package.json          # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

-   **Node.js** (v18 or higher)
-   **PNPM** (recommended package manager)

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/adamexu/pwrup-site.git
    cd pwrup-site
    ```

2. **Install dependencies**

    ```bash
    pnpm install
    ```

3. **Start the development server**

    ```bash
    pnpm dev
    ```

4. **Open your browser**
   Navigate to `http://localhost:4321` to see the site in action.

### Available Scripts

-   `pnpm dev` - Start development server
-   `pnpm build` - Build for production
-   `pnpm preview` - Preview production build locally
-   `pnpm deploy` - Deploy to Cloudflare Workers

## 🎨 Key Components

### Welcome Component

The main landing page featuring:

-   Animated typewriter effect
-   Smooth reveal animations
-   Background video integration
-   Call-to-action buttons

### Navigation Bar

Responsive navigation with:

-   Auto-hide on scroll down
-   Smooth backdrop blur effect
-   Logo and registration link

### About Robotics

Information section highlighting:

-   Team benefits and opportunities
-   Robot showcase with custom arrow graphics
-   Responsive layout for mobile and desktop

### Positions

Team roles and opportunities with:

-   Interactive position cards
-   Detailed descriptions
-   Application links

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Clerk Authentication
PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# PostHog Analytics
PUBLIC_POSTHOG_KEY=your_posthog_key

# AWS S3 (if using)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=your_aws_region

# Upstash Redis (if using)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

### Customization

#### Fonts

The site uses custom fonts defined in `tailwind.config.js`:

-   **Jost** - Primary font family
-   **Red Hat Display** - Secondary font family

#### Colors & Theming

Brand colors and theming can be customized in:

-   `tailwind.config.js` - Tailwind theme configuration
-   `src/styles/global.css` - Global CSS variables

#### Animation Configuration

Text reveal animations can be customized in `src/components/Welcome.tsx`:

```typescript
const REVEAL_CONFIG = {
    textAlign: "right" as "left" | "center" | "right",
    text: "Pinewood Robotics",
};
```

## 🚀 Deployment

### Cloudflare Workers (Recommended)

1. **Install Wrangler CLI**

    ```bash
    npm install -g wrangler
    ```

2. **Login to Cloudflare**

    ```bash
    wrangler login
    ```

3. **Deploy**
    ```bash
    pnpm deploy
    ```

The site is configured for static deployment with optimized caching headers for assets.

### Alternative Deployment Options

-   **Vercel**: Connect your GitHub repository to Vercel for automatic deployments
-   **Netlify**: Deploy directly from GitHub with build command `pnpm build`
-   **GitHub Pages**: Use GitHub Actions for automated deployment

## 🧪 Testing

### Browser Testing

The project includes Playwright configuration for end-to-end testing:

```bash
# Install Playwright
npx playwright install

# Run tests
npx playwright test
```

### Performance Testing

Test compression and optimization:

```bash
node test-compression.js https://your-site.workers.dev
```

## 📱 Mobile Optimization

The site is fully responsive with:

-   Mobile-first design approach
-   Touch-friendly navigation
-   Optimized images and assets
-   Smooth scrolling on mobile devices

## 🔍 SEO & Analytics

### SEO Features

-   Meta tags and Open Graph integration
-   Structured data markup
-   Sitemap generation
-   Image optimization with alt text

### Analytics

-   PostHog integration for user behavior tracking
-   Custom event tracking for interactions
-   Performance monitoring

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
    ```bash
    git checkout -b feature/amazing-feature
    ```
3. **Commit your changes**
    ```bash
    git commit -m 'Add some amazing feature'
    ```
4. **Push to the branch**
    ```bash
    git push origin feature/amazing-feature
    ```
5. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 About Pinewood Robotics

Pinewood Robotics (FRC Team 4765) is a competitive robotics team from Pinewood School. We participate in the FIRST Robotics Competition (FRC), building robots to compete in annual challenges while fostering STEM education and teamwork.

### Team Highlights

-   **Established**: FRC Team 4765
-   **School**: Pinewood School
-   **Competition**: FIRST Robotics Competition
-   **Focus**: Engineering, programming, design, and outreach

## 📞 Contact

-   **Website**: [pinewood.one](https://pinewood.one)
-   **Registration**: [Sign up for interest](https://pinewood.one/sign-up)
-   **School**: Pinewood School

---

Built with ❤️ by the Pinewood Robotics team
