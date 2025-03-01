import { Button } from "@/app/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <main className="flex flex-col items-center gap-8 max-w-4xl mx-auto">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl font-bold text-center">
            Welcome to PmAgent3
          </h1>
          <p className="text-xl text-center text-gray-600 dark:text-gray-400">
            A modern Next.js application with App Router, TypeScript, and Tailwind CSS
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Features</h2>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Next.js App Router
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> TypeScript
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Tailwind CSS
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> shadcn/ui Components
              </li>
            </ul>
            <Button className="mt-auto">Learn More</Button>
          </div>

          <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <p className="mb-6">
              Edit <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">src/app/page.tsx</code> to get started with your project.
            </p>
            <div className="flex gap-4 mt-auto">
              <Button variant="outline">Documentation</Button>
              <Link href="/tasks">
                <Button>View Tasks</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Built with Next.js, TypeScript, and Tailwind CSS
          </p>
        </div>
      </main>
    </div>
  );
}
