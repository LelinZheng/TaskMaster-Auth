import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


function Dashboard() {
    const { token, isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      if (!isLoggedIn) {
        navigate('/login');
        return;
      }
  
      const fetchTasks = async () => {
        try {
          const res = await axios.get('http://localhost:3000/api/tasks', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setTasks(res.data);
        } catch (err) {
          setError('Failed to load tasks');
        } finally {
          setLoading(false);
        }
      };
  
      fetchTasks();
    }, [token, isLoggedIn, navigate]);
  
    if (loading) return <p>Loading your tasks...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
  
    return (
      <div>
        <h2>Your Tasks</h2>
        {tasks.length === 0 ? (
          <p>No tasks found. Add some!</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task._id}>
                <strong>{task.title}</strong> — {task.status}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  
  export default Dashboard;