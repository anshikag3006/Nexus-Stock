💎 Nexus Stock: Inventory Intelligence Dashboard
Nexus Stock is a high-fidelity, full-stack inventory management system designed for modern businesses. It features a high-performance FastAPI backend, a PostgreSQL database for persistent storage, and a premium, responsive React frontend with a glassmorphism aesthetic.

🚀 Key Features
Real-time Synchronization: Instant data updates between the PostgreSQL database and the React dashboard.

Asset Valuation: Automatically calculates the total portfolio value based on current stock and premium pricing.

Intelligent Filtering: Fast search by ID, Name, or Description to manage inventories effortlessly.

Responsive Design: Fully optimized for Desktop, Tablet, and Mobile views with a custom stacking grid.

Operational Status: Live system health pulse indicator with a custom CSS animation.

Professional UI: Clean table layout with 12px spacing between action buttons for better usability.

🛠️ Tech Stack
Frontend: React (Hooks, useMemo), CSS3 (Flexbox/Grid), Axios.

Backend: FastAPI (Python), SQLAlchemy ORM.

Database: PostgreSQL.

Security: Python-dotenv for secure secret management.

📋 Installation & Setup
1. Database Configuration
Create a PostgreSQL database named anshika.

Create a .env file in the root directory and add your connection string:

Plaintext

DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/anshika
2. Backend Setup
Bash

# Navigate to root directory
cd Nexus-Stock

# Activate virtual environment
.\myenv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload
3. Frontend Setup
Bash

cd frontend

# Install dependencies
npm install

# Start the dashboard
npm start
🛡️ Security Best Practices
This project implements Secret Management using environment variables (.env). This ensures that sensitive database credentials are never hardcoded or pushed to version control, following industry standards for production applications.