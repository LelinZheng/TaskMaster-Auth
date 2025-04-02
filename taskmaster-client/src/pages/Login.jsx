import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({email: '', password: ''});
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await axios.post('http://localhost:3000/api/login', form);
            console.log("Login successful, token:", res.data.token);
            login(res.data.token);
            navigate('/dashboard');
            console.log("Navigating to dashboard...");
        }catch(err){
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
                <br />
                <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" required />
                <br />
                <button type="submit">Log In</button>
            </form>
        </div>
        
);
}

export default Login;