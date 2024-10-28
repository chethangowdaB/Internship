import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: '',
    username: '',
  });
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', formData);
      alert(response.data.message);
      const userData = { userId: response.data.userId, username: response.data.userDetails.username,avatar: response.data.userDetails.avatar};
      onLogin(userData);
      navigate(`/chat/${response.data.userId}`, { state: { username: response.data.username } });
    } catch (error) {
      console.error(error);
      alert('Login failed');
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          onChange={handleInputChange}
          required
          value={formData.phoneNumber}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleInputChange}
          required
          value={formData.password}
        />
        
        <button type="submit">Login</button>
      </form>
      <Link to="/signup">
        <button>Signup</button>
      </Link>
    </div>
  );
};

export default Login;
