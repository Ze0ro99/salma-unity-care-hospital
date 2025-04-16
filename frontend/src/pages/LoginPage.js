import React, { useState } from 'react';
import './LoginPage.css'; // Importing CSS for styling
import { useHistory } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        // Simulate an API call for user authentication
        try {
            // Replace with actual API call
            const response = await fakeApiLogin(email, password);
            if (response.success) {
                // Redirect to dashboard on successful login
                history.push('/dashboard');
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    // Simulated API login function (replace with actual API call)
    const fakeApiLogin = (email, password) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (email === 'test@example.com' && password === 'password') {
                    resolve({ success: true });
                } else {
                    resolve({ success: false, message: 'Invalid email or password.' });
                }
            }, 1000);
        });
    };

    return (
        <div className="login-page">
            <h1>Login to Salma Unity Care Hospital</h1>
            <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="login-button">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;
