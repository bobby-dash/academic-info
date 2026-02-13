import { useState } from 'react';
import axios from 'axios';
import './App.css';

const CATEGORIES = [
    { id: 'exam', icon: '📅', label: 'Exam Schedule', query: 'When is the next exam?' },
    { id: 'events', icon: '🎉', label: 'Events', query: 'What events are happening this week?' },
    { id: 'timetable', icon: '📚', label: 'Timetable', query: 'What is today\'s schedule?' },
    { id: 'holidays', icon: '🏖️', label: 'Holidays', query: 'What are the upcoming holidays?' },
];

function App() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAsk = async (customQuestion = null) => {
        const queryText = customQuestion || question;

        if (!queryText.trim()) {
            setError('Please enter a question');
            return;
        }

        setLoading(true);
        setError(null);
        setAnswer(null);

        try {
            // Using Vercel Proxy to call n8n (Fixes CORS locally)
            const response = await axios.post('/api/n8n', {
                question: queryText
            });

            if (response.data.success) {
                setAnswer(response.data);
            } else {
                setError('No answer found. Please try rephrasing your question.');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Failed to get answer. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = (query) => {
        setQuestion(query);
        handleAsk(query);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !loading) {
            handleAsk();
        }
    };

    return (
        <div className="app">
            <div className="background-animation"></div>

            <div className="container">
                {/* Header */}
                <header className="header">
                    <div className="logo-container">
                        <div className="logo-icon">🎓</div>
                    </div>
                    <h1 className="title">Academic Assistant</h1>
                    <p className="subtitle">Your intelligent companion for academic information</p>
                </header>

                {/* Quick Categories */}
                <div className="categories-grid">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category.id}
                            className="category-card"
                            onClick={() => handleCategoryClick(category.query)}
                            disabled={loading}
                        >
                            <span className="category-icon">{category.icon}</span>
                            <span className="category-label">{category.label}</span>
                        </button>
                    ))}
                </div>

                {/* Query Section */}
                <div className="query-section">
                    <div className="query-header">
                        <h2>Ask Your Question</h2>
                        <p>Type your academic query below and get instant answers</p>
                    </div>

                    <div className="input-group">
                        <input
                            type="text"
                            className="question-input"
                            placeholder="e.g., When is the next exam? What events are coming up?"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={loading}
                        />
                        <button
                            className="ask-button"
                            onClick={() => handleAsk()}
                            disabled={loading || !question.trim()}
                        >
                            {loading ? 'Thinking...' : 'Ask'}
                        </button>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p className="loading-text">Processing your question...</p>
                        </div>
                    )}

                    {/* Answer Display */}
                    {answer && !loading && (
                        <div className="answer-container">
                            <div className="answer-card">
                                <div className="answer-header">
                                    <span className="answer-icon">💡</span>
                                    <span className="answer-label">Answer</span>
                                    <span className={`confidence-badge ${answer.confidence}`}>
                                        {answer.confidence}
                                    </span>
                                </div>
                                <div className="answer-content">
                                    {answer.answer}
                                </div>
                                <div className="answer-footer">
                                    <span className="category-tag">{answer.category}</span>
                                    <span className="timestamp">
                                        {new Date(answer.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Display */}
                    {error && !loading && (
                        <div className="error-container">
                            <div className="error-card">
                                <span className="error-icon">⚠️</span>
                                <div className="error-content">
                                    <h3>Oops!</h3>
                                    <p>{error}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <footer className="footer">
                    <p>© 2026 Academic Assistant. Built with ❤️ for students.</p>
                </footer>
            </div>
        </div>
    );
}

export default App;
