import { Material } from '../types';

export const materialsData: Material[] = [
  // Case Study 1 - House Price Prediction (3 datasets)
  {
    id: 'material-1',
    title: 'CaseStudy1_Dataset.csv',
    type: 'dataset',
    fileUrl: '/materials/CaseStudy1_Dataset.csv',
    description: 'Dataset for House Price Prediction (Regression Modelling)',
    caseStudy: 'House Price Prediction (Regression Modelling)'
  },
  {
    id: 'material-2',
    title: 'RCaseStudy1_Dataset.csv',
    type: 'dataset',
    fileUrl: '/materials/RCaseStudy1_Dataset.csv',
    description: 'Real dataset for House Price Prediction (Regression Modelling)',
    caseStudy: 'House Price Prediction (Regression Modelling)'
  },
  {
    id: 'material-3',
    title: 'PSCaseStudy1_Dataset.csv',
    type: 'dataset',
    fileUrl: '/materials/PSCaseStudy1_Dataset.csv',
    description: 'Polynomial dataset for House Price Prediction (Regression Modelling)',
    caseStudy: 'House Price Prediction (Regression Modelling)'
  },
  
  // Case Study 2 - Credit Risk Classification (2 datasets + model files + app)
  {
    id: 'material-4',
    title: 'CaseStudy2_Dataset.csv',
    type: 'dataset',
    fileUrl: '/materials/CaseStudy2_Dataset.csv',
    description: 'Dataset for Credit Risk Classification (Financial Decision Systems)',
    caseStudy: 'Credit Risk Classification (Financial Decision Systems)'
  },
  {
    id: 'material-5',
    title: 'RCaseStudy2_Dataset.csv',
    type: 'dataset',
    fileUrl: '/materials/RCaseStudy2_Dataset.csv',
    description: 'Real dataset for Credit Risk Classification (Financial Decision Systems)',
    caseStudy: 'Credit Risk Classification (Financial Decision Systems)'
  },
  {
    id: 'material-5a',
    title: 'creditapp.py',
    type: 'code',
    fileUrl: '/materials/creditapp.py',
    description: 'Python application for Credit Risk Classification',
    caseStudy: 'Credit Risk Classification (Financial Decision Systems)'
  },
  {
    id: 'material-5b',
    title: 'credit_model.pkl',
    type: 'model',
    fileUrl: '/materials/credit_model.pkl',
    description: 'Trained model for Credit Risk Classification',
    caseStudy: 'Credit Risk Classification (Financial Decision Systems)'
  },
  {
    id: 'material-5c',
    title: 'scaler.pkl',
    type: 'model',
    fileUrl: '/materials/scaler.pkl',
    description: 'Scaler for Credit Risk Classification model',
    caseStudy: 'Credit Risk Classification (Financial Decision Systems)'
  },
  
  // Case Study 3 - Early Sepsis Risk Prediction (1 dataset)
  {
    id: 'material-6',
    title: 'CaseStudy3_Dataset.csv',
    type: 'dataset',
    fileUrl: '/materials/CaseStudy3_Dataset.csv',
    description: 'Dataset for Early Sepsis Risk Prediction (Healthcare ML)',
    caseStudy: 'Early Sepsis Risk Prediction (Healthcare ML)'
  },
  
  // Case Study 4 - Stock Trend Classification (1 dataset)
  {
    id: 'material-7',
    title: 'stock_backup.csv',
    type: 'dataset',
    fileUrl: '/materials/stock_backup.csv',
    description: 'Dataset for Stock Trend Classification (Time-Series Modelling)',
    caseStudy: 'Stock Trend Classification (Time-Series Modelling)'
  },
  
  // Case Study 5 - Neural Networks for Digital Classification (model files + app)
  {
    id: 'material-8',
    title: 'digitapp.py',
    type: 'code',
    fileUrl: '/materials/digitapp.py',
    description: 'Python application for Neural Networks for Digital Classification',
    caseStudy: 'Neural Networks for Digital Classification'
  },
  {
    id: 'material-9',
    title: 'mnist_model.h5',
    type: 'model',
    fileUrl: '/materials/mnist_model.h5',
    description: 'Trained MNIST model for Digital Classification',
    caseStudy: 'Neural Networks for Digital Classification'
  },
  
  // Shared requirements file for Case Study 2 and 5
  {
    id: 'material-10',
    title: 'requirements.txt',
    type: 'code',
    fileUrl: '/materials/requirements.txt',
    description: 'Python dependencies for Case Study 2 (Credit Risk) and Case Study 5 (Digital Classification)',
    caseStudy: 'Credit Risk Classification & Neural Networks'
  },
  
  // Case Study 7 - RAG-based AI Chatbot Development
  {
    id: 'material-11',
    title: 'chatbot.html',
    type: 'code',
    fileUrl: '/materials/chatbot.html',
    description: 'HTML interface for RAG-based AI Chatbot',
    caseStudy: 'RAG-based AI Chatbot Development'
  }
];
