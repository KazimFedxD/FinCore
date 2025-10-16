import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { APP_CONFIG } from "../config/app";

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden">
      <motion.div
        className="relative z-10 flex flex-col items-center p-10 bg-black/40 backdrop-blur-md rounded-3xl space-y-6 w-full max-w-2xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.h1 
          className="text-5xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Welcome to {APP_CONFIG.name}
        </motion.h1>
        
        {isAuthenticated ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <p className="text-xl text-white/80">
              Hello, {user?.email}!
            </p>
            <p className="text-white/70">
              Manage your finances effortlessly with FinCore.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8">
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="px-4 py-3 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl transition-all shadow-lg"
              >
                📊 Dashboard
              </button>
              <button 
                onClick={() => window.location.href = '/categories'}
                className="px-4 py-3 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl transition-all shadow-lg"
              >
                🏷️ Categories
              </button>
              <button 
                onClick={() => window.location.href = '/incomes'}
                className="px-4 py-3 bg-gradient-to-br from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl transition-all shadow-lg"
              >
                💰 Incomes
              </button>
              <button 
                onClick={() => window.location.href = '/expenses'}
                className="px-4 py-3 bg-gradient-to-br from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl transition-all shadow-lg"
              >
                💳 Expenses
              </button>
              <button 
                onClick={() => window.location.href = '/reports'}
                className="px-4 py-3 bg-gradient-to-br from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white rounded-xl transition-all shadow-lg"
              >
                📈 Reports
              </button>
              <button 
                onClick={() => window.location.href = '/profile'}
                className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all shadow-lg border border-white/20"
              >
                👤 Profile
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <p className="text-xl text-white/80">
              Get started by creating an account or signing in.
            </p>
            <p className="text-white/70">
              This is your customizable homepage. Replace this content with your app's features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button 
                onClick={() => window.location.href = APP_CONFIG.redirects.unauthorized}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors"
              >
                Get Started
              </button>
              <button 
                onClick={() => window.location.href = '/about'}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
              >
                Learn More
              </button>
            </div>
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-white/50 mt-8"
        >
          <p>
            🚀 Built with React, Django, and modern web technologies
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
