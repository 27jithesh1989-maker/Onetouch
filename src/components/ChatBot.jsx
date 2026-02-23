import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY || '');

const ChatBot = ({ transactions }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', content: 'Hello! I am your Onetouch AI assistant. How can I help you with your finances today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsTyping(true);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            // Prepare context about the app and user data
            const context = `
        You are an AI financial assistant for the "Onetouch" expense tracker app.
        Current App Features: Dashboard (overview), Add Transactions (Income/Expense), Profit & Loss analysis, Transaction History.
        User's Financial Summary:
        - Total Transactions: ${transactions.length}
        - Recent Transactions: ${JSON.stringify(transactions.slice(0, 5).map(t => ({ amount: t.amount, category: t.category, type: t.type })))}
        Give brief, helpful, and friendly advice. If they ask about their data, use the summary provided.
      `;

            const result = await model.generateContent([context, ...messages.map(m => m.content), userMessage]);
            const response = await result.response;
            const text = response.text();

            setMessages(prev => [...prev, { role: 'bot', content: text }]);
        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => [...prev, { role: 'bot', content: "Sorry, I'm having trouble connecting to my brain right now. Please try again later!" }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Chat Toggle Button */}
            <button
                className={`chat-toggle ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle AI Assistant"
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
                {!isOpen && <span className="chat-badge"><Sparkles size={12} /></span>}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chat-window animate-fade">
                    <div className="chat-header">
                        <div className="bot-info">
                            <div className="bot-avatar">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h4>Onetouch AI</h4>
                                <p>Personal Financial Assistant</p>
                            </div>
                        </div>
                        <button className="close-chat" onClick={() => setIsOpen(false)}><X size={18} /></button>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message-wrapper ${msg.role}`}>
                                <div className="message-icon">
                                    {msg.role === 'bot' ? <Bot size={14} /> : <User size={14} />}
                                </div>
                                <div className="message-content">
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="message-wrapper bot">
                                <div className="message-icon">
                                    <Bot size={14} />
                                </div>
                                <div className="message-content typing">
                                    <Loader2 className="animate-spin" size={14} />
                                    Thinking...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chat-input-area" onSubmit={handleSend}>
                        <input
                            type="text"
                            placeholder="Ask anything..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isTyping}
                        />
                        <button type="submit" className="send-btn" disabled={!input.trim() || isTyping}>
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default ChatBot;
