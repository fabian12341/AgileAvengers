// components/Progress.tsx
import { ProgressProps } from "@/app/types/Progress";

export default function Progress({
  label,
  value,
  color = "blue",
}: ProgressProps) {
  const radius = 50;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center mx-4 my-2">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#4B5563" // fondo gris oscuro
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset, transition: "stroke-dashoffset 0.35s" }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="text-white mt-2 text-sm text-center">
        <strong>{label}</strong>
        <div>{value.toFixed(2)}%</div>
      </div>
    </div>
  );
}
