import { useState, useEffect } from "react";
import "./App.css";
import TaskList from "./components/TaskList";
import PomodoroTimer from "./components/PomodoroTimer";
import { getTasks, createTask } from "./api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Load tasks from backend
  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error("Error loading tasks:", err);
    }
  };

  // Run on first render
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTasks();
  }, []);

  // Add a new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    await createTask({ title: newTask });
    setNewTask("");
    loadTasks(); // refresh list
  };

  return (
    <div className="app-container">
      <h1>FocusTools</h1>

      {/* Add Task */}
      <form className="add-task-form" onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="New Task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {/* Task List */}
      <TaskList tasks={tasks} refresh={loadTasks} />

      {/* Pomodoro Timer */}
      <PomodoroTimer />
    </div>
  );
}

export default App;
