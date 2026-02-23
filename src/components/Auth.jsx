import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Logo from './Logo';

const Auth = () => {
    const { signIn, signUp } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage('');

        try {
            if (isSignUp) {
                const { error } = await signUp(email, password);
                if (error) throw error;
                setMessage('Check your email for the confirmation link!');
            } else {
                const { error } = await signIn(email, password);
                if (error) throw error;
            }
        } catch (error) {
            setError(error.description || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass-card">
                <div className="auth-header">
                    <Logo size={48} className="logo-icon" />
                    <h1>Onetouch</h1>
                    <p>{isSignUp ? 'Create your account' : 'Sign in to your account'}</p>
                </div>

                <form onSubmit={handleAuth} className="auth-form">
                    {error && <div className="auth-error">{error}</div>}
                    {message && <div className="auth-success">{message}</div>}

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                        {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <button
                            type="button"
                            className="btn-link"
                            onClick={() => setIsSignUp(!isSignUp)}
                        >
                            {isSignUp ? 'Sign In' : 'Sign Up'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;
