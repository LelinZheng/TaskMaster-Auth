import { Link } from 'react-router-dom';

function TaskList({ tasks, onEdit, onDelete, editingTaskId, deletingTaskId}) {
    if (tasks.length === 0) {
      return (
        <div className="text-center mt-4">
          <p>No tasks found. <Link to="/add-task" className="btn btn-sm btn-primary ms-2">Add a Task</Link></p>
        </div>
      );
    }
  
    return (
      <ul className="list-group">
        {tasks.map((task) => (
          <li className="list-group-item" key={task._id}>
             <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
                <div>
                    <strong>{task.title}</strong> — <span className="badge bg-secondary">{task.status}</span>
                </div>
                <div>
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
            </div>
            <div className="mt-2">
                <span className="badge bg-success me-2">Priority: {task.priority}</span>
                {task.description}
            </div>
          </li>
        ))}
      </ul>
    );
  }
  
  export default TaskList;