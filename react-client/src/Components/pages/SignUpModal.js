import React from 'react';
import './SignUpModal.css';

function SignUpModal({ onClose }) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Gather form data
    const email = event.target.elements.email.value;
    const name = event.target.elements.name.value;
    const age = event.target.elements.age.value;
    const password = event.target.elements.password.value;

    // Create request body
    const requestBody = JSON.stringify({ email, name, age, password });

    try {
      // Send request to backend
      const response = await fetch('http://localhost:5260/api/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: requestBody
      });

      // Check if request was successful
      if (response.status === 409) {
        alert('Email already exists');
        return;
      }

      // Check if request was successful
      if (!response.ok) {
        throw new Error('Signup request failed');
      }

      // Handle successful request here, then close the modal
      onClose();
    } catch (error) {
      // Handle error here
      console.error(error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label>
              Email
              <input type="email" name="email" required />
            </label>
          </div>
          <div className="form-group">
            <label>
              Name
              <input type="text" name="name" required />
            </label>
          </div>
          <div className="form-group">
            <label>
              Age
              <input type="number" name="age" required />
            </label>
          </div>
          <div className="form-group">
            <label>
              Password
              <input type="password" name="password" required />
            </label>
          </div>
          <div className="form-group">
            <input type="submit" value="Sign Up" className="submit-button" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUpModal;