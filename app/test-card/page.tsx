'use client';

import CaseStudyCard from '../../components/CaseStudyCard';
import { caseStudies } from '../../data/caseStudies';

/**
 * Test page for CaseStudyCard component
 * Displays all case study cards in a responsive grid
 */
export default function TestCardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Case Study Cards Test
        </h1>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseStudies.map((caseStudy) => (
            <CaseStudyCard key={caseStudy.id} caseStudy={caseStudy} />
          ))}
        </div>

        {/* Responsive Breakpoint Indicators */}
        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-2">Current Breakpoint:</h2>
          <div className="flex gap-4">
            <span className="md:hidden text-blue-600 font-medium">Mobile (1 column)</span>
            <span className="hidden md:block lg:hidden text-blue-600 font-medium">Tablet (2 columns)</span>
            <span className="hidden lg:block text-blue-600 font-medium">Desktop (3 columns)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
