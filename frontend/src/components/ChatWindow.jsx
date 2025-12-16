import React from "react";

function ChatWindow({ messages }) {
  return (
    <div style={{ border: "1px solid black", padding: 10 }}>
      {messages.map((msg) => (
        <p key={msg.id}><b>{msg.sender_name}:</b> {msg.text}</p>
      ))}
    </div>
  );
}

export default ChatWindow;
