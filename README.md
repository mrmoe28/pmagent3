# PmAgent3

A modern project management platform for creating strategic plans, standard operating procedures, and managing tasks.

## Features

- **Project Planning**: Generate comprehensive project plans with objectives, milestones, resources, and standard operating procedures
- **AI-Powered Research**: Utilizes Perplexity API for deep research on project topics
- **Strategic Planning**: Claude AI generates tailored project plans based on research and user input
- **Multiple Strategy Options**: Choose from various project management methodologies (Agile, Waterfall, Lean, etc.)
- **Task Management**: Track and manage tasks with priority and status tracking
- **Next.js App Router**: Modern routing system with server components
- **TypeScript**: Type-safe development experience
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality UI components

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- Perplexity API key (for research functionality)
- Claude API key (for plan generation)

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:mrmoe28/pmagent3.git
   cd pmagent3
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Add your API keys to `.env.local`

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

```
pmagent3/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── projects/  # Project management components
│   │   │   ├── tasks/     # Task management components
│   │   │   └── ui/        # Reusable UI components
│   │   ├── lib/
│   │   │   ├── api/       # API integrations (Perplexity, Claude)
│   │   │   ├── schemas/   # Zod validation schemas
│   │   │   └── utils.ts   # Utility functions
│   │   ├── projects/      # Project management pages
│   │   ├── tasks/         # Task management pages
│   │   ├── types/         # TypeScript type definitions
│   │   ├── layout.tsx     # Root layout component
│   │   ├── page.tsx       # Home page component
│   │   └── globals.css    # Global CSS
├── public/                # Static assets
├── .env.local.example     # Example environment variables
├── .gitignore
├── next.config.ts
├── package.json
├── README.md
└── tsconfig.json
```

## Development Guidelines

- Use server components by default, client components only when necessary
- Follow atomic design principles for component organization
- Use TypeScript for type safety
- Implement Zod for runtime type validation
- Use Tailwind CSS for styling
- Follow the Next.js App Router conventions

## API Integrations

### Perplexity API
Used for deep research on project topics to gather relevant information for project planning.

### Claude API
Used to generate comprehensive project plans based on research results and user input.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
