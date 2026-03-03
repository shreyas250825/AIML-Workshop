import { CaseStudy } from '../types';

export const caseStudies: CaseStudy[] = [
  {
    id: 'cs-1',
    title: 'Customer Churn Prediction',
    description: 'Build a machine learning model to predict customer churn in a telecom company',
    problemStatement: 'A telecom company is experiencing high customer churn rates. Your task is to analyze customer data and build a predictive model that identifies customers likely to churn, enabling proactive retention strategies.',
    whyItMatters: 'Customer retention is 5-25x cheaper than acquisition. Predicting churn allows companies to intervene early with targeted offers, improving customer lifetime value and reducing revenue loss.',
    datasetUrl: '/datasets/telecom-churn.csv',
    steps: [
      {
        id: 'cs-1-step-1',
        title: 'Data Exploration and Preprocessing',
        password: 'explore123',
        codeContent: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Load the dataset
df = pd.read_csv('telecom-churn.csv')

# Display basic information
print(df.info())
print(df.describe())

# Check for missing values
print(df.isnull().sum())

# Visualize churn distribution
sns.countplot(x='Churn', data=df)
plt.title('Customer Churn Distribution')
plt.show()`,
        language: 'python'
      },
      {
        id: 'cs-1-step-2',
        title: 'Feature Engineering',
        password: 'features456',
        codeContent: `from sklearn.preprocessing import LabelEncoder, StandardScaler

# Encode categorical variables
le = LabelEncoder()
categorical_cols = ['gender', 'Partner', 'Dependents', 'PhoneService', 'InternetService']

for col in categorical_cols:
    df[col] = le.fit_transform(df[col])

# Create new features
df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
df['AvgMonthlyCharges'] = df['TotalCharges'] / df['tenure']

# Scale numerical features
scaler = StandardScaler()
numerical_cols = ['tenure', 'MonthlyCharges', 'TotalCharges']
df[numerical_cols] = scaler.fit_transform(df[numerical_cols])`,
        language: 'python'
      },

      {
        id: 'cs-1-step-3',
        title: 'Model Training and Evaluation',
        password: 'model789',
        codeContent: `from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score

# Split data
X = df.drop('Churn', axis=1)
y = df['Churn']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

# Evaluate
y_pred = rf_model.predict(X_test)
print(classification_report(y_test, y_pred))
print(f'ROC-AUC Score: {roc_auc_score(y_test, y_pred):.4f}')`,
        language: 'python'
      }
    ]
  },
  {
    id: 'cs-2',
    title: 'Sentiment Analysis for Product Reviews',
    description: 'Develop an NLP model to classify customer sentiment from product reviews',
    problemStatement: 'An e-commerce platform receives thousands of product reviews daily. Build a sentiment analysis system that automatically classifies reviews as positive, negative, or neutral to help prioritize customer service responses.',
    whyItMatters: 'Automated sentiment analysis enables businesses to quickly identify dissatisfied customers, monitor brand reputation, and extract actionable insights from large volumes of unstructured text data.',
    datasetUrl: '/datasets/product-reviews.csv',
    steps: [
      {
        id: 'cs-2-step-1',
        title: 'Text Preprocessing',
        password: 'nlp123',
        codeContent: `import pandas as pd
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

nltk.download('stopwords')
nltk.download('punkt')

# Load data
df = pd.read_csv('product-reviews.csv')

# Text cleaning function
def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z\\s]', '', text)
    tokens = word_tokenize(text)
    tokens = [word for word in tokens if word not in stopwords.words('english')]
    return ' '.join(tokens)

df['cleaned_review'] = df['review_text'].apply(clean_text)`,
        language: 'python'
      },
      {
        id: 'cs-2-step-2',
        title: 'Feature Extraction with TF-IDF',
        password: 'tfidf456',
        codeContent: `from sklearn.feature_extraction.text import TfidfVectorizer

# Create TF-IDF features
tfidf = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))
X = tfidf.fit_transform(df['cleaned_review'])
y = df['sentiment']

print(f'Feature matrix shape: {X.shape}')
print(f'Vocabulary size: {len(tfidf.vocabulary_)}')`,
        language: 'python'
      },
      {
        id: 'cs-2-step-3',
        title: 'Model Training with Logistic Regression',
        password: 'sentiment789',
        codeContent: `from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
lr_model = LogisticRegression(max_iter=1000)
lr_model.fit(X_train, y_train)

# Evaluate
y_pred = lr_model.predict(X_test)
print(f'Accuracy: {accuracy_score(y_test, y_pred):.4f}')
print(classification_report(y_test, y_pred))`,
        language: 'python'
      }
    ]
  },

  {
    id: 'cs-3',
    title: 'Image Classification with CNNs',
    description: 'Build a convolutional neural network to classify images into categories',
    problemStatement: 'Create a deep learning model that can accurately classify images from a dataset of 10 different categories. The model should achieve high accuracy while being efficient enough for real-time inference.',
    whyItMatters: 'Image classification is fundamental to computer vision applications including autonomous vehicles, medical diagnosis, quality control in manufacturing, and content moderation on social platforms.',
    datasetUrl: '/datasets/image-dataset.zip',
    steps: [
      {
        id: 'cs-3-step-1',
        title: 'Data Loading and Augmentation',
        password: 'cnn123',
        codeContent: `import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# Data augmentation
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    horizontal_flip=True,
    validation_split=0.2
)

