import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Chat.css';
import { apiUrl } from '../../config/api';

const ChatList = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChats = async () => {
            if (!userId) {
                navigate("/login");
                return;
            }

            try {
                const response = await fetch(apiUrl(`/chat/user/${userId}`));
                if (response.ok) {
                    const data = await response.json();
                    setChats(data);
                }
            } catch (error) {
                console.error("Error fetching chats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, [userId, navigate]);

    if (loading) return <div className="chat-page">Loading chats...</div>;

    return (
        <div className="chat-page">
            <div className="chat-header">
                <button className="chat-back" onClick={() => navigate("/")}>Home</button>
                <div>
                    <h2>Your Chats</h2>
                    <p>Buyer and seller conversations</p>
                </div>
            </div>

            <div className="chat-list">
                {chats.length === 0 ? (
                    <p className="empty-chat">No chats yet.</p>
                ) : (
                    chats.map((chat) => {
                        const otherUser = chat.buyerId?._id === userId ? chat.sellerId : chat.buyerId;
                        const lastMessage = chat.messages[chat.messages.length - 1];

                        return (
                            <button
                                key={chat._id}
                                className="chat-list-item"
                                onClick={() => navigate(`/chat/${chat._id}`)}
                            >
                                <strong>{chat.productId?.productname || "Product chat"}</strong>
                                <span>With {otherUser?.Name || otherUser?.email || "User"}</span>
                                <small>{lastMessage?.text || "No messages yet"}</small>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ChatList;
