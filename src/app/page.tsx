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
            A modern project management platform for creating strategic plans and standard operating procedures
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Project Planning</h2>
            <p className="mb-6">
              Generate comprehensive project plans with objectives, milestones, resources, and standard operating procedures.
            </p>
            <Link href="/projects" className="mt-auto">
              <Button className="w-full">Create Project Plan</Button>
            </Link>
          </div>

          <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Task Management</h2>
            <p className="mb-6">
              Manage your tasks with our intuitive task management system. Track progress, set priorities, and collaborate with your team.
            </p>
            <Link href="/tasks" className="mt-auto">
              <Button variant="outline" className="w-full">View Tasks</Button>
            </Link>
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
