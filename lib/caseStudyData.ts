/**
 * Complete Case Study Data with Code Content
 * Extracted from Workshop_Preset.ipynb
 */

export interface CaseStudyStep {
  id: string;
  title: string;
  password: string;
  code: string;
  description: string;
}

export interface CaseStudyData {
  id: string;
  title: string;
  description: string;
  steps: CaseStudyStep[];
}

export const caseStudyData: CaseStudyData[] = [
  // Case Study 1: House Price Prediction
  {
    id: 'cs-1',
    title: 'House Price Prediction',
    description: 'Regression Modelling - Build predictive models to estimate house prices based on various features',
    steps: [
      {
        id: 'step-1',
        title: 'Step 1: Import Libraries',
        password: 'hP9x2Lm4',
        description: 'Import necessary libraries for regression analysis',
        code: `# Case Study 1 - House Price Prediction
# Step 1: Import Libraries
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.metrics import mean_squared_error
import matplotlib.pyplot as plt`
      },
      {
        id: 'step-2',
        title: 'Step 2: Load Dataset',
        password: 'dS7kR3nQ',
        description: 'Load the house price dataset from CSV',
        code: `# Step 2a: Load Dataset
data = pd.read_csv("RCaseStudy1_Dataset.csv")`
      },
      {
        id: 'step-3',
        title: 'Step 3: Visualize Data',
        password: 'vZ8tY5wP',
        description: 'Create scatter plot to visualize relationship between area and price',
        code: `# Step 3: Visualize the Dataset
plt.scatter(data["Area"], data["Price"])
plt.xlabel("Area (sq ft)")
plt.ylabel("Price")
plt.title("House Price Dataset")
plt.show()`
      },
      {
        id: 'step-4',
        title: 'Step 4: Prepare Data & Train Linear Model',
        password: 'pD4mL9xK',
        description: 'Split features and target, then train linear regression model',
        code: `# Step 4: Prepare Data and Train Linear Model
X = data[['Area']]
y = data['Price']

linear_model = LinearRegression()
linear_model.fit(X, y)

y_pred_linear = linear_model.predict(X)`
      },
      {
        id: 'step-5',
        title: 'Step 5: Visualize Linear Regression',
        password: 'vL6rT2nM',
        description: 'Plot the linear regression fit',
        code: `# Step 5: Visualize Linear Regression Fit
plt.scatter(X, y)
plt.plot(X, y_pred_linear, color='red')
plt.xlabel("Area")
plt.ylabel("Price")
plt.title("Linear Regression Fit")
plt.show()`
      },
      {
        id: 'step-6',
        title: 'Step 6: Evaluate Linear Model',
        password: 'eL3mS8qW',
        description: 'Calculate MSE and RMSE for linear regression',
        code: `# Step 6: Evaluate Linear Model
mse_linear = mean_squared_error(y, y_pred_linear)
print("Linear Regression MSE:", mse_linear)

rmse_linear = np.sqrt(mse_linear)
print("Linear Regression RMSE:", rmse_linear)`
      },
      {
        id: 'step-7',
        title: 'Step 7: Train Polynomial Model',
        password: 'tP5nM7kR',
        description: 'Create polynomial features and train polynomial regression',
        code: `# Step 7: Polynomial Regression
poly = PolynomialFeatures(degree=2)
X_poly = poly.fit_transform(X)

poly_model = LinearRegression()
poly_model.fit(X_poly, y)

y_pred_poly = poly_model.predict(X_poly)`
      },
      {
        id: 'step-8',
        title: 'Step 8: Visualize Polynomial Regression',
        password: 'vP9rT4xL',
        description: 'Plot the polynomial regression fit',
        code: `# Step 8: Visualize Polynomial Fit
sorted_zip = sorted(zip(X["Area"], y_pred_poly))
X_sorted, y_poly_sorted = zip(*sorted_zip)

plt.scatter(X, y)
plt.plot(X_sorted, y_poly_sorted, color='green')
plt.xlabel("Area")
plt.ylabel("Price")
plt.title("Polynomial Regression Fit")
plt.show()`
      },
      {
        id: 'step-9',
        title: 'Step 9: Evaluate Polynomial Model',
        password: 'eP2mR6sQ',
        description: 'Calculate MSE and RMSE for polynomial regression',
        code: `# Step 9: Evaluate Polynomial Model
mse_poly = mean_squared_error(y, y_pred_poly)
print("Polynomial Regression MSE:", mse_poly)

rmse_poly = np.sqrt(mse_poly)
print("Polynomial Regression RMSE:", rmse_poly)`
      }
    ]
  },

  // Case Study 2: Credit Risk Classification
  {
    id: 'cs-2',
    title: 'Credit Risk Classification',
    description: 'Financial Decision Systems - Develop ML models to assess credit risk and make lending decisions',
    steps: [
      {
        id: 'step-1',
        title: 'Step 1: Import Libraries',
        password: 'cR5x9Lp2',
        description: 'Import libraries for classification',
        code: `# Case Study 2 - Credit Risk Classification
# Step 1: Import Libraries
import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, classification_report`
      },
      {
        id: 'step-2',
        title: 'Step 2: Load Dataset',
        password: 'dC8kT4mR',
        description: 'Load the credit risk dataset',
        code: `# Step 2: Load Dataset
data = pd.read_csv("RCaseStudy2_Dataset.csv")`
      },
      {
        id: 'step-3',
        title: 'Step 3: Prepare Features and Split Data',
        password: 'fS7pD3xQ',
        description: 'Define features, target, and split into train/test sets',
        code: `# Step 3: Prepare Features and Target
X = data[["Income", "CreditScore", "DebtRatio", "EmploymentYears", "LoanAmount"]]
y = data["Risk"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)`
      },
      {
        id: 'step-4',
        title: 'Step 4: Check Data',
        password: 'cD6vR9mL',
        description: 'Verify the loaded data',
        code: `# Step 4: Check Data
ay = data.head(5)
print(ay)`
      },
      {
        id: 'step-5',
        title: 'Step 5: Train Logistic Regression Model',
        password: 'tL4mR8xP',
        description: 'Train the logistic regression model and make predictions',
        code: `# Step 5: Train Logistic Model
model = LogisticRegression()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)`
      },
      {
        id: 'step-6',
        title: 'Step 6: Compute Confusion Matrix',
        password: 'cM3xT7kQ',
        description: 'Evaluate model performance with confusion matrix',
        code: `# Step 6: Compute Confusion Matrix
cm = confusion_matrix(y_test, y_pred)
print("Confusion Matrix:")
print(cm)`
      },
      {
        id: 'step-7',
        title: 'Step 7: Print Classification Report',
        password: 'pC9rT2nM',
        description: 'Display detailed classification metrics',
        code: `# Step 7: Print Classification Report
print(classification_report(y_test, y_pred))`
      },
      {
        id: 'step-8',
        title: 'Step 8: Save Model',
        password: 'sM5kL8xR',
        description: 'Save the trained model and scaler for deployment',
        code: `# Step 8: Save Model
import joblib
joblib.dump(model, "credit_model.pkl")

from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
joblib.dump(scaler, "scaler.pkl")

print("Model saved successfully!")`
      }
    ]
  },

  // Case Study 3: Early Sepsis Risk Prediction
  {
    id: 'cs-3',
    title: 'Early Sepsis Risk Prediction',
    description: 'Healthcare ML - Create early warning systems to predict sepsis risk in patients',
    steps: [
      {
        id: 'step-1',
        title: 'Step 1: Import Libraries',
        password: 'sP7x3Rm9',
        description: 'Import healthcare ML libraries',
        code: `# Case Study 3 - Early Sepsis Risk Prediction
# Step 1: Import Libraries
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, classification_report`
      },
      {
        id: 'step-2',
        title: 'Step 2: Load Medical Data',
        password: 'mD4kL8xT',
        description: 'Load patient vital signs dataset',
        code: `# Step 2: Load Dataset
data = pd.read_csv("CaseStudy3_Dataset.csv")`
      },
      {
        id: 'step-3',
        title: 'Step 3: Explore Data',
        password: 'eD9vT5mR',
        description: 'Display the first few rows of the dataset',
        code: `# Step 3: Explore Data
print(data.head())`
      },
      {
        id: 'step-4',
        title: 'Step 4: Define Sepsis Risk Rule',
        password: 'rR6sT2xL',
        description: 'Create sepsis indicator based on vital signs thresholds',
        code: `# Step 4: Define Sepsis Risk Rule
data["Sepsis"] = (
    (data["HeartRate"] > 100) &
    (data["Temperature"] > 100) &
    (data["WBC"] > 12000)
).astype(int)`
      },
      {
        id: 'step-5',
        title: 'Step 5: Prepare Data and Split',
        password: 'pD8mS4xQ',
        description: 'Split features and target into train/test sets',
        code: `# Step 5: Prepare Data
X = data.drop("Sepsis", axis=1)
y = data["Sepsis"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)`
      },
      {
        id: 'step-6',
        title: 'Step 6: Train Logistic Regression Model',
        password: 'tL3mR7xK',
        description: 'Train the sepsis prediction model',
        code: `# Step 6: Train Model
model = LogisticRegression(class_weight="balanced", max_iter=1000)
model.fit(X_train, y_train)`
      },
      {
        id: 'step-7',
        title: 'Step 7: Evaluate with Confusion Matrix',
        password: 'eC5mT9xP',
        description: 'Make predictions and display confusion matrix',
        code: `# Step 7: Evaluate Model
y_pred = model.predict(X_test)

print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))`
      },
      {
        id: 'step-8',
        title: 'Step 8: Classification Report and Probabilities',
        password: 'cR4pT8xM',
        description: 'Display detailed metrics and prediction probabilities',
        code: `# Step 8: Classification Report
print("\\nClassification Report:")
print(classification_report(y_test, y_pred))

# Get prediction probabilities
y_prob = model.predict_proba(X_test)[:,1]

print("\\nSample Probabilities:")
print(y_prob[:10])`
      }
    ]
  },

  // Case Study 4: Stock Trend Classification
  {
    id: 'cs-4',
    title: 'Stock Trend Classification',
    description: 'Time-Series Modelling - Analyze and predict stock market trends using historical data',
    steps: [
      {
        id: 'step-1',
        title: 'Step 1: Install and Import Libraries',
        password: 'sT9x2Lm7',
        description: 'Setup for stock market analysis',
        code: `# Case Study 4 - Stock Trend Classification
# Step 1: Install yfinance
!pip install yfinance

# Import Libraries
import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix
from sklearn.model_selection import train_test_split`
      },
      {
        id: 'step-2',
        title: 'Step 2: Download Stock Data',
        password: 'dS4kT9xM',
        description: 'Fetch historical stock data from Yahoo Finance',
        code: `# Step 2: Download Stock Data
stock_symbol = "AAPL"  # Apple Inc.
stock = yf.download(
    stock_symbol,
    start="2015-01-01",
    end="2024-01-01",
    progress=False
)

if stock.empty:
    raise ValueError("Stock data download failed. Check internet or ticker symbol.")

# Alternative: Load from backup CSV
# stock = pd.read_csv("stock_backup.csv")

stock.head()`
      },
      {
        id: 'step-3',
        title: 'Step 3: Rename Columns',
        password: 'rC6kT3xP',
        description: 'Standardize column names for processing',
        code: `# Step 3: Rename Columns
stock.columns = ['Open', 'High', 'Low', 'Close', 'Volume']`
      },
      {
        id: 'step-4',
        title: 'Step 4: Feature Engineering',
        password: 'fE3kR8xL',
        description: 'Create technical indicators and features',
        code: `# Step 4: Create Features
stock["Return"] = stock["Close"].pct_change()
stock["MA_5"] = stock["Close"].rolling(5).mean()
stock["MA_10"] = stock["Close"].rolling(10).mean()
stock["MA_20"] = stock["Close"].rolling(20).mean()
stock["Volatility"] = stock["Return"].rolling(5).std()`
      },
      {
        id: 'step-5',
        title: 'Step 5: Create Target Variable',
        password: 'cT8vR4xM',
        description: 'Define prediction target (price up/down)',
        code: `# Step 5: Create Target
stock["Target"] = (stock["Close"].shift(-1) > stock["Close"]).astype(int)
stock = stock.dropna()`
      },
      {
        id: 'step-6',
        title: 'Step 6: Prepare Features and Split Data',
        password: 'pF6sD2xR',
        description: 'Select features and create train/test split',
        code: `# Step 6: Prepare Features
features = ["Return", "MA_5", "MA_10", "MA_20", "Volatility"]

X = stock[features]
y = stock["Target"]

# Time-series split (80/20)
split = int(len(stock) * 0.8)

X_train = X[:split]
X_test = X[split:]
y_train = y[:split]
y_test = y[split:]

print("X shape:", X.shape)
print("Split index:", split)
print("Train shape:", X_train.shape)`
      },
      {
        id: 'step-7',
        title: 'Step 7: Train Logistic Regression Model',
        password: 'tS5mL9xR',
        description: 'Train the stock trend prediction model',
        code: `# Step 7: Train Model
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)`
      },
      {
        id: 'step-8',
        title: 'Step 8: Evaluate Model Performance',
        password: 'eM7pT4xQ',
        description: 'Calculate accuracy and compare with baseline',
        code: `# Step 8: Evaluate Model
accuracy = accuracy_score(y_test, y_pred)

print("Accuracy:", accuracy)
print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# Baseline accuracy (always predict majority class)
baseline = y_test.value_counts(normalize=True).max()
print("Baseline Accuracy:", baseline)`
      }
    ]
  },

  // Case Study 5: Neural Networks for Digital Classification
  {
    id: 'cs-5',
    title: 'Neural Networks for Digital Classification',
    description: 'Deep Learning - Build neural networks to classify handwritten digits and images',
    steps: [
      {
        id: 'step-1',
        title: 'Step 1: Import TensorFlow Libraries',
        password: 'nN8x2Lp5',
        description: 'Setup deep learning environment',
        code: `# Case Study 5 - Neural Networks for Digital Classification
# Step 1: Import Libraries
import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
from tensorflow import keras
from tensorflow.keras.datasets import mnist`
      },
      {
        id: 'step-2',
        title: 'Step 2: Load MNIST Dataset',
        password: 'mD5kT8xQ',
        description: 'Load handwritten digits dataset',
        code: `# Step 2: Load MNIST Dataset
(X_train, y_train), (X_test, y_test) = tf.keras.datasets.mnist.load_data()

print("Training data shape:", X_train.shape)
print("Test data shape:", X_test.shape)`
      },
      {
        id: 'step-3',
        title: 'Step 3: Visualize Sample Images',
        password: 'vS9mT4xR',
        description: 'Display sample digits from the dataset',
        code: `# Step 3: Visualize Sample Images
plt.figure(figsize=(8,4))
for i in range(10):
    plt.subplot(2,5,i+1)
    plt.imshow(X_train[i], cmap='gray')
    plt.title(f"Label: {y_train[i]}")
    plt.axis("off")
plt.tight_layout()
plt.show()`
      },
      {
        id: 'step-4',
        title: 'Step 4: Normalize Data',
        password: 'nD7kR3xM',
        description: 'Scale pixel values to 0-1 range',
        code: `# Step 4: Normalize Data
X_train = X_train / 255.0
X_test = X_test / 255.0`
      },
      {
        id: 'step-5',
        title: 'Step 5: Convert Labels to Categorical',
        password: 'cL6kT3xP',
        description: 'One-hot encode the target labels',
        code: `# Step 5: Convert Labels to Categorical
from tensorflow.keras.utils import to_categorical

y_train_cat = to_categorical(y_train, 10)
y_test_cat = to_categorical(y_test, 10)`
      },
      {
        id: 'step-6',
        title: 'Step 6: Build Neural Network',
        password: 'bN3mR7xK',
        description: 'Create and compile the model architecture',
        code: `# Step 6: Build Neural Network
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Flatten

model = Sequential([
    Flatten(input_shape=(28,28)),
    Dense(128, activation='relu'),
    Dense(64, activation='relu'),
    Dense(10, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)`
      },
      {
        id: 'step-7',
        title: 'Step 7: Train the Model',
        password: 'tN5mR8xQ',
        description: 'Train the neural network on MNIST data',
        code: `# Step 7: Train Model
history = model.fit(
    X_train, y_train_cat,
    epochs=10,
    batch_size=128,
    validation_split=0.1
)`
      },
      {
        id: 'step-8',
        title: 'Step 8: Evaluate and Visualize Predictions',
        password: 'eV4pT9xL',
        description: 'Test the model and display predictions',
        code: `# Step 8: Evaluate Model
test_loss, test_accuracy = model.evaluate(X_test, y_test_cat)
print("Test Accuracy:", test_accuracy)

# Make Predictions
predictions = model.predict(X_test)
predicted_labels = np.argmax(predictions, axis=1)

# Visualize Predictions
plt.figure(figsize=(8,4))
for i in range(10):
    plt.subplot(2,5,i+1)
    plt.imshow(X_test[i], cmap='gray')
    plt.title(f"Predicted: {predicted_labels[i]}")
    plt.axis("off")
plt.tight_layout()
plt.show()`
      }
    ]
  },

  // Case Study 6: Semantic Similarity Modeling
  {
    id: 'cs-6',
    title: 'Semantic Similarity Modeling',
    description: 'NLP - Develop models to measure semantic similarity between text documents',
    steps: [
      {
        id: 'step-1',
        title: 'Step 1: Install Sentence Transformers',
        password: 'sS9x2Lm6',
        description: 'Setup NLP libraries',
        code: `# Case Study 6 - Semantic Similarity (Mini Plagiarism Checker)
# Step 1: Install Libraries
!pip install sentence-transformers

# Import Libraries
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np`
      },
      {
        id: 'step-2',
        title: 'Step 2: Load Pre-trained Model',
        password: 'lM5kT9xQ',
        description: 'Load sentence embedding model',
        code: `# Step 2: Load Model
model = SentenceTransformer('all-MiniLM-L6-v2')`
      },
      {
        id: 'step-3',
        title: 'Step 3: Define Test Sentences',
        password: 'dT6kS3xR',
        description: 'Create sample texts for similarity comparison',
        code: `# Step 3: Define Test Sentences
text1 = "Machine learning is used to predict house prices."
text2 = "AI models can estimate property values."`
      },
      {
        id: 'step-4',
        title: 'Step 4: Generate Embeddings',
        password: 'gE7kR3xP',
        description: 'Convert text to vector representations',
        code: `# Step 4: Generate Embeddings
embedding1 = model.encode([text1])
embedding2 = model.encode([text2])`
      },
      {
        id: 'step-5',
        title: 'Step 5: Calculate Similarity Score',
        password: 'cS8mT4xL',
        description: 'Measure semantic similarity between texts',
        code: `# Step 5: Calculate Similarity
similarity_score = cosine_similarity(embedding1, embedding2)[0][0]
print("Similarity Score:", round(similarity_score, 3))`
      },
      {
        id: 'step-6',
        title: 'Step 6: Test with Unrelated Sentence',
        password: 'tU3sR7xK',
        description: 'Compare with a different topic to verify',
        code: `# Step 6: Test with Unrelated Sentence
text3 = "The football match was exciting."

embedding3 = model.encode([text3])
similarity_score2 = cosine_similarity(embedding1, embedding3)[0][0]

print("Similarity with unrelated sentence:", round(similarity_score2, 3))`
      },
      {
        id: 'step-7',
        title: 'Step 7: Interactive Plagiarism Checker',
        password: 'iP4cT8xM',
        description: 'Build a simple plagiarism detection tool',
        code: `# Step 7: Interactive Plagiarism Checker
text1 = input("Enter First Text: ")
text2 = input("Enter Second Text: ")

embedding1 = model.encode([text1])
embedding2 = model.encode([text2])

similarity_score = cosine_similarity(embedding1, embedding2)[0][0]

print("\\nSimilarity Score:", round(similarity_score, 3))

if similarity_score > 0.75:
    print("⚠️ High Similarity – Possible Plagiarism")
elif similarity_score > 0.5:
    print("⚠️ Moderate Similarity")
else:
    print("✅ Low Similarity – Likely Different Content")`
      }
    ]
  },

  // Case Study 7: RAG-based AI Chatbot
  {
    id: 'cs-7',
    title: 'RAG-based AI Chatbot Development',
    description: 'Retrieval-Augmented Generation - Build intelligent chatbots using RAG architecture',
    steps: [
      {
        id: 'step-1',
        title: 'Step 1: Install RAG Libraries',
        password: 'rG9x2Lm4',
        description: 'Setup RAG environment',
        code: `# Case Study 7 - RAG-based AI Chatbot
# Step 1: Install Libraries
!pip install sentence-transformers scikit-learn numpy

# Import Libraries
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np`
      },
      {
        id: 'step-2',
        title: 'Step 2: Create Knowledge Base',
        password: 'kB6kT3xP',
        description: 'Build document database for retrieval',
        code: `# Step 2: Create Knowledge Base
documents = [
    "Machine learning is a subset of artificial intelligence that focuses on data-driven prediction.",
    "Neural networks are inspired by biological neurons and are used in deep learning.",
    "Retrieval-Augmented Generation combines document retrieval with language generation.",
    "Embeddings convert text into high-dimensional numerical vectors.",
    "Cosine similarity measures similarity between two vectors."
]`
      },
      {
        id: 'step-3',
        title: 'Step 3: Load Model and Generate Embeddings',
        password: 'lM7kE4xR',
        description: 'Encode knowledge base documents',
        code: `# Step 3: Load Model and Generate Embeddings
model = SentenceTransformer('all-MiniLM-L6-v2')

doc_embeddings = model.encode(documents)`
      },
      {
        id: 'step-4',
        title: 'Step 4: Create Query Embedding',
        password: 'qE4kR7xM',
        description: 'Encode user query for retrieval',
        code: `# Step 4: Create Query Embedding
query = "What is RAG?"
query_embedding = model.encode([query])`
      },
      {
        id: 'step-5',
        title: 'Step 5: Retrieve Relevant Document',
        password: 'rD8mT3xQ',
        description: 'Find most similar document using cosine similarity',
        code: `# Step 5: Retrieve Relevant Document
similarities = cosine_similarity(query_embedding, doc_embeddings)

top_index = np.argmax(similarities)
retrieved_doc = documents[top_index]

print("Most Relevant Document:")
print(retrieved_doc)`
      },
      {
        id: 'step-6',
        title: 'Step 6: Generate Response',
        password: 'gR3sT8xK',
        description: 'Create chatbot response using retrieved context',
        code: `# Step 6: Generate Response
response = f"Based on retrieved knowledge: {retrieved_doc}"

print("\\nChatbot Response:")
print(response)`
      },
      {
        id: 'step-7',
        title: 'Step 7: Build Response Generation Function',
        password: 'bR5gT9xL',
        description: 'Create reusable response generator',
        code: `# Step 7: Build Response Generation Function
def generate_response(query, retrieved_text):
    return f"Question: {query}\\n\\nAnswer (Grounded): {retrieved_text}"

print(generate_response(query, retrieved_doc))`
      },
      {
        id: 'step-8',
        title: 'Step 8: Interactive RAG Chatbot',
        password: 'iR6cT4xP',
        description: 'Complete RAG-based question answering system',
        code: `# Step 8: Interactive RAG Chatbot
while True:
    query = input("\\nAsk a question (type 'exit' to stop): ")
    if query.lower() == 'exit':
        break

    query_embedding = model.encode([query])
    similarities = cosine_similarity(query_embedding, doc_embeddings)
    top_index = np.argmax(similarities)
    retrieved_doc = documents[top_index]

    print("\\nAnswer:", retrieved_doc)`
      }
    ]
  }
];
