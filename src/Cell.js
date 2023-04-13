export default function Cell({ onCellClick, onCellRightClick, value/*, cn*/ }) {
  return (
    <button
      // className={cn}
      onClick={onCellClick}
      onContextMenu={onCellRightClick}
    >
      {value}
    </button>
  );
}
