import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

function Dashboard() {
    const { token, isLoggedIn } = useContext(AuthContext);
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [editingTask, setEditingTask] = useState(null);
    
  
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

    const handleCreate = async (taskData) => {
        try {
          const res = await axios.post('http://localhost:3000/api/tasks', taskData, {
            headers: {Authorization: `Bearer ${token}`},
          });
          setTasks([...tasks, res.data]);
        } catch (err) {
          setError('Failed to create task');
        }
      };

    const handleDelete = async (taskId) => {
    try {
        await axios.delete(`http://localhost:3000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(tasks.filter(task => task._id !== taskId));
    } catch (err) {
        setError('Failed to delete task');
    }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
    };
      
    const handleUpdate = async (taskData) => {
        try {
            const res = await axios.put(`http://localhost:3000/api/tasks/${editingTask._id}`, taskData, {
            headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(tasks.map(task => task._id === res.data._id ? res.data : task));
            setEditingTask(null);
        } catch (err) {
            setError('Failed to update task');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
  
    if (loading) return <Layout><p>Loading your tasks...</p></Layout>;
    if (error) return <Layout><p style={{ color: 'red' }}>{error}</p></Layout>;
  
    return (
        <Layout>
            <div className="row">
                <div className="col-6 offset-3">
                    <div className="mb-3">
                            {/* Edit Task Section */}
                            {editingTask && (
                                <div className="card shadow-sm p-4 mb-4 border bg-light-subtle">
                                <h5 className="text-center text-primary mb-3">Editing Task: {editingTask.title}</h5>
                                <TaskForm
                                    token={token}
                                    editingTask={editingTask}
                                    onCreate={() => {}}
                                    onUpdate={handleUpdate}
                                    cancelEdit={() => setEditingTask(null)}
                                />
                                </div>
                            )}
                        {/* Task List */}
                        <h2 className="card-title">Your Tasks</h2>
                        <TaskList tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} editingTaskId={editingTask?._id}/>
                    </div>
                </div>
            </div>
        </Layout>
    );
  }
  
  export default Dashboard;