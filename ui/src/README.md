# WeChat Style Task Management

A modern task management application with WeChat-style interface, built with Next.js and optimized for mobile devices.

## 🌟 Features

- **WeChat-style Interface**: Familiar and intuitive mobile-first design
- **Task Management**: Create, edit, and track tasks with priorities and deadlines
- **Workflow Builder**: Custom workflow creation and management
- **Team Collaboration**: Assign tasks and collaborate with team members
- **Mobile Optimized**: Responsive design with touch-friendly interactions
- **Real-time Updates**: Live notifications and status updates
- **Offline Support**: PWA capabilities for offline functionality

## 🚀 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3 with custom WeChat-style components
- **UI Components**: Radix UI primitives with shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Context + Hooks
- **Build Tool**: Next.js built-in Webpack
- **Deployment**: Vercel (recommended)

## 📱 Mobile-First Design

This application is designed with mobile devices as the primary target:

- **Touch Targets**: Minimum 44px for all interactive elements
- **Bottom Navigation**: Native mobile navigation pattern
- **Bottom Sheets**: Mobile-friendly modal dialogs
- **Safe Areas**: Support for notched devices
- **Gestures**: Touch-optimized interactions
- **Performance**: Optimized for mobile networks and devices

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/wechat-task-management.git
   cd wechat-task-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## 🏗️ Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── figma/         # Figma-specific components
│   │   └── *.tsx          # Application components
│   ├── lib/               # Utility functions
│   │   └── utils.ts       # Common utilities
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript type definitions
│   └── context/           # React context providers
├── public/                # Static assets
├── docs/                  # Documentation
├── styles/                # Additional stylesheets
└── components/            # Legacy components (to be migrated)
```

## 🎨 Design System

The application follows a comprehensive design system documented in `/docs/`:

- **Colors**: WeChat-inspired color palette with semantic meanings
- **Typography**: System font stack with proper hierarchy
- **Spacing**: 4px-based grid system with consistent spacing
- **Components**: Reusable UI components with variants
- **Animations**: Smooth transitions and micro-interactions

## 📱 Mobile Optimization

### Touch Interactions
- **Minimum Touch Targets**: 44px x 44px
- **Touch Feedback**: Visual feedback for all interactions
- **Gesture Support**: Swipe, tap, and long-press gestures

### Performance
- **Code Splitting**: Route-based code splitting
- **Image Optimization**: Next.js Image component with WebP
- **Lazy Loading**: Components and images loaded on demand
- **Bundle Analysis**: Optimized bundle size

### Accessibility
- **Screen Reader**: Full ARIA support
- **Keyboard Navigation**: Complete keyboard accessibility
- **Color Contrast**: WCAG 2.1 AA compliance
- **Focus Management**: Proper focus handling

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
NEXT_PUBLIC_APP_NAME="WeChat Task Management"
NEXT_PUBLIC_API_BASE_URL="https://your-api-domain.com"
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

### Tailwind CSS

The application uses a custom Tailwind configuration with:
- WeChat-style color palette
- Mobile-optimized spacing
- Custom animations
- Safe area support

### TypeScript

Strict TypeScript configuration with:
- Path aliases for clean imports
- Strict type checking
- Custom type definitions

## 📚 Documentation

Comprehensive documentation is available in the `/docs/` directory:

- **Design System** (`design-system.json`)
- **Component Specifications** (`component-specifications.json`)  
- **Mobile Optimization** (`mobile-optimization.json`)
- **Technical Architecture** (`technical-architecture.json`)
- **Project Overview** (`project-overview.json`)
- **Taro Migration SOP** (`taro-nutui-migration-sop.json`)

## 🧪 Testing

The project includes comprehensive testing setup:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

Testing stack:
- **Jest**: Test runner
- **React Testing Library**: Component testing
- **Testing Library User Event**: User interaction testing

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   ```bash
   npx vercel
   ```

2. **Set environment variables** in Vercel dashboard

3. **Deploy**
   ```bash
   npx vercel --prod
   ```

### Other Platforms

The application can be deployed to any platform that supports Node.js:

- **Netlify**: Static site hosting
- **Railway**: Full-stack hosting  
- **DigitalOcean**: VPS deployment
- **AWS**: EC2 or Amplify hosting

## 🔄 Migration to Taro

For cross-platform deployment (WeChat Mini Program, H5, React Native), see the migration guide:

📄 **[Taro + NutUI Migration SOP](/docs/taro-nutui-migration-sop.json)**

This comprehensive guide includes:
- Step-by-step migration process
- Component mapping from ShadCN to NutUI
- Timeline and resource planning
- Risk mitigation strategies

## 🤝 Contributing

1. **Fork the repository**
2. **Create your feature branch**
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

### Code Style

- Follow the ESLint and Prettier configurations
- Use TypeScript for all new code
- Follow the component naming conventions
- Write tests for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **WeChat Design Team** - Design inspiration
- **Vercel** - Next.js framework and hosting
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide** - Beautiful icon library

## 📞 Support

For support and questions:

- **GitHub Issues**: [Create an issue](https://github.com/your-username/wechat-task-management/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/wechat-task-management/discussions)
- **Email**: support@your-domain.com

## 🗺️ Roadmap

- [ ] **PWA Support** - Service worker and offline capabilities
- [ ] **Push Notifications** - Real-time notifications
- [ ] **Dark Mode** - Complete dark theme implementation
- [ ] **Internationalization** - Multi-language support
- [ ] **Advanced Analytics** - User behavior tracking
- [ ] **Team Management** - Enhanced collaboration features
- [ ] **API Integration** - Backend service integration
- [ ] **Mobile App** - React Native version

---

Built with ❤️ using Next.js and WeChat design principles.