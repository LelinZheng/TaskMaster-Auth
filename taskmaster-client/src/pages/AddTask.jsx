/**
 * AddTask component
 * handles creation of a new task.
 * - Uses AuthContext to get the logged-in user's JWT token
 * - Sends a POST request to the backend to create a task
 * - Redirects the user back to the dashboard after successful creation
 * - Renders the TaskForm component in create mode
 */
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import TaskForm from '../components/TaskForm';

function AddTask() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  /**
   * Submits a new task to the backend.
   * @param {Object} formData - Task data submitted from the form
   */
  const handleCreate = async (formData) => {
    try {
      await axios.post(`${baseUrl}/api/tasks`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Create task failed:', err);
    }
  };

  return (
    <Layout>
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-8"> 
                    <h2>Create New Task</h2>
                    <TaskForm
                        token={token}
                        editingTask={null}
                        onCreate={handleCreate}
                        onUpdate={() => {}}
                        cancelEdit={() => navigate('/dashboard')}
                    />
                </div>
            </div>
        </div>
    </Layout>
  );
}

export default AddTask;
