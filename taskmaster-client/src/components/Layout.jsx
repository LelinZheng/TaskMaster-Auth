import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Layout({ children }) {
    const { isLoggedIn, logout } = useContext(AuthContext);
    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                    <Link className="navbar-brand" to="/">TaskMaster</Link>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        {/* LEFT side links for logged-in users */}
                        {isLoggedIn && (
                            <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/dashboard">Dashboard</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/add-task">Add Task</Link>
                            </li>
                            </ul>
                        )}

                        {/* RIGHT side links */}
                        <ul className="navbar-nav ms-auto">
                            {!isLoggedIn ? (
                            <>
                                <li className="nav-item">
                                <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                <Link className="nav-link" to="/register">Register</Link>
                                </li>
                            </>
                            ) : (
                            <li className="nav-item">
                                <button onClick={logout} className="btn btn-sm btn-outline-light">Logout</button>
                            </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
            {/* Main Content */}
            <main className="container my-5 flex-grow-1">
                {children} 
            </main>
            {/* Footer */}
            <footer className="bg-light py-3 mt-auto text-center">
                <div className="container">
                <small className="text-muted">&copy;TaskMaster 2025</small>
                </div>
            </footer>
        </div>
  );
}

export default Layout;