# Load training data
train_generator = train_datagen.flow_from_directory(
    'image-dataset/train',
    target_size=(224, 224),
    batch_size=32,
    class_mode='categorical',
    subset='training'
)

validation_generator = train_datagen.flow_from_directory(
    'image-dataset/train',
    target_size=(224, 224),
    batch_size=32,
    class_mode='categorical',
    subset='validation'
)`,
        language: 'python'
      },
      {
        id: 'cs-3-step-2',
        title: 'Build CNN Architecture',
        password: 'architecture456',
        codeContent: `from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout

# Build model
model = Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
    MaxPooling2D(2, 2),
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D(2, 2),
    Conv2D(128, (3, 3), activation='relu'),
    MaxPooling2D(2, 2),
    Flatten(),
    Dense(512, activation='relu'),
    Dropout(0.5),
    Dense(10, activation='softmax')
])

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
model.summary()`,
        language: 'python'
      },
      {
        id: 'cs-3-step-3',
        title: 'Train and Evaluate Model',
        password: 'train789',
        codeContent: `# Train model
history = model.fit(
    train_generator,
    epochs=20,
    validation_data=validation_generator
)

# Plot training history
import matplotlib.pyplot as plt

plt.figure(figsize=(12, 4))
plt.subplot(1, 2, 1)
plt.plot(history.history['accuracy'], label='Training Accuracy')
plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
plt.legend()
plt.title('Model Accuracy')

plt.subplot(1, 2, 2)
plt.plot(history.history['loss'], label='Training Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')
plt.legend()
plt.title('Model Loss')
plt.show()`,
        language: 'python'
      }
    ]
  },

  {
    id: 'cs-4',
    title: 'Time Series Forecasting',
    description: 'Predict future sales using historical time series data',
    problemStatement: 'A retail company needs to forecast product demand for the next quarter to optimize inventory management. Build a time series forecasting model using historical sales data to predict future trends.',
    whyItMatters: 'Accurate demand forecasting reduces inventory costs, prevents stockouts, improves supply chain efficiency, and enables data-driven business planning.',
    datasetUrl: '/datasets/sales-timeseries.csv',
    steps: [
      {
        id: 'cs-4-step-1',
        title: 'Time Series Analysis',
        password: 'timeseries123',
        codeContent: `import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.seasonal import seasonal_decompose

# Load data
df = pd.read_csv('sales-timeseries.csv', parse_dates=['date'], index_col='date')

# Visualize time series
plt.figure(figsize=(12, 6))
plt.plot(df['sales'])
plt.title('Sales Over Time')
plt.xlabel('Date')
plt.ylabel('Sales')
plt.show()

# Decompose time series
decomposition = seasonal_decompose(df['sales'], model='multiplicative', period=12)
decomposition.plot()
plt.show()`,
        language: 'python'
      },
      {
        id: 'cs-4-step-2',
        title: 'ARIMA Model Implementation',
        password: 'arima456',
        codeContent: `from statsmodels.tsa.arima.model import ARIMA
from sklearn.metrics import mean_squared_error
import numpy as np

# Split data
train_size = int(len(df) * 0.8)
train, test = df[:train_size], df[train_size:]

# Fit ARIMA model
model = ARIMA(train['sales'], order=(1, 1, 1))
fitted_model = model.fit()

# Make predictions
predictions = fitted_model.forecast(steps=len(test))

# Calculate RMSE
rmse = np.sqrt(mean_squared_error(test['sales'], predictions))
print(f'RMSE: {rmse:.2f}')`,
        language: 'python'
      },
      {
        id: 'cs-4-step-3',
        title: 'LSTM Neural Network Approach',
        password: 'lstm789',
        codeContent: `import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from sklearn.preprocessing import MinMaxScaler

