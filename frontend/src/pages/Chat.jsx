import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api";
import "../styles/dashboard.css";

function Chat() {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const currentUserId = parseInt(localStorage.getItem("user_id"));

  useEffect(() => {
    if (!currentUserId) {
      navigate("/login");
      return;
    }

    fetchConversations();

    // Check if there's a user parameter in URL to start a conversation
    const userParam = searchParams.get("user");
    if (userParam) {
      const targetUserId = parseInt(userParam);
      startConversationWithUser(targetUserId);
    }
  }, [currentUserId, navigate, searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchConversations() {
    try {
      const res = await API.get(`/chat/conversations/${currentUserId}`);
      setConversations(res.data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  }

  async function startConversationWithUser(userId) {
    try {
      // Fetch user details to get their name
      const userRes = await API.get(`/users/${userId}`);
      setSelectedUser(userId);
      setSelectedUserName(userRes.data.name);
      loadConversation(userId);
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  }

  async function loadConversation(userId, userName = "") {
    setSelectedUser(userId);
    if (userName) setSelectedUserName(userName);

    try {
      const res = await API.get(`/chat/conversation/${currentUserId}/${userId}`);
      setMessages(res.data);

      // Mark messages as read
      res.data.forEach(msg => {
        if (msg.receiver_id === currentUserId && !msg.is_read) {
          API.put(`/chat/mark-read/${msg.id}`).catch(console.error);
        }
      });

      // Refresh conversations to update unread counts
      fetchConversations();
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    setSending(true);
    try {
      // Match backend signature: sender_id as query param
      await API.post(`/chat/send?sender_id=${currentUserId}`, {
        receiver_id: selectedUser,
        message: newMessage
      });

      setNewMessage("");
      // Reload conversation
      loadConversation(selectedUser);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="spinner-lg"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <h1>Messages 💬</h1>
        <p>Chat with hirers and workers</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "var(--spacing-lg)", height: "600px" }}>
        {/* Conversations List */}
        <div className="card" style={{ height: "100%", overflow: "auto" }}>
          <div className="card-header">
            <h3 className="card-title">Conversations</h3>
          </div>
          <div style={{ padding: "var(--spacing-md)" }}>
            {conversations.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">💬</span>
                <p>No conversations yet</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
                {conversations.map((conv) => (
                  <div
                    key={conv.user_id}
                    onClick={() => loadConversation(conv.user_id, conv.user_name)}
                    style={{
                      padding: "var(--spacing-md)",
                      background: selectedUser === conv.user_id ? "var(--glass-border)" : "var(--glass-bg)",
                      borderRadius: "var(--radius-md)",
                      cursor: "pointer",
                      transition: "all var(--transition-base)",
                      border: `1px solid ${selectedUser === conv.user_id ? "var(--primary-color)" : "var(--glass-border)"}`
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)", marginBottom: "var(--spacing-xs)" }}>
                      <div className="user-avatar" style={{ width: "40px", height: "40px" }}>
                        {conv.user_name?.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <strong style={{ color: "var(--text-primary)" }}>{conv.user_name}</strong>
                        {conv.unread_count > 0 && (
                          <span className="badge badge-primary" style={{ marginLeft: "var(--spacing-sm)", fontSize: "10px" }}>
                            {conv.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                    {conv.last_message && (
                      <p style={{
                        fontSize: "var(--font-size-sm)",
                        color: "var(--text-muted)",
                        margin: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}>
                        {conv.last_message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          {selectedUser ? (
            <>
              <div className="card-header">
                <h3 className="card-title">
                  {selectedUserName || conversations.find(c => c.user_id === selectedUser)?.user_name || "Chat"}
                </h3>
              </div>

              {/* Messages */}
              <div style={{
                flex: 1,
                overflowY: "auto",
                padding: "var(--spacing-lg)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-md)"
              }}>
                {messages.length === 0 ? (
                  <div className="empty-state">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        alignSelf: msg.sender_id === currentUserId ? "flex-end" : "flex-start",
                        maxWidth: "70%"
                      }}
                    >
                      <div style={{
                        padding: "var(--spacing-md)",
                        background: msg.sender_id === currentUserId ? "var(--primary-color)" : "var(--glass-bg)",
                        borderRadius: "var(--radius-md)",
                        color: msg.sender_id === currentUserId ? "white" : "var(--text-primary)"
                      }}>
                        <p style={{ margin: 0, wordBreak: "break-word" }}>{msg.message}</p>
                        <small style={{
                          opacity: 0.7,
                          fontSize: "var(--font-size-xs)",
                          marginTop: "var(--spacing-xs)",
                          display: "block"
                        }}>
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </small>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div style={{ borderTop: "1px solid var(--glass-border)", padding: "var(--spacing-lg)" }}>
                <form onSubmit={sendMessage} style={{ display: "flex", gap: "var(--spacing-md)" }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sending}
                    style={{ flex: 1 }}
                  />
                  <button type="submit" className="btn btn-primary" disabled={sending || !newMessage.trim()}>
                    {sending ? "Sending..." : "Send"}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="empty-state" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div>
                <span className="empty-icon">💬</span>
                <h3>Select a conversation</h3>
                <p>Choose a conversation from the list to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
