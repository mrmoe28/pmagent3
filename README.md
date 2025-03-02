# Project Management Agent

A comprehensive project management application built with Next.js, TypeScript, and Tailwind CSS. This application helps users create, manage, and track projects with advanced features for document management and equipment tracking.

## Features

- **Project Planning**: Generate comprehensive project plans using AI
- **Document Management**: Upload and manage project-related documents
- **Plan Set Analysis**: Upload PDF plan sets and automatically extract equipment data
- **Equipment Tracking**: Track equipment used in projects
- **Bill of Materials**: Automatically generate and manage bills of materials
- **Installation Instructions**: Search for installation instructions for equipment

## Solar Project Management

The application includes specialized features for solar project management:
- Track solar installation projects
- Manage plan sets and diagrams
- Track tasks and daily updates
- Generate bills of materials for solar installations

## Technologies Used

- **Next.js**: App Router for server and client components
- **TypeScript**: For type safety
- **Tailwind CSS**: For styling
- **Zustand**: For state management
- **Shadcn/UI**: For UI components

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/pmagent3.git
cd pmagent3
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Deployment on Vercel

This project is optimized for deployment on Vercel, the platform created by the team behind Next.js.

### Deploying to Vercel

1. Create a Vercel account at [vercel.com](https://vercel.com) if you don't have one

2. Install the Vercel CLI:
```bash
npm install -g vercel
```

3. Login to Vercel:
```bash
vercel login
```

4. Deploy the project:
```bash
vercel
```

5. For production deployment:
```bash
vercel --prod
```

### Environment Variables

Make sure to set up the following environment variables in your Vercel project settings:

- `PERPLEXITY_API_KEY`: Your Perplexity API key
- `CLAUDE_API_KEY`: Your Claude API key
- `PERPLEXITY_API_URL`: Perplexity API endpoint
- `CLAUDE_API_URL`: Claude API endpoint
- `NEXT_PUBLIC_APP_URL`: Your deployed app URL
- `NEXT_PUBLIC_APP_NAME`: Project Management Agent

## Project Structure

- `src/app`: Main application code
  - `components`: Reusable UI components
  - `lib`: Utility functions and store
  - `types`: TypeScript type definitions
  - `solar`: Solar project management pages
  - `projects`: Project management pages
  - `tasks`: Task management pages

## License

This project is licensed under the MIT License - see the LICENSE file for details.
