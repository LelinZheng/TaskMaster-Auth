import { useState, useEffect } from 'react';

function TaskForm({ token, onCreate, onUpdate, editingTask, cancelEdit }) {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');


  useEffect(() => {
    if (editingTask) {
      setTaskData(editingTask);
    } else {
      setTaskData({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'Pending',
      });
    }
  }, [editingTask]);

  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const errors = {};
    if (!taskData.title.trim()) {
        errors.title = 'Title is required';
    }
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
      
    setSubmitting(true);
    try {
        if (editingTask) {
            await onUpdate(taskData);
          } else {
            await onCreate(taskData);
          }
        } catch (err) {
          console.error('Task submission failed:', err);
          setErrorMessage('Something went wrong while submitting the task.');
          setTimeout(() => setErrorMessage(''), 4000);
    } finally {
        setSubmitting(false);
    }
  };

  return (
        <>
            {errorMessage && (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            )}
            <form onSubmit={handleSubmit} className="mb-4">
                {/* Dynamically add 'is-invalid' class if there's a title validation error */}
                <input
                    type="text"
                    className={`form-control mb-2 ${formErrors.title ? 'is-invalid' : ''}`}
                    name="title"
                    value={taskData.title}
                    onChange={handleChange}
                    placeholder="Task Title"
                />
                {formErrors.title && <div className="invalid-feedback">{formErrors.title}</div>}
                <textarea
                    className="form-control mb-2"
                    name="description"
                    value={taskData.description}
                    onChange={handleChange}
                    placeholder="Description"
                />
                <label className="form-label badge bg-danger me-2" htmlFor="priority">Priority</label>
                <select
                    className="form-select mb-2"
                    name="priority"
                    value={taskData.priority}
                    onChange={handleChange}
                >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                </select>
                <label className="form-label badge bg-success" htmlFor="status">Task Status</label>
                <select
                    className="form-select mb-2"
                    name="status"
                    value={taskData.status}
                    onChange={handleChange}
                >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                </select>
                <button className="btn btn-primary" disabled={submitting}>
                {submitting ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" />
                        {editingTask ? 'Updating...' : 'Adding...'}
                    </>
                ) : (
                    editingTask ? 'Update Task' : 'Add Task'
                )}
                </button>
                {editingTask && (
                    <button type="button" className="btn btn-secondary ms-2" onClick={cancelEdit}>
                    Cancel
                    </button>
                )}
            </form>
        </>
    
  );
}

export default TaskForm;
