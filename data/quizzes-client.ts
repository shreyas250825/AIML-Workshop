export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
}

export interface Quiz {
  id: string;
  title: string;
  date: string;
  questions: QuizQuestion[];
}

export const quizzes: Quiz[] = [
  {
    id: 'march-3',
    title: 'Day 1 Quiz',
    date: 'March 3, 2026',
    questions: [
      {
        id: 1,
        question: '1. A company wants to predict house prices based on area and number of rooms. Which type of problem is this?',
        options: ['Classification', 'Regression', 'Clustering', 'Reinforcement Learning']
      },
      {
        id: 2,
        question: '2. In healthcare ML, which technique helps reduce overfitting in small datasets?',
        options: ['Regularization', 'Increasing epochs infinitely', 'Removing validation set', 'Ignoring noise']
      },
      {
        id: 3,
        question: '3. In medical datasets with fewer positive cases, accuracy alone can be misleading because:',
        options: ['Dataset is small', 'Model trains slowly', 'Model may ignore minority class', 'GPU is weak']
      },
      {
        id: 4,
        question: '4. In time-series data like stock prices, data should:',
        options: ['Be shuffled randomly', 'Maintain time order', 'Remove timestamps', 'Be converted to images']
      },
      {
        id: 5,
        question: '5. In credit risk prediction, a False Negative means:',
        options: ['Risky customer predicted safe', 'Safe customer predicted risky', 'Customer data missing', 'Loan rejected']
      },
      {
        id: 6,
        question: '6. A bank wants to decide whether to approve a loan or not. This is:',
        options: ['Regression', 'Classification', 'Clustering', 'Forecasting']
      },
      {
        id: 7,
        question: '7. If a model predicts stock will go UP or DOWN tomorrow, it is:',
        options: ['Regression', 'Classification', 'Image processing', 'Clustering']
      },
      {
        id: 8,
        question: '8. A bank can use machine learning to:',
        options: ['Approve or reject loans', 'Detect fraud', 'Predict customer default', 'All of the above']
      },
      {
        id: 9,
        question: '9. Which metric is commonly used to measure error in regression?',
        options: ['Accuracy', 'Mean Squared Error', 'Precision', 'Recall']
      },
      {
        id: 10,
        question: '10. In stock prediction systems, we may consider:',
        options: ['Past prices', 'Market trends', 'Volume', 'All of the above']
      },
      {
        id: 11,
        question: '11. A hospital wants to detect whether a patient is at risk of sepsis. The output is high-risk or low-risk. Which type of model is suitable?',
        options: ['Regression', 'Classification', 'Clustering', 'Dimensionality Reduction']
      },
      {
        id: 12,
        question: '12. In loan prediction, predicting a risky customer as safe can cause:',
        options: ['Profit increase', 'Financial loss', 'Faster training', 'Better accuracy']
      },
      {
        id: 13,
        question: '13. Predicting the exact temperature tomorrow is:',
        options: ['Classification', 'Regression', 'Clustering', 'Ranking']
      },
      {
        id: 14,
        question: '14. Which algorithm is commonly used for simple prediction of continuous values?',
        options: ['Linear Regression', 'K-Means', 'Decision Tree (only classification)', 'Sorting']
      },
      {
        id: 15,
        question: '15. Why should stock data be used in time order while training?',
        options: ['Future depends on past', 'To increase speed', 'To reduce memory', 'To remove errors']
      }
    ]
  },
  {
    id: 'march-4',
    title: 'Day 2 Quiz',
    date: 'March 4, 2026',
    questions: [
      {
        id: 1,
        question: '1. A bank wants to build a system that can automatically read handwritten digits on cheques (amount box). The system should recognize digits from 0–9 based on image input. The bank will train the model using thousands of digit images. Answer the following question: Neural networks are mainly inspired by:',
        options: ['Computer hardware', 'Human brain', 'Database systems', 'Internet']
      },
      {
        id: 2,
        question: '2. A bank wants to build a system that can automatically read handwritten digits on cheques (amount box). The system should recognize digits from 0–9 based on image input. The bank will train the model using thousands of digit images. Answer the following question: If the model performs very well on training images but poorly on new cheque images, this is called:',
        options: ['Underfitting', 'Overfitting', 'Sorting', 'Scaling']
      },
      {
        id: 3,
        question: '3. A bank wants to build a system that can automatically read handwritten digits on cheques (amount box). The system should recognize digits from 0–9 based on image input. The bank will train the model using thousands of digit images. Answer the following question: In digit recognition, the model learns patterns from:',
        options: ['Pixel values of images', 'Audio signals', 'Salary data', 'Stock prices']
      },
      {
        id: 4,
        question: '4. Converting a sentence into numbers for ML is called:',
        options: ['Scaling', 'Encoding', 'Embedding', 'Sorting']
      },
      {
        id: 5,
        question: '5. Softmax is mainly used when we have:',
        options: ['Many output classes', 'One continuous output', 'No output', 'Images only']
      },
      {
        id: 6,
        question: '6. Since the system predicts one digit out of 10 possible digits, this is:',
        options: ['Binary classification', 'Multi-class classification', 'Regression', 'Clustering']
      },
      {
        id: 7,
        question: '7. In digit recognition, the model learns patterns from:',
        options: ['Pixel values of images', 'Audio signals', 'Salary data', 'Stock prices']
      },
      {
        id: 8,
        question: '8. Digit recognition used in postal code reading or bank cheque reading is an example of:',
        options: ['Real-world AI application', 'Sorting only', 'Clustering only', 'Manual processing']
      },
      {
        id: 9,
        question: '9. A good metric to measure how well the digit recognition system works is:',
        options: ['Accuracy', 'Temperature', 'Salary', 'Height']
      },
      {
        id: 10,
        question: '10. Activation functions help neural networks to:',
        options: ['Store data', 'Learn complex patterns', 'Remove features', 'Reduce dataset']
      },
      {
        id: 11,
        question: '11. If a system classifies emails as Spam, Promotion, or Important, it is:',
        options: ['Regression', 'Binary classification', 'Multi-class classification', 'Clustering']
      },
      {
        id: 12,
        question: '12. An e-commerce company wants to automatically classify products into categories like Electronics, Clothing, Books, and Furniture. Answer the following question: If the model incorrectly labels Electronics as Clothing, this is:',
        options: ['Correct prediction', 'Misclassification', 'Scaling', 'Clustering']
      },
      {
        id: 13,
        question: '13. An e-commerce company wants to automatically classify products into categories like Electronics, Clothing, Books, and Furniture. Answer the following question: If the company adds more product examples for training, performance will likely:',
        options: ['Improve', 'Decrease automatically', 'Stop working', 'Become random']
      },
      {
        id: 14,
        question: '14. Embeddings help AI understand:',
        options: ['Only grammar', 'Meaning of words', 'File size', 'Hardware speed']
      },
      {
        id: 15,
        question: '15. If a chatbot gives wrong answers due to bad document retrieval, the problem is in:',
        options: ['Frontend', 'Retriever', 'Monitor', 'CSS']
      }
    ]
  }
];
