export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className={`task-item${task.done ? ' done' : ''}`}>
      <label>
        <input type="checkbox" checked={task.done} onChange={() => onToggle(task.id)} />
        <span className="task-title">{task.title}</span>
      </label>
      <button
        type="button"
        className="delete-button"
        onClick={() => onDelete(task.id)}
        aria-label={`「${task.title}」を削除`}
      >
        削除
      </button>
    </li>
  )
}
