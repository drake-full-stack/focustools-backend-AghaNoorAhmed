import { useState, useEffect } from "react";

export default function PomodoroTimer() {
  const [time, setTime] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let timer = null;
    if (running) {
      timer = setInterval(() => {
        setTime((t) => (t > 0 ? t - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [running]);

  function formatTime(t) {
    const min = Math.floor(t / 60);
    const sec = t % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  }

  return (
    <div className="timer-container">
      <h2>{formatTime(time)}</h2>

      <div className="timer-buttons">
        <button onClick={() => setRunning(true)}>Start</button>
        <button onClick={() => setRunning(false)}>Pause</button>
        <button onClick={() => setTime(25 * 60)}>Reset</button>
      </div>
    </div>
  );
}