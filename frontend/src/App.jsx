// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import './App.css';
import TaskList from './components/TaskList';
import PomodoroTimer from './components/PomodoroTimer';
import { getTasks, createTask, updateTask, deleteTask } from './api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError('Failed to load tasks. Make sure your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const newTask = await createTask({ title: newTaskTitle });
      setTasks([newTask, ...tasks]);
      setNewTaskTitle('');
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to add task');
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find((t) => t._id === taskId);
      const updatedTask = await updateTask(taskId, {
        completed: !task.completed,
      });

      setTasks(
        tasks.map((t) => (t._id === taskId ? updatedTask : t))
      );
    } catch (err) {
      console.error('Error toggling task:', err);
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((t) => t._id !== taskId));
      if (activeTask?._id === taskId) {
        setActiveTask(null);
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task');
    }
  };

  const handleSelectTask = (task) => {
    setActiveTask(task);
  };

  const handlePomodoroComplete = async () => {
    if (!activeTask) return;

    try {
      const updatedTask = await updateTask(activeTask._id, {
        pomodoroCount: (activeTask.pomodoroCount || 0) + 1,
      });

      setTasks(
        tasks.map((t) =>
          t._id === activeTask._id ? updatedTask : t
        )
      );
      setActiveTask(updatedTask);
    } catch (err) {
      console.error('Error updating Pomodoro count:', err);
      setError('Failed to update Pomodoro count');
    }
  };

  if (loading) {
    return (
      <div className="app loading">
        <div className="spinner"></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header>
        <h1>🍅 FocusTools</h1>
        <p>Pomodoro Timer + Task Manager</p>
      </header>

      {error && (
        <div className="error-banner">
          ⚠️ {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <div className="main-content">
        <div className="task-section">
          <h2>Tasks</h2>

          <form onSubmit={handleAddTask} className="add-task-form">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="What do you need to focus on?"
              className="task-input"
            />
            <button type="submit" className="add-button">
              Add Task
            </button>
          </form>

          <TaskList
            tasks={tasks}
            activeTask={activeTask}
            onSelectTask={handleSelectTask}
            onToggleComplete={handleToggleComplete}
            onDeleteTask={handleDeleteTask}
          />
        </div>

        <div className="timer-section">
          <h2>Focus Time</h2>
          {activeTask ? (
            <>
              <div className="active-task-display">
                <p>Working on:</p>
                <h3>{activeTask.title}</h3>
                <p className="pomodoro-count">
                  🍅 {activeTask.pomodoroCount || 0} Pomodoro
                  {(activeTask.pomodoroCount || 0) !== 1 ? 's' : ''}{' '}
                  completed
                </p>
              </div>
              <PomodoroTimer onComplete={handlePomodoroComplete} />
            </>
          ) : (
            <div className="no-task-selected">
              <p>← Select a task to start focusing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
