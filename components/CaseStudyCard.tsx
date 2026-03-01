'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CaseStudy } from '../types';

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
}

/**
 * CaseStudyCard Component
 * 
 * A reusable card component that displays case study information with hover animations.
 * Clicking the card navigates to the case study detail page.
 * 
 * Features:
 * - Hover animations with scale and shadow effects (Framer Motion)
 * - Click handler for navigation
 * - Responsive design for mobile, tablet, and desktop
 * 
 * Requirements: 3.2, 3.3, 4.1, 13.1, 13.2, 13.3
 */
export default function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/case-study/${caseStudy.id}`);
  };

  return (
    <motion.div
      onClick={handleClick}
      className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer overflow-hidden"
      whileHover={{
        scale: 1.03,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        duration: 0.2,
        ease: 'easeOut',
      }}
    >
      {/* Card Content */}
      <div className="space-y-3">
        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
          {caseStudy.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-3">
          {caseStudy.description}
        </p>

        {/* Step Count Badge */}
        <div className="flex items-center gap-2 pt-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {caseStudy.steps.length} Steps
          </span>
        </div>
      </div>

      {/* Hover Indicator */}
      <motion.div
        className="mt-4 flex items-center text-blue-600 text-sm font-medium"
        initial={{ x: 0 }}
        whileHover={{ x: 5 }}
        transition={{ duration: 0.2 }}
      >
        <span>View Case Study</span>
        <svg
          className="w-4 h-4 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
