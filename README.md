# TaskMaster-Auth

A full-stack task management web app built with **React**, **Node.js**, **Express**, **MongoDB**, and **JWT authentication**.  
Supports user registration, login, task creation/editing/deletion, search, sorting, and protected routes.

---

## Live Demo

- **Frontend:** [https://task-master-auth.vercel.app](https://task-master-auth.vercel.app)  
- **Backend API:** [https://taskmaster-auth.onrender.com](https://taskmaster-auth.onrender.com)

---

## Features

- ✅ JWT-based user authentication
- ✅ Register & login securely
- ✅ Protected routes (only show tasks for the logged-in user)
- ✅ Create, edit, delete tasks
- ✅ Sort by time added, priority, or status
- ✅ Search tasks by title/description
- ✅ Mobile-responsive UI with Bootstrap

---

## Tech Stack

### Frontend:
- React (with Hooks + Context)
- React Router
- Axios
- Bootstrap 5

### Backend:
- Node.js + Express
- MongoDB (via Mongoose)
- JWT for authentication
- CORS + dotenv + method-override
- Jest (for testing)

---

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- MongoDB Atlas account (or local MongoDB)
- Render and Vercel accounts for deployment

---

### Backend

```bash
git clone https://github.com/LelinZheng/TaskMaster-Auth.git
cd TaskMaster-Auth
npm install
```

#### Create `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

#### Start the backend:

```bash
node app.js
```

---

### Frontend

```bash
cd taskmaster-client
npm install
```

#### Create `.env` file:

```env
REACT_APP_API_BASE_URL=http://localhost:3000
```

#### Start the frontend:

```bash
npm start
```

---
## Automated Testing

Basic test setup included using [Jest](https://jestjs.io/).  
Run tests with:

```bash
npm test
```

## Manual Testing 

- Log in or register at `/login` or `/register`
- Navigate to `/dashboard`
- Try creating, editing, deleting, and sorting tasks
- Check protected routes (accessing dashboard without login should redirect)

---

## Deployment

- Backend deployed on **Render**
- Frontend deployed on **Vercel**
- Be sure to update your Vercel environment variable:

```env
REACT_APP_API_BASE_URL=https://taskmaster-auth.onrender.com
```

---

## Project Structure

```
TaskMaster-Auth/
├── app.js
├── models/
│   ├── user.js
│   └── task.js
├── middleware/
│   └── requireAuth.js
├── taskmaster-client/
│   ├── taskmaster-client/
│      ├── public/
│      ├── src/
│      │   ├── components/
│      │   │   ├── Layout.jsx
│      │   │   ├── TaskForm.jsx
│      │   │   ├── TaskList.jsx
│      │   │   └── Spinner.jsx
│      │   ├── pages/
│      │   │   ├── Dashboard.jsx
│      │   │   ├── Login.jsx
│      │   │   ├── Register.jsx
│      │   │   └── AddTask.jsx
│      │   ├── context/
│      │   │   └── AuthContext.js
│      │   ├── App.jsx
│      │   └── index.js
│      └── ...
```

---

## Credits

Built by **Lelin Zheng**  
Master’s in CS @ Northeastern University
---

## License

MIT – free to use, modify, and share.


---