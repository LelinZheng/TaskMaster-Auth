import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Register(){
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setform] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) =>{
        setform({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await axios.post('http://localhost:3000/api/register', form);
            login(res.data.token);
            navigate('/dashboard');
        }catch(err){
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" value={form.username} onChange={handleChange} placeholder="Username" required />
                <br />
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
                <br />
                <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" required />
                <br />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;
