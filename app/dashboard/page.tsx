'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';

const caseStudies = [
  {
    id: 'cs-1',
    title: 'House Price Prediction',
    description: 'Regression Modelling - Build predictive models to estimate house prices based on various features',
    steps: 9
  },
  {
    id: 'cs-2',
    title: 'Credit Risk Classification',
    description: 'Financial Decision Systems - Develop ML models to assess credit risk and make lending decisions',
    steps: 8
  },
  {
    id: 'cs-3',
    title: 'Early Sepsis Risk Prediction',
    description: 'Healthcare ML - Create early warning systems to predict sepsis risk in patients',
    steps: 8
  },
  {
    id: 'cs-4',
    title: 'Stock Trend Classification',
    description: 'Time-Series Modelling - Analyze and predict stock market trends using historical data',
    steps: 8
  },
  {
    id: 'cs-5',
    title: 'Neural Networks for Digital Classification',
    description: 'Deep Learning - Build neural networks to classify handwritten digits and images',
    steps: 8
  },
  {
    id: 'cs-6',
    title: 'Semantic Similarity Modeling',
    description: 'NLP - Develop models to measure semantic similarity between text documents',
    steps: 7
  },
  {
    id: 'cs-7',
    title: 'RAG-based AI Chatbot Development',
    description: 'Retrieval-Augmented Generation - Build intelligent chatbots using RAG architecture',
    steps: 8
  }
];

function DashboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                AI Workshop Platform
              </h1>
              <p className="text-sm text-gray-600">
                Welcome, {user?.name}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-purple-600 font-semibold">
                Case Studies
              </Link>
              <Link href="/leaderboard" className="text-gray-600 hover:text-purple-600 transition-colors">
                Leaderboard
              </Link>
              <Link href="/quiz" className="text-gray-600 hover:text-purple-600 transition-colors">
                Quiz
              </Link>
              <Link href="/doubts" className="text-gray-600 hover:text-purple-600 transition-colors">
                Doubts
              </Link>
              <Link href="/materials" className="text-gray-600 hover:text-purple-600 transition-colors">
                Materials
              </Link>
              <Link href="/passwords" className="text-gray-600 hover:text-purple-600 transition-colors">
                Passwords
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            AI/ML Workshop Case Studies
          </h2>
          <p className="text-gray-600 mb-4">
            This workshop is designed to provide practical exposure to Artificial Intelligence, Machine Learning, and Deep Learning through carefully curated real-world case studies.
          </p>
          
          {/* Topics Covered */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-purple-900 mb-3">
              Topics Covered:
            </h3>
            <ul className="grid md:grid-cols-2 gap-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>House Price Prediction (Regression Modelling)</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>Credit Risk Classification (Financial Decision Systems)</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>Early Sepsis Risk Prediction (Healthcare ML)</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>Stock Trend Classification (Time-Series Modelling)</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>Neural Networks for Digital Classification</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>Semantic Similarity Modeling</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>RAG-based AI Chatbot Development</span>
              </li>
            </ul>
          </div>

          {/* Case Study Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseStudies.map((cs, index) => (
              <motion.div
                key={cs.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)' }}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:border-purple-400 transition-all cursor-pointer"
              >
                <Link href={`/case-study/${cs.id}`}>
                  <div className="text-purple-600 text-sm font-semibold mb-2">
                    Case Study {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {cs.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {cs.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-600 font-medium">
                      {cs.steps} steps
                    </span>
                    <span className="text-purple-600">→</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
