type IconProps = {
  className?: string;
  showIconTitle?: boolean;
  titleClassName?: string;
};

export function Icon({ className, showIconTitle = false, titleClassName }: IconProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg
        aria-hidden="true"
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          stroke="currentColor"
          strokeWidth="1.6"
          height="20"
          rx="5"
          width="20"
          x="2"
          y="2"
        />
        <path
          d="M6 12c1.5-3 3.5 3 6 0s4.5 3 6 0"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.7"
        />
      </svg>
      {showIconTitle ? (
        <span className={titleClassName ?? "font-semibold tracking-tight"}>
          DoodleDraw
        </span>
      ) : null}
    </span>
  );
}
