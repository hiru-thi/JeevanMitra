export default function FollowUpSwitch({ checked, label, onLabel, offLabel, className = '', onChange }) {
  return (
    <button
      type="button"
      className={`isolation-switch ${className}`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
    >
      <span className="switch-track" aria-hidden="true" />
      <span>{checked ? onLabel : offLabel}</span>
    </button>
  )
}