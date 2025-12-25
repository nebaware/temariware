import React, { useState } from 'react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem('tm_token', 'demo-token');
        window.location.hash = '#/home';
    };

    return (
        <div style={{ minHeight: '100vh', background: 'black', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: '#1e293b', padding: '40px', borderRadius: '10px', width: '100%', maxWidth: '400px' }}>
                <h1 style={{ textAlign: 'center', color: '#14F195', marginBottom: '30px' }}>TemariWare</h1>
                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #374151', borderRadius: '5px', color: 'white' }}
                            placeholder="demo@temariware.com"
                        />
                    </div>
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #374151', borderRadius: '5px', color: 'white' }}
                            placeholder="demo123"
                        />
                    </div>
                    <button
                        type="submit"
                        style={{ width: '100%', padding: '12px', background: '#14F195', color: 'black', border: 'none', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

const HomePage = () => {
    return (
        <div style={{ minHeight: '100vh', background: 'black', color: 'white', padding: '20px' }}>
            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                <h1 style={{ textAlign: 'center', color: '#14F195', marginBottom: '30px' }}>TemariWare</h1>
                
                <div style={{ background: '#1e293b', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                    <h2>Demo User</h2>
                    <p>Balance: 1,250 ETB</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <a href="/jobs.html" style={{ display: 'block', padding: '15px', background: '#14F195', color: 'black', textDecoration: 'none', borderRadius: '5px', textAlign: 'center', fontWeight: 'bold' }}>
                        💼 Jobs
                    </a>
                    <a href="/courses.html" style={{ display: 'block', padding: '15px', background: '#14F195', color: 'black', textDecoration: 'none', borderRadius: '5px', textAlign: 'center', fontWeight: 'bold' }}>
                        📚 Courses
                    </a>
                    <a href="/wallet.html" style={{ display: 'block', padding: '15px', background: '#14F195', color: 'black', textDecoration: 'none', borderRadius: '5px', textAlign: 'center', fontWeight: 'bold' }}>
                        💰 Wallet
                    </a>
                    <a href="/profile.html" style={{ display: 'block', padding: '15px', background: '#14F195', color: 'black', textDecoration: 'none', borderRadius: '5px', textAlign: 'center', fontWeight: 'bold' }}>
                        👤 Profile
                    </a>
                </div>
            </div>
        </div>
    );
};

const App = () => {
    const [currentPage, setCurrentPage] = useState(() => {
        const hash = window.location.hash;
        if (hash === '#/home' || hash === '#/') return 'home';
        return 'login';
    });

    React.useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash === '#/home' || hash === '#/') setCurrentPage('home');
            else setCurrentPage('login');
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    if (currentPage === 'home') {
        return <HomePage />;
    }

    return <LoginPage />;
};

export default App;