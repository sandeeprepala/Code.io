# 🚀 Code.io — Online Coding Platform with Collaborative Rooms

**Code.io** is a modern online coding platform inspired by LeetCode and Google Docs.  
It lets you practice coding problems, execute code, and solve questions — plus collaborate with others in real-time using live coding rooms.

---

## 📌 **Features**

✅ **LeetCode-like coding problems:** Solve curated problems with custom test cases  
✅ **Code Execution:** Submit and run code using an online compiler (Judge0 API)  
✅ **Problem Statements:** Hints, constraints, and multiple difficulty levels  
✅ **Rooms for Collaboration:** Real-time pair programming with Socket.IO  
✅ **Monaco Editor:** VS Code-like syntax highlighting and auto-complete  
✅ **Authentication:** User login & problem history 
✅ **Clean UI:** Built with React =
✅ **Fully deployed:** Frontend & backend ready for production

---

## ⚙️ **Tech Stack**

**Frontend:**  
- React.js (Vite)
- Monaco Editor
- Socket.IO Client

**Backend:**  
- Node.js & Express.js
- Socket.IO Server
- MongoDB (problem storage, user submissions)
- REST API for code execution (Judge0)

**Deployment:**  
- Frontend: Vercel / Netlify  
- Backend: Render / Railway / Heroku

---

## 🗂️ **Project Structure**

```plaintext
code.io/
 ├── client/                # React frontend
 │   ├── src/
 │   │   ├── components/    # Editor, Room, ProblemPage
 │   │   ├── pages/         # Home, Problems List, Editor, Room Join
 │   │   ├── App.js
 │   │   └── index.js
 ├── server/                # Node backend
 │   ├── index.js
 │   ├── socket.js          # Collaborative Rooms logic (Socket.IO)
 │   ├── models/            # Mongoose models: Problem, Submission, User
 │   ├── routes/            # API: Problems, Submissions, Auth
 │   ├── controllers/       # Business logic
 │   ├── .env               # Env config
 │   ├── package.json
 ├── README.md
 ├── package.json