# Scale data
scaler = MinMaxScaler()
scaled_data = scaler.fit_transform(df[['sales']])

# Create sequences
def create_sequences(data, seq_length=60):
    X, y = [], []
    for i in range(seq_length, len(data)):
        X.append(data[i-seq_length:i, 0])
        y.append(data[i, 0])
    return np.array(X), np.array(y)

X, y = create_sequences(scaled_data)
X = X.reshape(X.shape[0], X.shape[1], 1)

# Build LSTM model
model = Sequential([
    LSTM(50, return_sequences=True, input_shape=(X.shape[1], 1)),
    LSTM(50),
    Dense(1)
])

model.compile(optimizer='adam', loss='mse')
model.fit(X, y, epochs=20, batch_size=32, validation_split=0.2)`,
        language: 'python'
      }
    ]
  },

  {
    id: 'cs-5',
    title: 'Recommendation System',
    description: 'Build a collaborative filtering recommendation engine',
    problemStatement: 'Design a recommendation system for a streaming platform that suggests content to users based on their viewing history and preferences of similar users.',
    whyItMatters: 'Personalized recommendations increase user engagement, improve content discovery, and drive revenue growth. Netflix attributes 80% of watched content to its recommendation algorithm.',
    datasetUrl: '/datasets/user-ratings.csv',
    steps: [
      {
        id: 'cs-5-step-1',
        title: 'Data Preparation and EDA',
        password: 'recsys123',
        codeContent: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Load data
ratings = pd.read_csv('user-ratings.csv')

# Explore data
print(f'Total ratings: {len(ratings)}')
print(f'Unique users: {ratings["user_id"].nunique()}')
print(f'Unique items: {ratings["item_id"].nunique()}')

# Rating distribution
plt.hist(ratings['rating'], bins=10)
plt.title('Rating Distribution')
plt.xlabel('Rating')
plt.ylabel('Frequency')
plt.show()`,
        language: 'python'
      },
      {
        id: 'cs-5-step-2',
        title: 'Matrix Factorization with SVD',
        password: 'svd456',
        codeContent: `from scipy.sparse.linalg import svds
from sklearn.metrics import mean_squared_error

# Create user-item matrix
user_item_matrix = ratings.pivot(index='user_id', columns='item_id', values='rating').fillna(0)

# Apply SVD
U, sigma, Vt = svds(user_item_matrix.values, k=50)
sigma = np.diag(sigma)

# Reconstruct matrix
predicted_ratings = np.dot(np.dot(U, sigma), Vt)

# Calculate RMSE
rmse = np.sqrt(mean_squared_error(user_item_matrix.values.flatten(), predicted_ratings.flatten()))
print(f'RMSE: {rmse:.4f}')`,
        language: 'python'
      },
      {
        id: 'cs-5-step-3',
        title: 'Generate Recommendations',
        password: 'recommend789',
        codeContent: `def get_recommendations(user_id, num_recommendations=10):
    user_idx = user_id - 1
    user_ratings = predicted_ratings[user_idx, :]
    
    # Get items not yet rated by user
    rated_items = user_item_matrix.iloc[user_idx] > 0
    unrated_items = ~rated_items
    
    # Get top recommendations
    recommendations = np.argsort(user_ratings[unrated_items])[-num_recommendations:][::-1]
    recommended_items = user_item_matrix.columns[unrated_items][recommendations]
    
    return recommended_items

# Example: Get recommendations for user 1
recommendations = get_recommendations(user_id=1, num_recommendations=10)
print(f'Top 10 recommendations for User 1:')
print(recommendations)`,
        language: 'python'
      }
    ]
  },

  {
    id: 'cs-6',
    title: 'Fraud Detection System',
    description: 'Detect fraudulent transactions using anomaly detection techniques',
    problemStatement: 'A financial institution needs to identify fraudulent credit card transactions in real-time. Build a machine learning model that can detect anomalous patterns indicating potential fraud.',
    whyItMatters: 'Credit card fraud costs billions annually. Effective fraud detection protects customers, reduces financial losses, and maintains trust in digital payment systems.',
    datasetUrl: '/datasets/credit-card-transactions.csv',
    steps: [
      {
        id: 'cs-6-step-1',
        title: 'Handle Imbalanced Data',
        password: 'fraud123',
        codeContent: `import pandas as pd
from imblearn.over_sampling import SMOTE
from sklearn.model_selection import train_test_split

# Load data
df = pd.read_csv('credit-card-transactions.csv')

# Check class distribution
print(df['is_fraud'].value_counts())
print(f'Fraud percentage: {df["is_fraud"].mean() * 100:.2f}%')

# Split features and target
X = df.drop('is_fraud', axis=1)
y = df['is_fraud']

# Apply SMOTE to balance classes
smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X, y)

print(f'After SMOTE - Fraud percentage: {y_resampled.mean() * 100:.2f}%')`,
        language: 'python'
      },
      {
        id: 'cs-6-step-2',
        title: 'Isolation Forest for Anomaly Detection',
        password: 'isolation456',
        codeContent: `from sklearn.ensemble import IsolationForest
from sklearn.metrics import classification_report, confusion_matrix

# Train Isolation Forest
iso_forest = IsolationForest(contamination=0.01, random_state=42)
iso_forest.fit(X)

# Predict anomalies (-1 for anomalies, 1 for normal)
predictions = iso_forest.predict(X)
predictions = [1 if x == -1 else 0 for x in predictions]

# Evaluate
print(confusion_matrix(y, predictions))
print(classification_report(y, predictions))`,
        language: 'python'
      },
      {
        id: 'cs-6-step-3',
        title: 'XGBoost Classifier',
        password: 'xgboost789',
        codeContent: `import xgboost as xgb
from sklearn.metrics import roc_auc_score, precision_recall_curve
import matplotlib.pyplot as plt

# Split data
X_train, X_test, y_train, y_test = train_test_split(X_resampled, y_resampled, test_size=0.2, random_state=42)

# Train XGBoost
xgb_model = xgb.XGBClassifier(scale_pos_weight=10, random_state=42)
xgb_model.fit(X_train, y_train)

# Predict probabilities
y_pred_proba = xgb_model.predict_proba(X_test)[:, 1]

# Calculate ROC-AUC
roc_auc = roc_auc_score(y_test, y_pred_proba)
print(f'ROC-AUC Score: {roc_auc:.4f}')

# Plot precision-recall curve
precision, recall, thresholds = precision_recall_curve(y_test, y_pred_proba)
plt.plot(recall, precision)
plt.xlabel('Recall')
plt.ylabel('Precision')
plt.title('Precision-Recall Curve')
plt.show()`,
        language: 'python'
      }
    ]
  },

  {
    id: 'cs-7',
    title: 'RAG-based AI Chatbot Development',
    description: 'Build a Retrieval-Augmented Generation chatbot using embeddings and document retrieval',
    problemStatement: 'Create an intelligent chatbot that can answer questions about specific documents by combining document retrieval with language generation. The system should retrieve relevant context from documents and generate accurate, grounded responses.',
    whyItMatters: 'RAG systems combine the power of large language models with specific domain knowledge, enabling accurate and factual responses. This approach is crucial for building AI assistants that can answer questions about proprietary documents, technical manuals, or specialized knowledge bases.',
    datasetUrl: '/materials/chatbot.html',
    steps: [
      {
        id: 'cs-7-step-1',
        title: 'Install Dependencies and Load PDF',
        password: 'rag123',
        codeContent: `# Install required packages
!pip install sentence-transformers scikit-learn numpy pypdf

# Step 1: Load PDF document
from pypdf import PdfReader

reader = PdfReader("TheMerchantOfVenice.pdf")
text = ""
for page in reader.pages:
    text += page.extract_text()

# Split text into chunks
def chunk_text(text, chunk_size=800, overlap=200):
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start += chunk_size - overlap
    return chunks

documents = chunk_text(text)
print(f"Created {len(documents)} document chunks")
print("Sample chunk:", text[1000:4000])`,
        language: 'python'
      },
      {
        id: 'cs-7-step-2',
        title: 'Create Document Embeddings',
        password: 'embeddings456',
        codeContent: `from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Load embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Create embeddings for all document chunks
doc_embeddings = model.encode(documents)
print("Document embeddings shape:", doc_embeddings.shape)

# Example: Test similarity between documents
similarities = cosine_similarity(doc_embeddings[:5], doc_embeddings[:5])
print("Sample similarity matrix:")
print(similarities)`,
        language: 'python'
      },
      {
        id: 'cs-7-step-3',
        title: 'Implement Document Retrieval',
        password: 'retrieval789',
        codeContent: `# Query the document
query = "Who is Bassanio?"
query_embedding = model.encode([query])

# Calculate similarities with all documents
query_embedding = query_embedding.reshape(1, -1)
similarities = cosine_similarity(query_embedding, doc_embeddings)

# Get top 5 most relevant documents
top_indices = np.argsort(similarities[0])[-5:][::-1]
retrieved_docs = [documents[i] for i in top_indices]

# Combine retrieved documents as context
context = " ".join(retrieved_docs)

print("Most Relevant Documents:")
for i, idx in enumerate(top_indices, 1):
    print(f"{i}. Document {idx} (Similarity: {similarities[0][idx]:.3f})")
    print(documents[idx][:200], "...\\n")`,
        language: 'python'
      },
      {
        id: 'cs-7-step-4',
        title: 'Generate Grounded Response',
        password: 'generate101',
        codeContent: `# Simple response generation using retrieved context
def generate_response(query, retrieved_text):
    return f"Question: {query}\\n\\nAnswer (Grounded): {retrieved_text}"

# Get the most relevant document
retrieved_doc = documents[top_indices[0]]

response = f"Based on retrieved knowledge: {retrieved_doc}"
print("\\nChatbot Response:")
print(response)

# Alternative: More structured response
print("\\n" + "="*50)
print(generate_response(query, retrieved_doc))`,
        language: 'python'
      },
      {
        id: 'cs-7-step-5',
        title: 'Advanced Generation with LLM',
        password: 'advanced202',
        codeContent: `# Optional: Use a language model for better response generation
from transformers import pipeline

# Load text generation model
generator = pipeline("text-generation", model="google/flan-t5-base")

# Create prompt with context
prompt = f"""You are a literature assistant.
Answer the question clearly in 2-3 sentences.
If the answer is not explicitly stated, infer it from context.

Context:
{context}

Question:
{query}

Answer:"""

# Generate response
response = generator(prompt, max_new_tokens=120, do_sample=False)
print("\\nAI-Generated Response:")
print(response[0]['generated_text'])`,
        language: 'python'
      },
      {
        id: 'cs-7-step-6',
        title: 'Build Interactive Chatbot',
        password: 'interface303',
        codeContent: `# Create an interactive chatbot function
def rag_chatbot(query, top_k=5):
    # Encode query
    query_embedding = model.encode([query]).reshape(1, -1)
    
    # Find similar documents
    similarities = cosine_similarity(query_embedding, doc_embeddings)
    top_indices = np.argsort(similarities[0])[-top_k:][::-1]
    
    # Retrieve context
    context = " ".join([documents[i] for i in top_indices])
    
    # Generate response
    response = f"Based on the document:\\n\\n{context[:500]}..."
    return response

# Test the chatbot
test_queries = [
    "Who is Bassanio?",
    "What is the main conflict in the story?",
    "Describe Portia's character"
]

for query in test_queries:
    print(f"\\nQ: {query}")
    print(f"A: {rag_chatbot(query)}")
    print("-" * 80)`,
        language: 'python'
      },
      {
        id: 'cs-7-step-7',
        title: 'Deploy with HTML Interface',
        password: 'deploy404',
        codeContent: `# Save the model and embeddings for deployment
import pickle

# Save embeddings and documents
with open('doc_embeddings.pkl', 'wb') as f:
    pickle.dump(doc_embeddings, f)

with open('documents.pkl', 'wb') as f:
    pickle.dump(documents, f)

print("Model artifacts saved!")
print("\\nNext steps:")
print("1. Download chatbot.html from Materials section")
print("2. Set up a backend API to serve the RAG model")
print("3. Connect the HTML interface to your API")
print("4. Deploy to a web server")`,
        language: 'python'
      },
      {
        id: 'cs-7-step-8',
        title: 'Evaluation and Optimization',
        password: 'optimize505',
        codeContent: `# Evaluate retrieval quality
def evaluate_retrieval(test_queries, expected_docs):
    scores = []
    for query, expected in zip(test_queries, expected_docs):
        query_embedding = model.encode([query]).reshape(1, -1)
        similarities = cosine_similarity(query_embedding, doc_embeddings)
        top_idx = np.argmax(similarities[0])
        
        # Check if expected document is in top results
        score = 1 if top_idx in expected else 0
        scores.append(score)
    
    return np.mean(scores)

# Optimization tips
print("RAG System Optimization Tips:")
print("1. Chunk Size: Experiment with 500-1000 tokens")
print("2. Overlap: Use 10-20% overlap between chunks")
print("3. Top-K: Retrieve 3-5 most relevant documents")
print("4. Embedding Model: Try different models for your domain")
print("5. Reranking: Add a reranking step for better results")
print("6. Caching: Cache embeddings for faster retrieval")`,
        language: 'python'
      }
    ]
  }
];
