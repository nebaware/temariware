import React, { useState } from 'react';

export const MinimalLoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Store token and redirect
        localStorage.setItem('tm_token', 'test-token');
        window.location.hash = '#/';
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: 'black',
            color: 'white',
            padding: '20px'
        }}>
            <div style={{ 
                width: '100%', 
                maxWidth: '400px',
                backgroundColor: '#1e293b',
                padding: '40px',
                borderRadius: '10px'
            }}>
                <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>TemariWare Login</h1>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#0f172a',
                                border: '1px solid #374151',
                                borderRadius: '5px',
                                color: 'white'
                            }}
                            placeholder="demo@temariware.com"
                        />
                    </div>
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#0f172a',
                                border: '1px solid #374151',
                                borderRadius: '5px',
                                color: 'white'
                            }}
                            placeholder="demo123"
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#14F195',
                            color: 'black',
                            border: 'none',
                            borderRadius: '5px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};