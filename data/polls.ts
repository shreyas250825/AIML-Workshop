import { Poll } from '../types';

export const pollsData: Poll[] = [
  {
    id: 'poll-1',
    question: 'Which machine learning framework do you prefer for deep learning projects?',
    options: [
      {
        id: 'poll-1-opt-1',
        text: 'TensorFlow',
        votes: 45
      },
      {
        id: 'poll-1-opt-2',
        text: 'PyTorch',
        votes: 68
      },
      {
        id: 'poll-1-opt-3',
        text: 'Keras',
        votes: 32
      },
      {
        id: 'poll-1-opt-4',
        text: 'JAX',
        votes: 15
      }
    ],
    totalVotes: 160
  },
  {
    id: 'poll-2',
    question: 'What is your biggest challenge when working with AI/ML projects?',
    options: [
      {
        id: 'poll-2-opt-1',
        text: 'Data quality and preprocessing',
        votes: 52
      },
      {
        id: 'poll-2-opt-2',
        text: 'Model selection and tuning',
        votes: 38
      },
      {
        id: 'poll-2-opt-3',
        text: 'Deployment and scaling',
        votes: 41
      },
      {
        id: 'poll-2-opt-4',
        text: 'Interpretability and explainability',
        votes: 29
      }
    ],
    totalVotes: 160
  },
  {
    id: 'poll-3',
    question: 'How would you rate the workshop content so far?',
    options: [
      {
        id: 'poll-3-opt-1',
        text: 'Excellent - Very informative',
        votes: 85
      },
      {
        id: 'poll-3-opt-2',
        text: 'Good - Learned new things',
        votes: 58
      },
      {
        id: 'poll-3-opt-3',
        text: 'Average - Met expectations',
        votes: 12
      },
      {
        id: 'poll-3-opt-4',
        text: 'Needs improvement',
        votes: 5
      }
    ],
    totalVotes: 160
  },
  {
    id: 'poll-4',
    question: 'Which case study topic interests you the most?',
    options: [
      {
        id: 'poll-4-opt-1',
        text: 'Natural Language Processing',
        votes: 48
      },
      {
        id: 'poll-4-opt-2',
        text: 'Computer Vision',
        votes: 42
      },
      {
        id: 'poll-4-opt-3',
        text: 'Time Series Forecasting',
        votes: 35
      },
      {
        id: 'poll-4-opt-4',
        text: 'Recommendation Systems',
        votes: 35
      }
    ],
    totalVotes: 160
  },
  {
    id: 'poll-5',
    question: 'What would you like to see in future workshops?',
    options: [
      {
        id: 'poll-5-opt-1',
        text: 'More hands-on coding exercises',
        votes: 62
      },
      {
        id: 'poll-5-opt-2',
        text: 'Real-world case studies',
        votes: 48
      },
      {
        id: 'poll-5-opt-3',
        text: 'Advanced topics (LLMs, Transformers)',
        votes: 38
      },
      {
        id: 'poll-5-opt-4',
        text: 'MLOps and deployment strategies',
        votes: 12
      }
    ],
    totalVotes: 160
  }
];
