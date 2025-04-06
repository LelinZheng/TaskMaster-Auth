/**
 * Register Component
 * A form for new users to create an account. Upon successful registration,
 * the JWT token is stored using the AuthContext and the user is redirected
 * to the dashboard.
 */
import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

function Register(){
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setform] = useState({username: '', email: '', password: ''});
    const [error, setError] = useState('');
    const baseUrl = process.env.REACT_APP_API_BASE_URL;

    /**
     * Handles input changes and updates form state
     * @param {React.ChangeEvent<HTMLInputElement>} e
     */
    const handleChange = (e) =>{
        setform({ ...form, [e.target.name]: e.target.value });
    };

    /**
     * Submits the registration form to the backend
     * Sends POST request with form data
     * If success, logs in the user and redirects to dashboard
     * If error, shows error message
     * @param {React.FormEvent<HTMLFormElement>} e
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent page refresh
        try{
            const res = await axios.post(`${baseUrl}/api/register`, form);
            login(res.data.token);
            navigate('/dashboard');
        }catch(err){
            // retrieve the error message or default message if server crashes
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <Layout>
            <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <div className="col-md-6">
                <div className="card shadow p-4">
                    <h2 className="mb-3 text-center">Register</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="Username"
                        className="form-control"
                        required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="form-control"
                        required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="form-control"
                        required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Register
                    </button>
                    </form>
                </div>
                </div>
            </div>
        </Layout>
    );
}

export default Register;
