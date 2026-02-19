# Devdocs - Developer Documentation Hub

A modern, community-driven platform that brings together documentation for developer tools, libraries, and frameworks in one accessible place.

---

## 🎯 What is Devdocs?

Devdocs is a centralized hub where developers can discover, explore, and share comprehensive documentation for the tools and libraries they use. Instead of juggling multiple documentation websites, Devdocs aggregates everything in a beautiful, searchable interface.

### The Problem We're Solving
Developers spend countless hours:
- Searching for the right documentation
- Jumping between multiple websites
- Struggling to find quality guides and examples
- Losing track of tools they found useful

Devdocs fixes this by creating a single, collaborative space where developers can find all the documentation they need, curated by the community.

---

## ✨ Key Features

### For Everyone
- Browse Applications: Discover hundreds of developer tools and libraries
- Search & Filter: Find exactly what you need with powerful search and category filters
- Upvote & Like: Show appreciation for tools you find most useful
- View Your Profile: Track applications you've upvoted and liked

### For Contributors
- Add Documentation: Contribute new tools and write comprehensive guides
- Share Knowledge: Help other developers discover quality resources
- Community-Driven: Built by developers, for developers

---

## 🛠️ How It Works (Non-Technical Overview)

### User Journey

1. Visiting Devdocs
- Users land on the homepage and browse through featured applications
- They can search for specific tools (e.g., "React", "TypeScript", "Docker")
- Results show all applications matching their query with descriptions and categories

2. Exploring an Application
- Click on any application to see full documentation
- View description, getting started guides, key features, and useful links
- Upvote if you found it helpful
- Like if you want to save it for later

3. Managing Your Profile
- Your profile shows all applications you've upvoted
- Separately displays all applications you've liked
- Easy access to tools you've marked as favorites

4. Contributing
- Share your knowledge by adding new applications
- Write descriptions and guides to help others
- The community votes on your contributions

---

## 🏗️ How It Works (Technical Overview for Developers)

### Architecture Overview

```
Frontend (Next.js)
    ↓
API Routes (Node.js)
    ↓
Contentstack (CMS)
    ↓
Database & Media
```

### Key Technologies

- **Frontend**: Next.js with TypeScript for type-safe React components
- **Authentication**: NextAuth.js (Google OAuth login)
- **CMS**: Contentstack for managing applications and content
- **Styling**: Tailwind CSS for responsive, modern UI design
- **Database**: Contentstack's built-in database

### Main Components & How They Work

#### 1. Homepage (`app/page.tsx`)
- Hero section with feature highlights
- Displays value propositions
- Links to key sections (browse, contribute, FAQs)

#### 2. Applications Page (`app/applications/`)
- Browse Feature: 
  - Fetches all applications from Contentstack using `getAllApplications()`
  - Displays in a beautiful grid with shimmer effects
  - Real-time upvote/like counts
  
- Search & Filter:
  - Client-side filtering with search query and categories
  - Sorting options (name, recent, popular)
  
- Upvote/Like System:
  - Users click buttons to upvote or like applications
  - API routes (`/api/upvote`, `/api/like`) update the database
  - State managed locally in component with React hooks

#### 3. Application Detail Page (`app/applications/[slug]/`)
- Full application view with complete documentation
- Changelog section showing updates
- Interactive upvote/like buttons
- Links to official documentation

#### 4. Profile Page (`app/profile/`)
- Server-fetches user data from Contentstack
- Displays upvoted applications in one section
- Displays liked applications in another section
- Shows stats: total upvotes and likes
- Simple click to revisit any saved application

#### 5. Contribute Page (`app/contribute/`)
- Rich text editor for writing guides
- Form fields for app details (title, description, category, tags)
- Submits new applications to Contentstack via API routes
- Contribution approval system

### Data Flow

When a User Upvotes an App:
```
User clicks upvote button
    ↓
Component calls /api/upvote endpoint
    ↓
API route authenticates user (NextAuth)
    ↓
Updates application's upvote count in Contentstack
    ↓
Updates user's upvoted_applications list
    ↓
Returns success response
    ↓
UI updates with new count and button state
```

