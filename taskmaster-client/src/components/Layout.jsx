import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Layout({ children }) {
    const { isLoggedIn, logout } = useContext(AuthContext);
    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Bootstrap CDN */}
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
                integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
                crossOrigin="anonymous"
            />
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <Link className="navbar-brand" to="/">TaskMaster</Link>
                    <div className="collapse navbar-collapse">
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
            {/* Bootstrap JS */}
            <script
                src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
                crossOrigin="anonymous"
            ></script>
        </div>
  );
}

export default Layout;