import { Link } from 'react-router-dom';

function Layout({ children }) {
  return (
    <div className="container mt-4">
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <Link className="navbar-brand" to="/">TaskMaster</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav">
            <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
          </ul>
        </div>
      </nav>

      {children}
    </div>
  );
}

export default Layout;