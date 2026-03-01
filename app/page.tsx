'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

export default function IntroPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // Wait for auth to load
    if (loading) return;

    // Check if user is already authenticated
    if (user) {
      setShouldRedirect(true);
      const destination = user.role === 'admin' ? '/admin/dashboard' : '/dashboard';
      router.replace(destination);
      return;
    }

    // Auto-transition to login after 7 seconds for non-authenticated users
    const timer = setTimeout(() => {
      handleTransition();
    }, 7000);

    return () => clearTimeout(timer);
  }, [user, loading, router]);

  const handleTransition = () => {
    if (shouldRedirect) return; // Prevent double transition
    setIsTransitioning(true);
    setTimeout(() => {
      router.push('/login');
    }, 800);
  };

  // Don't render intro if redirecting
  if (shouldRedirect) {
    return null;
  }

  const caseStudies = [
    'House Price Prediction',
    'Credit Risk Classification',
    'Early Sepsis Risk Prediction',
    'Stock Trend Classification',
    'Neural Networks for Digital Classification',
    'Semantic Similarity Modeling',
    'RAG-based AI Chatbot Development'
  ];

  const labelPositions = [
    { top: '15%', left: '20%' },
    { top: '25%', right: '15%' },
    { top: '45%', left: '10%' },
    { top: '45%', right: '10%' },
    { bottom: '25%', left: '18%' },
    { bottom: '25%', right: '18%' },
    { bottom: '15%', left: '50%', transform: 'translateX(-50%)' }
  ];

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isTransitioning ? 0 : 1 }}
      transition={{ duration: 0.8 }}
      className="relative w-full h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isTransitioning ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-white z-50 pointer-events-none"
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{
            rotateX: 360,
            rotateY: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="w-32 h-32 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-3xl shadow-2xl"
        />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {caseStudies.map((title, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 + index * 0.15 }}
            style={labelPositions[index]}
            className="absolute"
          >
            <div className="bg-white/10 backdrop-blur-md border border-purple-400/30 rounded-lg px-4 py-2 shadow-lg">
              <div className="text-purple-300 text-xs font-semibold mb-1">
                Case Study {index + 1}
              </div>
              <div className="text-white text-sm font-medium max-w-[180px] truncate">
                {title}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleTransition}
        className="absolute bottom-8 right-8 px-6 py-3 bg-white/10 backdrop-blur-md border border-purple-400/50 rounded-lg text-white font-semibold shadow-lg hover:bg-purple-600/30 transition-all"
      >
        Skip Intro →
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-8 left-0 right-0 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          AI Workshop Platform
        </h1>
        <p className="text-lg text-purple-300 mt-2">
          Interactive AI/ML Learning Experience
        </p>
      </motion.div>
    </motion.div>
  );
}
