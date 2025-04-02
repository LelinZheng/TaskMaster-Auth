import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

function Dashboard() {
    const { token, isLoggedIn } = useContext(AuthContext);
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'Pending'
      });
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

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
          const res = await axios.post('http://localhost:3000/api/tasks', newTask, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setTasks([...tasks, res.data]); // Add the new task to the list
          setNewTask({ title: '', description: '', priority: 'Medium', status: 'Pending' }); // Reset form
        } catch (err) {
          setError('Failed to create task');
        }
      };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
  
    if (loading) return <p>Loading your tasks...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
  
    return (
        <Layout>
            <button onClick={handleLogout}>Log Out</button>
        <h2>Your Tasks</h2>
  
        {/* Create Task Form */}
        <form onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />
          <br />
          <textarea
            placeholder="Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <br />
          <select
            value={newTask.priority}
            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <br />
          <select
            value={newTask.status}
            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <br />
          <button type="submit">Add Task</button>
        </form>
  
        {/* Show task list */}
        {tasks.length === 0 ? (
          <p>No tasks found. Add some!</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task._id}>
                <strong>{task.title}</strong> — {task.priority} priority: {task.status}
                <p>{task.description}</p>
              </li>
            ))}
          </ul>
        )}
      </Layout>
    );
  }
  
  export default Dashboard;