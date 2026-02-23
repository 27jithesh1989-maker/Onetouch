import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, Trash2, PieChart, TrendingUp, HelpCircle } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY || '');

const QUICK_ACTIONS = [
    { label: 'Analyze Spending', icon: <PieChart size={14} />, query: 'Can you analyze my spending patterns for this month?' },
    { label: 'Saving Tips', icon: <Sparkles size={14} />, query: 'Give me 3 personalized tips to save money based on my data.' },
    { label: 'Monthly Summary', icon: <TrendingUp size={14} />, query: 'Summarize my income and expenses for the current month.' },
    { label: 'Help', icon: <HelpCircle size={14} />, query: 'What features does Onetouch have and how do I use them?' }
];

const ChatBot = ({ transactions }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', content: "Hi! I'm your Onetouch AI. I can analyze your transactions, give saving tips, or help you navigate the app. What's on your mind?" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const stats = useMemo(() => {
        const now = new Date();
        const start = startOfMonth(now);
        const end = endOfMonth(now);

        const currentMonth = transactions.filter(t =>
            isWithinInterval(new Date(t.date || t.created_at), { start, end })
        );

        const income = currentMonth.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
        const expense = currentMonth.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);

        const topCategory = currentMonth
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
                return acc;
            }, {});

        const sortedCats = Object.entries(topCategory).sort((a, b) => b[1] - a[1]);

        return {
            income,
            expense,
            balance: income - expense,
            topCategory: sortedCats[0] ? `${sortedCats[0][0]} (₹${sortedCats[0][1]})` : 'None yet',
            count: currentMonth.length
        };
    }, [transactions]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const clearChat = () => {
        if (window.confirm('Clear chat history?')) {
            setMessages([{ role: 'bot', content: "Chat cleared. How else can I help you today?" }]);
        }
    };

    const handleSend = async (customQuery) => {
        const userMessage = typeof customQuery === 'string' ? customQuery : input.trim();
        if (!userMessage || isTyping) return;

        if (!customQuery) setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsTyping(true);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const systemPrompt = `
        You are an expert financial advisor for the Onetouch app. 
        User Data for ${format(new Date(), 'MMMM yyyy')}:
        - Total Transactions: ${stats.count}
        - Total Income: ₹${stats.income}
        - Total Expenses: ₹${stats.expense}
        - Net Balance: ₹${stats.balance}
        - Highest Spending Category: ${stats.topCategory}
        
        Guidelines:
        1. Be concise, professional, and friendly.
        2. Use bullet points for lists.
        3. Use ₹ for currency.
        4. If the user asks for analysis, reference their actual numbers above.
        5. If they ask about app features, mention: Dashboard, P&L Summary, Adding Transactions, and History.
      `;

            const result = await model.generateContent([systemPrompt, ...messages.slice(-5).map(m => m.content), userMessage]);
            const response = await result.response;
            let text = response.text();

            setMessages(prev => [...prev, { role: 'bot', content: text }]);
        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => [...prev, { role: 'bot', content: "Oops! I hit a snag. Please check your internet or API key and try again." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            <button
                className={`chat-toggle ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle AI Assistant"
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
                {!isOpen && <span className="chat-badge"><Sparkles size={12} /></span>}
            </button>

            {isOpen && (
                <div className="chat-window animate-fade">
                    <div className="chat-header">
                        <div className="bot-info">
                            <div className="bot-avatar"><Bot size={20} /></div>
                            <div>
                                <h4>Onetouch Assistant</h4>
                                <div className="online-status"><span className="dot"></span> Online</div>
                            </div>
                        </div>
                        <div className="header-actions">
                            <button className="icon-btn" onClick={clearChat} title="Clear Chat"><Trash2 size={16} /></button>
                            <button className="icon-btn" onClick={() => setIsOpen(false)}><X size={18} /></button>
                        </div>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message-wrapper ${msg.role}`}>
                                <div className="message-icon">
                                    {msg.role === 'bot' ? <Bot size={14} /> : <User size={14} />}
                                </div>
                                <div className="message-content shadow-sm">
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="message-wrapper bot">
                                <div className="message-icon"><Bot size={14} /></div>
                                <div className="message-content typing">
                                    <span className="dot-pulse"></span>
                                    Analyzing your finances...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-footer">
                        <div className="quick-actions">
                            {QUICK_ACTIONS.map((action, i) => (
                                <button
                                    key={i}
                                    className="action-chip"
                                    onClick={() => handleSend(action.query)}
                                    disabled={isTyping}
                                >
                                    {action.icon}
                                    {action.label}
                                </button>
                            ))}
                        </div>
                        <form className="chat-input-area" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                            <input
                                type="text"
                                placeholder="Type your question..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={isTyping}
                            />
                            <button type="submit" className="send-btn" disabled={!input.trim() || isTyping}>
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBot;
