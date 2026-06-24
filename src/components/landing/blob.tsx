export function Blob({
  className,
  color = "primary",
}: {
  className?: string;
  color?: "primary" | "accent";
}) {
  const fill = color === "primary" ? "var(--color-primary)" : "var(--color-accent)";
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 200"
      className={className}
      style={{ pointerEvents: "none" }}
    >
      <path
        fill={fill}
        d="M44.8,-67.5C56.8,-58.4,64.6,-43.7,69.4,-28.6C74.2,-13.5,76,2,71.6,15.7C67.1,29.4,56.5,41.3,44,51.6C31.4,62,17,70.7,0.6,69.9C-15.8,69,-31.6,58.6,-44.7,47C-57.8,35.5,-68.2,22.8,-71.7,8.1C-75.2,-6.6,-71.8,-23.4,-62.5,-35.6C-53.3,-47.8,-38.2,-55.4,-23.7,-62.9C-9.2,-70.5,4.8,-78,18.7,-77.1C32.6,-76.2,46.4,-66.9,44.8,-67.5Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}
