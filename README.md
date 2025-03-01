# PmAgent3

A modern Next.js application built with the App Router, TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

- **Next.js App Router**: Modern routing system with server components
- **TypeScript**: Type-safe development experience
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality UI components
- **Zod**: Runtime type validation
- **Jotai/Zustand**: State management
- **React Query**: Server-state synchronization

## Getting Started

### Prerequisites

- Node.js 18.17 or later

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

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

```
pmagent3/
├── src/
│   ├── app/
│   │   ├── components/  # Reusable UI components
│   │   ├── lib/         # Utility functions and helpers
│   │   ├── styles/      # Global styles and CSS modules
│   │   ├── types/       # TypeScript type definitions
│   │   ├── layout.tsx   # Root layout component
│   │   ├── page.tsx     # Home page component
│   │   └── globals.css  # Global CSS
├── public/              # Static assets
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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
