import React from 'react';
import './SignUpModal.css';
import UserContext from '../UserContext';

function LogInModal({ onClose }) {
  const { setUserData } = React.useContext(UserContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Gather form data
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;

    // Create request body
    const requestBody = JSON.stringify({ email, password });

    try {
      // Send request to backend
      const response = await fetch('http://localhost:5260/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: requestBody
      });

      if (response.status === 401) {
        alert('Invalid email or password');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        onClose();
      }
      else {
        throw new Error('Login request failed');
      }

    } catch (error) {
      // Handle error here
      console.error(error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2>Log In</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label>
              Email
              <input type="email" name="email" required />
            </label>
          </div>
          <div className="form-group">
            <label>
              Password
              <input type="password" name="password" required />
            </label>
          </div>
          <div className="form-group">
            <input type="submit" value="Log In" className="submit-button" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default LogInModal;