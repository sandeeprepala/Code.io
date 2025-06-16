# Code.io 🧑‍💻

**Code.io** is an online coding platform inspired by LeetCode and Codeforces. It allows users to solve coding problems in multiple languages, run test cases, and get verdicts using the Judge0 API. It also includes user authentication, problem tracking, and real-time collaboration support.

## 🌐 Features

- 👨‍💻 Monaco Code Editor (VS Code experience)
- 🧪 Run code against custom test cases
- ✅ Judge0 API integration for code execution
- 🔐 Authentication using JWT
- 📊 Track solved problems
- 🌍 Support for multiple languages: JavaScript, Python, C++, Java
- 📦 MongoDB-based backend with Express.js
- 🎯 Submissions with verdicts and test case results
- 🎧 Collaborative features (Video/Audio chat - optional extension)

## 🛠️ Tech Stack

### Frontend:
- React.js
- Tailwind CSS
- Axios
- React Router
- Monaco Editor

### Backend:
- Node.js
- Express.js
- MongoDB
- JWT (Authentication)

### Third-Party APIs:
- [Judge0 API](https://judge0.com/) – for code compilation and execution

## 🚀 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/sandeeprepala/Code.io.git
cd Code.io
2. Install Dependencies
bash
Copy
Edit
# For frontend
cd frontend
npm install

# For backend
cd ../backend
npm install
3. Configure Environment Variables
Create a .env file in both frontend and backend directories.

Example .env (Backend)
env
Copy
Edit
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
Example .env (Frontend)
env
Copy
Edit
VITE_JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
VITE_JUDGE0_API_KEY=your_judge0_api_key
🔐 Ensure your .env files are listed in .gitignore.

4. Run the Application
Start Backend
bash
Copy
Edit
npm start
Start Frontend
bash
Copy
Edit
npm run dev
📸 Screenshots
You can add some screenshots or GIFs of the editor, test results, etc.

📌 TODO / Future Enhancements
Add dark/light mode toggle

Add leaderboard for users

Add support for custom test cases input/output

Add real-time calling using WebRTC and Socket.IO

Admin panel for problem management

🧑‍💻 Author
Made with ❤️ by Sandeep Repala
