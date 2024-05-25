import React from 'react';
import './SignUpModal.css'; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LogInModal({ onClose, onSwitchToSignUp }) {
    const handleSubmit = async (event) => {
        event.preventDefault();
        const email = event.target.elements.email.value;
        const password = event.target.elements.password.value;

        const requestBody = JSON.stringify({ email, password });

        try {
            const response = await fetch('http://localhost:5260/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: requestBody
            });

            if (response.status === 401) {
                toast.error('Invalid email or password');
                return;
            }

            if (response.ok) {
                const data = await response.json();

                if (data.token) {
                    localStorage.setItem('jwtToken', data.token);
                    localStorage.setItem('name', data.name);
                    onClose();
                } else {
                    throw new Error('No token received');
                }
            } else {
                throw new Error('Login request failed');
            }

        } catch (error) {
            console.error(error);
            toast.error('Invalid email or password');
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>Log In</h2>
                <form onSubmit={handleSubmit} className="signup-form">
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" required className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" required className="form-control" />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Log In" className="submit-button" />
                    </div>
                    <div className="form-group switch-text">
                        Don't have an account? <a href="#" onClick={onSwitchToSignUp}>Sign Up</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LogInModal;

