// import React ,{useState} from "react";
// const SimpleAvatar = ({ size }) => (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
//       <circle cx="12" cy="7" r="4"></circle>
//     </svg>
//   );
// const AdminLogin = ({ onLogin, onNavigateToUserLogin }) => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [invalid, setInvalid] = useState(false);
  
//     const handleLogin = async () => {
//       try {
//         const response = await fetch('http://localhost:8000/admin-login', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ email, password })
//         });
        
//         if (response.ok) {
//           setInvalid(false);
//           const data = await response.json();
//           onLogin({ ...data, role: 'admin' });
//         } else {
//           setInvalid(true);
//         }
//       } catch (error) {
//         console.error("Error:", error);
//         setInvalid(true);
//       }
//     };
  
//     return (
//       <div className='login-container'>
//         <div className='login-form'>
//           <h2>Admin Login</h2>
//           <SimpleAvatar size={48} />
//           <div className='form-group'>
//             <label>Email:</label>
//             <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
//           </div>
//           <div className='form-group'>
//             <label>Password:</label>
//             <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//           </div>
//           {invalid && <p className='error-message'>Incorrect Email or password</p>}
//           <button className='login-button' onClick={handleLogin}>Login</button>
//           <button onClick={onNavigateToUserLogin}>Back to User Login</button>
//         </div>
//       </div>
//     );
//   };
//   export default AdminLogin
import React, { useState } from 'react';
import axios from 'axios';

const AdminLogin = ({ onLogin, onNavigateToUserLogin, errorMessage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAdminLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/admin-login', { email, password });
      if (response.status === 200) {
        onLogin(response.data.user); // Pass user data to App component
      }
    } catch (error) {
      console.error("Admin login error:", error);
    }
  };

  return (
    <div className='login-container'>
      <h2>Admin Login</h2>
      <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {errorMessage && <p className='error-message'>{errorMessage}</p>}
      <button onClick={handleAdminLogin}>Login</button>
      <button onClick={onNavigateToUserLogin}>User Login</button>
    </div>
  );
};

export default AdminLogin;
