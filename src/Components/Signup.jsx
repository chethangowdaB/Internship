import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: '',
    username: '',
    avatar: null,
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, avatar: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('phoneNumber', formData.phoneNumber);
    form.append('password', formData.password);
    form.append('username', formData.username);
    if (formData.avatar) {
      form.append('avatar', formData.avatar);
    }

    try {
      const response = await axios.post('http://localhost:3000/signup', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data.message);
      navigate('/');
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        placeholder="Username"
        onChange={handleInputChange}
        required
      />
      <input
        type="text"
        name="phoneNumber"
        placeholder="Phone Number"
        onChange={handleInputChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleInputChange}
        required
      />
      <input
        type="file"
        name="avatar"
        accept="image/*"
        onChange={handleFileChange}
      />
      <button type="submit">Signup</button>
    </form>
  );
};

export default Signup;
