/**
 * TaskList Component
 *
 * - Renders a list of tasks
 * - Provides Edit and Delete buttons for each task
 * - Highlights priority and status using Bootstrap badges
 * - Shows a spinner when a task is being deleted
 * - Displays a message if no tasks are found
 */
import { Link } from 'react-router-dom';

function TaskList({ tasks, onEdit, onDelete, editingTaskId, deletingTaskId}) {
    if (tasks.length === 0) {
      return (
        <div className="text-center mt-4">
          <p>No tasks found. <Link to="/add-task" className="btn btn-sm btn-primary ms-2">Add a Task</Link></p>
        </div>
      );
    }
    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'High':
            return 'bg-danger';
            case 'Medium':
            return 'bg-info';
            case 'Low':
            return 'bg-secondary';
            default:
            return 'bg-info';
        }
        };
        
        const getStatusClass = (status) => {
        switch (status) {
            case 'Pending':
            return 'bg-secondary';
            case 'In Progress':
            return 'bg-warning';
            case 'Completed':
            return 'bg-success';
            default:
            return 'bg-secondary';
        }
    };
  
    return (
      <ul className="list-group">
        {tasks.map((task) => (
          <li className="list-group-item" key={task._id}>
             <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div>
                    <strong>{task.title}</strong> 
                </div>
                <div>
                    <span className={`badge ${getStatusClass(task.status)}`}>{task.status}</span>
                </div>
            </div>
            <div className="d-flex justify-content-between flex-wrap">
                <div className="flex-grow-1 me-2 text-break">
                    {task.description}
                </div>
                <div className="text-end">
                    <span className={`badge ${getPriorityClass(task.priority)}`}>Priority: {task.priority}</span>
                </div>
            </div>
            <div className="mt-3 d-flex gap-2 flex-wrap">
                {editingTaskId !== task._id && (
                    <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(task)}>Edit</button>
                )}
                <button
                    className="btn btn-danger btn-sm"
                    disabled={deletingTaskId === task._id}
                    onClick={() => onDelete(task._id)}
                >
                    {deletingTaskId === task._id ? (
                        <span className="spinner-border spinner-border-sm" role="status" />
                    ) : (
                        'Delete'
                    )}
                </button>
            </div>
          </li>
        ))}
      </ul>
    );
  }
  
  export default TaskList;