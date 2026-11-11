import { useState } from 'react'
import TaskItem from './TaskItem.jsx'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [text, setText] = useState('')

  const addTask = (e) => {
    e.preventDefault()
    const title = text.trim()
    if (!title) return
    setTasks((prev) => [...prev, { id: crypto.randomUUID(), title, done: false }])
    setText('')
  }

  const toggleTask = (id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const doneCount = tasks.filter((t) => t.done).length

  return (
    <main className="board">
      <h1>タスクボード</h1>

      <form className="add-form" onSubmit={addTask}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="新しいタスクを入力"
          aria-label="新しいタスク"
        />
        <button type="submit" disabled={!text.trim()}>
          追加
        </button>
      </form>

      {tasks.length === 0 ? (
        <p className="empty">タスクはまだありません</p>
      ) : (
        <>
          <ul className="task-list">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
            ))}
          </ul>
          <p className="summary">
            完了 {doneCount} / {tasks.length}
          </p>
        </>
      )}
    </main>
  )
}
