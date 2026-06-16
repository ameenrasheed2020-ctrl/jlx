import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Chat.css';
import { apiUrl } from '../../config/api';

const Chat = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const [chat, setChat] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChat = async () => {
            if (!userId) {
                navigate("/login");
                return;
            }

            try {
                const response = await fetch(apiUrl(`/chat/conversation/${id}`));
                if (response.ok) {
                    const data = await response.json();
                    setChat(data);
                } else {
                    setChat(null);
                }
            } catch (error) {
                console.error("Error fetching chat:", error);
                setChat(null);
            } finally {
                setLoading(false);
            }
        };

        fetchChat();
    }, [id, userId, navigate]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        try {
            const response = await fetch(apiUrl(`/chat/conversation/${id}/messages`), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ senderId: userId, text: message }),
            });

            const data = await response.json();
            if (response.ok) {
                setChat(data);
                setMessage("");
            } else {
                alert(data.message || "Could not send message.");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            alert("An error occurred while sending the message.");
        }
    };

    const updateDealStatus = async (dealStatus) => {
        try {
            const response = await fetch(apiUrl(`/chat/conversation/${id}/deal`), {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dealStatus }),
            });

            const data = await response.json();
            if (response.ok) {
                setChat(data);
            } else {
                alert(data.message || "Could not update deal.");
            }
        } catch (error) {
            console.error("Error updating deal:", error);
            alert("An error occurred while updating the deal.");
        }
    };

    if (loading) return <div className="chat-page">Loading chat...</div>;
    if (!chat) return <div className="chat-page">Chat not found</div>;

    const otherUser = chat.buyerId?._id === userId ? chat.sellerId : chat.buyerId;
    const statusLabel = chat.dealStatus === "deal_made" ? "Deal made" : chat.dealStatus;

    return (
        <div className="chat-page">
            <div className="chat-header">
                <button className="chat-back" onClick={() => navigate(-1)}>Back</button>
                <div>
                    <h2>{chat.productId?.productname || "Product chat"}</h2>
                    <p>Chatting with {otherUser?.Name || otherUser?.email || "User"}</p>
                </div>
                <span className={`deal-status ${chat.dealStatus}`}>{statusLabel}</span>
            </div>

            <div className="chat-product">
                <strong>Price:</strong> Rs. {chat.productId?.productprice || "-"}
            </div>

            <div className="message-list">
                {chat.messages.length === 0 ? (
                    <p className="empty-chat">Start the conversation and make a deal.</p>
                ) : (
                    chat.messages.map((item) => {
                        const mine = item.senderId?._id === userId || item.senderId === userId;
                        return (
                            <div key={item._id} className={`message-row ${mine ? "mine" : ""}`}>
                                <div className="message-bubble">
                                    <span>{item.text}</span>
                                    <small>{item.senderId?.Name || (mine ? "You" : "User")}</small>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="deal-actions">
                <button onClick={() => updateDealStatus("deal_made")}>Mark Deal Made</button>
                <button onClick={() => updateDealStatus("cancelled")}>Cancel Deal</button>
            </div>

            <form className="message-form" onSubmit={sendMessage}>
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat;
