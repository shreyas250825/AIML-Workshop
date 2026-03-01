# CaseStudyCard Component

## Overview

The `CaseStudyCard` component is a reusable card component that displays case study information with interactive hover animations. It's designed to be used on the dashboard to showcase all available case studies.

## Features

- **Hover Animations**: Smooth scale and shadow effects using Framer Motion
- **Click Navigation**: Navigates to the case study detail page when clicked
- **Responsive Design**: Adapts to mobile, tablet, and desktop screen sizes
- **Visual Feedback**: Animated arrow indicator on hover
- **Step Count Badge**: Displays the number of steps in the case study

## Requirements Satisfied

- **3.2**: Displays case study title and description
- **3.3**: Provides visual feedback on hover
- **4.1**: Click handler navigates to case study detail page
- **13.1**: Responsive layout for mobile devices
- **13.2**: Responsive layout for tablet devices
- **13.3**: Responsive layout for desktop devices

## Usage

```tsx
import CaseStudyCard from '@/components/CaseStudyCard';
import { caseStudies } from '@/data/caseStudies';

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {caseStudies.map((caseStudy) => (
        <CaseStudyCard key={caseStudy.id} caseStudy={caseStudy} />
      ))}
    </div>
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `caseStudy` | `CaseStudy` | Yes | The case study object containing id, title, description, and steps |

## Responsive Behavior

- **Mobile (< 768px)**: Cards stack vertically in a single column
- **Tablet (768px - 1023px)**: Cards display in a 2-column grid
- **Desktop (≥ 1024px)**: Cards display in a 3-column grid

## Animation Details

### Hover Effects
- **Scale**: Increases to 103% of original size
- **Shadow**: Adds a subtle shadow (0 10px 30px rgba(0, 0, 0, 0.15))
- **Duration**: 200ms with easeOut easing
- **Arrow Indicator**: Slides 5px to the right

### Tap Effect
- **Scale**: Reduces to 98% of original size for tactile feedback

## Styling

The component uses Tailwind CSS for styling with the following key classes:

- `bg-white`: White background for clean professional look
- `border border-gray-200`: Subtle border
- `rounded-lg`: Rounded corners
- `p-6`: Consistent padding
- `cursor-pointer`: Indicates clickable element

## Testing

A test page is available at `/test-card` to verify the component's functionality and responsive behavior across different screen sizes.

## Dependencies

- `framer-motion`: For smooth animations
- `next/navigation`: For client-side routing
- `../types`: For TypeScript type definitions

## Accessibility

- Clickable area covers the entire card for easy interaction
- Touch-friendly on mobile devices (minimum 44x44px touch target)
- Semantic HTML structure with proper heading hierarchy
- Visual feedback on hover and tap for better UX

## Future Enhancements

Potential improvements for future iterations:

- Add keyboard navigation support (Enter key to activate)
- Add ARIA labels for screen readers
- Add loading skeleton for async data
- Add favorite/bookmark functionality
- Add progress indicator showing completed steps
