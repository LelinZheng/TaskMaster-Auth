/**
 * Spinner component - a loading indicator used during async operations.
 * - Uses Bootstrap's spinner class for styling
 * - Shown while data is being fetched (e.g. tasks, login, etc.)
 */
const Spinner = () => (
    <div className="d-flex justify-content-center my-4">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
  
  export default Spinner;