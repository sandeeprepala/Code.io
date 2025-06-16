// VideoChat.js
import React, { useRef, useEffect } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

const socket = io(import.meta.env.VITE_BACKEND_URL); // Replace with backend URL

const VideoChat = ({ roomId }) => {
  const localVideo = useRef();
  const remoteVideo = useRef();
  const peerRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      localVideo.current.srcObject = stream;

      socket.emit("join-room", roomId);

      socket.on("user-joined", (userId) => {
        const peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on("signal", (data) => {
          socket.emit("signal", { userId, signal: data });
        });

        peer.on("stream", (remoteStream) => {
          remoteVideo.current.srcObject = remoteStream;
        });

        peerRef.current = peer;
      });

      socket.on("receive-signal", ({ signal }) => {
        const peer = new Peer({ initiator: false, trickle: false, stream });

        peer.on("signal", (data) => {
          socket.emit("return-signal", { signal: data });
        });

        peer.on("stream", (remoteStream) => {
          remoteVideo.current.srcObject = remoteStream;
        });

        peer.signal(signal);
        peerRef.current = peer;
      });

      socket.on("receive-returned-signal", ({ signal }) => {
        peerRef.current.signal(signal);
      });
    });
  }, [roomId]);

  return (
    <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
      <video ref={localVideo} autoPlay playsInline muted style={{ width: "300px", borderRadius: "10px" }} />
      <video ref={remoteVideo} autoPlay playsInline style={{ width: "300px", borderRadius: "10px" }} />
    </div>
  );
};

export default VideoChat;
