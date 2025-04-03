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
  
    if (error) return <Layout><p style={{ color: 'red' }}>{error}</p></Layout>;
  
    return (
        <Layout>
            <div className="row">
                <div className="col-6 offset-3">
                    <div className="mb-3">
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
                        <h2 className="card-title mb-3">Your Tasks</h2>
                        <div>
                            {loading ? <Spinner />: 
                                <TaskList 
                                    tasks={tasks} 
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