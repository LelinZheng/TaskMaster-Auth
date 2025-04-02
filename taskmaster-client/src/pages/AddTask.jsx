import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import TaskForm from '../components/TaskForm';

function AddTask() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    try {
      await axios.post('http://localhost:3000/api/tasks', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Create task failed:', err);
    }
  };

  return (
    <Layout>
        <div className="row">
            <div className="col-6 offset-3">
                <div className="mb-3">
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
