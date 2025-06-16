import React, { useEffect, useState,useRef } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
//  import VideoChat from "./VideoChat";

// Move socket OUTSIDE component scope to prevent re-connecting on re-renders
const socket = io(import.meta.env.VITE_BACKEND_URL ,{
  transports: ["websocket", "polling"],
  withCredentials: true,
}); // ✅ Replace with deployed URL if needed
const languages = {
    javascript: { id: 63, label: "JavaScript" },
    python: { id: 92, label: "Python" },
    cpp: { id: 54, label: "C++" },
    java: { id: 62, label: "Java" },
};
  const defaultCodes = {
    javascript: "// Write your JavaScript code here",
    python: "# Write your Python code here",
    cpp: "// Write your C++ code here",
    java: "// Write your Java code here",
};

const CodeEditor = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(defaultCodes["javascript"]);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript'); // JavaScript
  const {roomId } = useParams();
  const [output, setOutput] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username;
   

  const handleEditorChange = (value) => {
    setCode(value);
    socket.emit("code-change", { roomId, code: value }); // ✅ send code with room ID
  };
  const handleChange = (e) => {
    const newLang = e.target.value;
        setSelectedLanguage(newLang);
        setCode(defaultCodes[newLang]);
  };
  
  useEffect(() => {
    // Join the room after connecting
    socket.on("connect", () => {
      console.log("✅ Connected to server");
      socket.emit("join-room", roomId);
    });

    socket.on("user-joined", ({ socketId }) => {
    toast.success(` ${username} joined the room.`);
  });

    // Listen for incoming code updates
    socket.on("code-change", (incomingCode) => {
      setCode(incomingCode);

      return () => {
        toast.dismiss("User Disconnected");
    socket.off("user-joined"); // Clean up
    socket.disconnect();
  };
    });



    // Cleanup on unmount
    // return () => {
    //   socket.disconnect();
    // };
  }, [roomId]);

  useEffect(() => {
  socket.on("receive-message", ({ message, sender }) => {
    setMessages(prev => [...prev, { sender, message }]);
  });

  socket.on("user-left", ({ username }) => {
    toast.error(`${username} left the room.`);
  });

  return () => {
    socket.off("receive-message");
    socket.off("user-left");
  };
}, []);


   const sendMessage = () => {
    if (chatInput.trim() !== "") {
      socket.emit("send-message", {
        roomId,
        message: chatInput,
        sender: username,
      });

      // Add message to own chat view
      setMessages(prev => [...prev, { sender: "You", message: chatInput }]);
      setChatInput("");
    }
  };

   const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  
  const handleBack = () => {
  socket.emit("user-disconnected", { roomId, username });
  navigate('/collaboration');
};
  const runCode = async () => {
    try {
      const languageId = languages[selectedLanguage].id;
      const { data } = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          source_code: code,
          language_id: languageId, // JavaScript
          
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": "61ef607dfdmshac4f40b4c812d61p1956a5jsn4d082bec6041",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );

      const token = data.token;

      setTimeout(async () => {
        const result = await axios.get(
          `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false`,
          {
            headers: {
              "X-RapidAPI-Key": "61ef607dfdmshac4f40b4c812d61p1956a5jsn4d082bec6041",
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            },
          }
        );

        const resData = result.data;
        setOutput(resData.stdout || resData.err ||"No output");
      }, 1500);
    } catch (err) {
        console.log("Error:", err);
      setOutput("❌ Error while executing the code");
    }
  };
  
  
  return (
    <div className="main" style={{display:'flex', alignItems:'center', columnGap:'10px'}}>
    <div style={{ padding: "20px", marginTop: "200px" }}>
      <select value={selectedLanguage} onChange={handleChange} style={{backgroundColor:"#d07d00" , padding:"5px" , color:"#fff",borderRadius:"20px"
        ,marginBottom:"20px" , border:"none"
      }}>
        <option value="">--Choose--</option>
        {Object.keys(languages).map(lang => (
          <option key={lang} value={lang}>
            {languages[lang].label}
          </option>
        ))}
      </select>
      <button onClick={handleBack} style={{backgroundColor:'red',marginLeft:'10px'}}>Leave</button>
      <Editor
        height="60vh"
        width="140vh"
        //defaultLanguage={languages.find(l => l.id.toString() === selectedLanguage)?.name.toLowerCase() || 'javascript'}
        value={code}
        language={selectedLanguage}
        onChange={handleEditorChange}
        theme="vs-dark"
      />

      <button
        onClick={runCode}
        style={{
          marginTop: "10px",
          padding: "10px 30px",
          backgroundColor: "#d07d00",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Run Code
      </button>
        
      <pre
        style={{
          marginTop: "10px",
          marginBottom:'200px',
          backgroundColor: "#1e1e1e",
          color: "#d4d4d4",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        {output}
      </pre>
    </div>
    <div className="chat-container">
      <div className="chat-container" style={{
  width: '300px',
  height: '70vh',
  marginLeft: '20px',
  backgroundColor: '#2b2b2b',
  borderRadius: '10px',
  padding: '10px',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
}}>
  <div style={{ overflowY: 'auto', flex: 1 }}>
    {messages.map((msg, index) => (
      <div key={index} style={{ marginBottom: '8px' }}>
        <strong style={{ color: '#ffa500' }}>{msg.sender}:</strong> {msg.message}
      </div>
    ))}
  </div>
  <div style={{ display: 'flex', marginTop: '10px' }}>
    <input
      type="text"
      value={chatInput}
      onChange={(e) => setChatInput(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Type your message..."
      style={{
        flex: 1,
        padding: '5px',
        borderRadius: '5px',
        border: 'none',
        outline: 'none'
      }}
    />
    <button
      onClick={sendMessage}
      style={{
        backgroundColor: '#d07d00',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        marginLeft: '5px',
        padding: '5px 10px'
      }}
    >
      Send
    </button>
  </div>
</div>

      
    </div>
    </div>
  );
};

export default CodeEditor;
