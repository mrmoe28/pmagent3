import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div 
          className="flex flex-col items-center text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div 
            className="w-20 h-20 bg-orange-500 rounded-2xl mb-6 flex items-center justify-center shadow-lg"
            variants={fadeIn}
          >
            <span className="text-white text-3xl font-bold">P3</span>
          </motion.div>
          
          <motion.h1 
            className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600"
            variants={fadeIn}
          >
            Welcome to PmAgent3
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl"
            variants={fadeIn}
          >
            A modern project management platform for creating strategic plans and standard operating procedures
          </motion.p>
          
          <motion.div 
            className="mt-8"
            variants={fadeIn}
          >
            <Link href="/projects">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-lg shadow-md hover:shadow-lg transition-all">
                Get Started
              </Button>
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Features Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            variants={fadeIn}
            whileHover={{ y: -5 }}
          >
            <div className="h-2 bg-orange-500"></div>
            <div className="p-8">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Project Planning</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Generate comprehensive project plans with objectives, milestones, resources, and standard operating procedures.
              </p>
              <Link href="/projects">
                <Button className="w-full bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white">
                  Create Project Plan
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            variants={fadeIn}
            whileHover={{ y: -5 }}
          >
            <div className="h-2 bg-orange-500"></div>
            <div className="p-8">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M15 13l-3 3m0 0l-3-3m3 3V8" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Task Management</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Manage your tasks with our intuitive task management system. Track progress, set priorities, and collaborate with your team.
              </p>
              <Link href="/tasks">
                <Button variant="outline" className="w-full border-gray-200 dark:border-gray-700">
                  View Tasks
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Technologies Section */}
        <div className="mt-24 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Built with modern technologies
          </p>
          <div className="flex justify-center space-x-6 opacity-70">
            <span className="text-gray-400">Next.js</span>
            <span className="text-gray-400">TypeScript</span>
            <span className="text-gray-400">Tailwind CSS</span>
            <span className="text-gray-400">Claude API</span>
            <span className="text-gray-400">Perplexity API</span>
          </div>
        </div>
      </main>
    </div>
  );
}
