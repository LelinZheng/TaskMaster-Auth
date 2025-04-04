import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import Spinner from '../components/Spinner';

function Dashboard() {
    const { token, isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [editingTask, setEditingTask] = useState(null);
    const [deletingTaskId, setDeletingTaskId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    

    useEffect(() => {
      if (!isLoggedIn) { // This check protects that route by redirecting to /login
        navigate('/login');
        return;
      }
  
      const fetchTasks = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:3000/api/tasks', {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });
            setTasks(res.data);
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Failed to load tasks');
        } finally {
            setLoading(false);
        }
      };
  
      fetchTasks();
    }, [token, isLoggedIn, navigate]);

    const handleDelete = async (taskId) => {
        setDeletingTaskId(taskId);
        try {
            await axios.delete(`http://localhost:3000/api/tasks/${taskId}`, {
            headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(tasks.filter(task => task._id !== taskId));
        } catch (err) {
            setError('Failed to delete task');
        } finally {
            setDeletingTaskId(null);
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

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (sortBy === 'priority') {
          const order = { High: 1, Medium: 2, Low: 3 };
          return order[a.priority] - order[b.priority];
        } else if (sortBy === 'status') {
          const order = { Pending: 1, 'In Progress': 2, Completed: 3 };
          return order[a.status] - order[b.status];
        } else {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
    });
  
    if (error) return <Layout><p style={{ color: 'red' }}>{error}</p></Layout>;
  
    return (
        <Layout>
            <div className="container">
                <div className="row justify-content-center">
                    {/* Size will adapt on different screen (mobile/laptop/pad)*/}
                    
                    <div className="col-12 col-md-10 col-lg-8">
                        <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {/* Edit Task Section */}
                        {editingTask && (
                            <div className="card shadow-sm p-4 mb-4 border bg-light-subtle">
                            <h5 className="text-center text-main mb-3">Editing Task: {editingTask.title}</h5>
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
                        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                            <h2 className="mb-0">Your Tasks</h2>
                            <div className="d-flex align-items-center gap-2">
                                <label htmlFor="sort" className="form-label mb-0 me-1 text-nowrap">Sort by:</label>
                                <select
                                    className="form-select mb-3"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="createdAt">Time Added</option>
                                    <option value="priority">Priority</option>
                                    <option value="status">Status</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            {loading ? <Spinner />: 
                                <TaskList 
                                    tasks={sortedTasks}
                                    onEdit={handleEdit} 
                                    onDelete={handleDelete} 
                                    editingTaskId={editingTask?._id} 
                                    deletingTaskId={deletingTaskId}
                                />
                            }     
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
  }
  
  export default Dashboard;