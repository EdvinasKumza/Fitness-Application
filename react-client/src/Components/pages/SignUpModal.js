import React from 'react';
import './SignUpModal.css';
import { toast } from 'react-toastify';

function SignUpModal({ onClose, onSwitchToLogIn }) {
    const handleSubmit = async (event) => {
        event.preventDefault();
        const email = event.target.elements.email.value;
        const name = event.target.elements.name.value;
        const age = event.target.elements.age.value;
        const password = event.target.elements.password.value;

        const requestBody = JSON.stringify({ email, name, age, password });

        try {
            const response = await fetch('http://localhost:5260/api/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: requestBody
            });

            if (response.status === 409) {
                toast.error('Email already exists');
                return;
            }

            if (response.ok) {
                toast.success('Account created successfully');
            } else {
                throw new Error('Signup request failed');
            }

            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2 className="modal-title">Sign Up</h2>
                <form onSubmit={handleSubmit} className="signup-form">
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" required className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" name="name" required className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Age</label>
                        <input type="number" name="age" required className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" required className="form-control" />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Sign Up" className="submit-button" />
                    </div>
                    <div className="form-group switch-text">
                        Already have an account? <a href="#" onClick={onSwitchToLogIn}>Log In</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUpModal;