When a User Views Their Profile:
```
Page server-fetches user data from Contentstack
    ↓
Extracts upvoted_applications array
    ↓
Extracts liked_applications array
    ↓
Renders two sections with applications
    ↓
User can click any app to view full details
```

When a User Contributes:
```
User fills in contribution form
    ↓
Clicks "Submit" button
    ↓
Form data sent to /api/contribute endpoint
    ↓
API validates and stores in Contentstack
    ↓
Application appears in pending contributions
    ↓
Admin reviews and approves
    ↓
App goes live on the platform
```

### File Structure

```
app/
├── page.tsx                 # Homepage
├── applications/
│   ├── page.tsx            # Browse all applications
│   └── [slug]/
│       ├── page.tsx        # Application detail
│       └── changelog/       # Version history
├── profile/
│   ├── page.tsx            # Profile server component
│   └── ProfileClient.tsx    # Profile client component
├── contribute/
│   └── page.tsx            # Contribution form
└── api/                     # API routes
    ├── upvote/route.ts      # Handle upvotes
    ├── like/route.ts        # Handle likes
    ├── contribute/route.ts   # Handle contributions
    └── user/
        ├── upvoted/route.ts  # Get user's upvotes
        └── liked/route.ts    # Get user's likes

lib/
├── contentstack.ts          # Contentstack delivery API
├── contentstack-management.ts # CMS management API
├── contentstack-management-queries.ts # Database operations
├── auth.ts                  # Authentication config
└── queries.ts              # Database query helpers

components/
├── ui/                      # Reusable UI components
├── applications/            # Application cards & grids
├── layout/                  # Header, footer
└── ...                      # Other components
```

---

## 🚀 Getting Started (For Developers)

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/unboundedraj/Devdocs.git
cd Devdocs
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root with:
```env
NEXT_PUBLIC_CONTENTSTACK_API_KEY=your_api_key
CONTENTSTACK_MANAGEMENT_TOKEN=your_management_token
NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT=production

GOOGLE_CLIENT_ID=your_google_oauth_id
GOOGLE_CLIENT_SECRET=your_google_oauth_secret

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📝 Code Navigation Guide

### Adding a New Feature

**Example: Adding a "Copy Link" button to applications**

1. **Find the component**: `components/applications/ApplicationCard.tsx`
2. **Add button in the footer**: Near the upvote/like buttons
3. **Create handler function**: `handleCopyLink()` in the component
4. **Test**: Run the app and verify the button works

### Updating Data Structure

**Example: Adding a "difficulty_level" field**

1. **Update Contentstack CMS**: Add field to "application" content type
2. **Update TypeScript type**: `types/application.ts`
3. **Update queries**: `lib/contentstack-management-queries.ts`
4. **Update UI**: Show the field in `ApplicationCard.tsx`

### Adding a New API Endpoint

**Example: Add endpoint to get trending apps**

1. **Create file**: `app/api/trending/route.ts`
2. **Write handler**:
```typescript
export async function GET() {
  // Fetch top upvoted apps
  // Return JSON response
}
```
3. **Call from component**: `fetch('/api/trending')`
4. **Display results**: Show in a component

---

## 🤝 Contributing

We welcome contributions from everyone! Here's how:

### For Developers
- Fork the repository
- Create a feature branch (`git checkout -b feature/amazing-feature`)
- Make your changes
- Push to the branch
- Open a Pull Request

### For Documentation Contributors
- Share tools and libraries on our platform
- Write guides to help others
- Update existing documentation
- Use the contribute page to add new entries

---

## 📞 Support

- **Questions?** Open an issue on GitHub
- **Found a bug?** Report it with steps to reproduce
- **Have ideas?** We'd love to hear them in discussions

---

## 🙏 Acknowledgments

This platform is built by and for the developer community. Every contribution, upvote, and like helps make developer resources more discoverable.

**Happy exploring! 🚀**
