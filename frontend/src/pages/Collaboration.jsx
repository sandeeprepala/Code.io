import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Collaboration.css'; // Reusing the same CSS
import io from'socket.io-client';
import { useEffect } from 'react';
const socket = io("http://localhost:8000");

const Collaboration = () => {
  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate(); // ✅ use it at the top level

  const handleJoinRoom = () => {
    if (roomId.trim() === '') return;
    navigate(`/codeColab/${roomId}`); // ✅ navigate on button click
    window.location.reload();
  };

  return (
    <div>
      <div className="container">
        <label>Enter Room ID</label>
        <input
          type="text"
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button onClick={handleJoinRoom}>Join Room</button>
      </div>
    </div>
  );
};

export default Collaboration;
