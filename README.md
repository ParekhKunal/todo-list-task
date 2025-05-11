# iTechnoSol Project

A full-stack web application with a modern frontend and robust backend.

## 🚀 Features

- Modern React frontend
- Node.js/Express backend
- RESTful API architecture
- Swagger API documentation
- Secure authentication
- Responsive design

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

## 🛠️ Installation

1. Clone the repository:
```bash
git clone [https://github.com/yourusername/iTechnoSol.git](https://github.com/ParekhKunal/todo-list-task.git)
cd iTechnoSol
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

## 🔧 Configuration

1. Create a `.env` file in the backend directory:
```env
PORT=5500
NODE_ENV=development
# Add other environment variables as needed
```

2. Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5500
```

## 🚀 Running the Application

### Backend
```bash
cd backend
npm run dev
```
The backend server will start on http://localhost:5500

### Frontend
```bash
cd frontend
npm start
```
The frontend development server will start on http://localhost:3000

## 📚 API Documentation

API documentation is available at http://localhost:5500/api-docs when the backend server is running.

## 🏗️ Project Structure

```
iTechnoSol/
├── backend/           # Backend server code
│   ├── src/
│   ├── tests/
│   └── package.json
├── frontend/          # Frontend React application
│   ├── src/
│   ├── public/
│   └── package.json
├── .gitignore
└── README.md
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📦 Build

### Backend
```bash
cd backend
npm run build
```

### Frontend
```bash
cd frontend
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- List any acknowledgments here 
