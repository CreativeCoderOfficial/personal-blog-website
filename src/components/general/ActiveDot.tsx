// app/components/ActiveDot.tsx
interface ActiveDotProps {
  style: { left: number } | null;
}

export default function ActiveDot({ style }: ActiveDotProps) {
  if (!style) return null;

  return (
    <span
      className="
        absolute -bottom-2
        h-1 w-1 rounded-full
        bg-orange-400
        transition-all duration-300 ease-out
      "
      style={{ left: style.left }}
    />
  );
}
