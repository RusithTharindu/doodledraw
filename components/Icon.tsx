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
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          className="fill-white"
          height="27"
          rx="7"
          width="27"
          x="2.5"
          y="2.5"
        />
        <path
          d="M9 21.5c3.7 2.2 9.4 1.8 13.4-1.2"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2.2"
        />
        <path
          d="M9.4 17.4 18.9 7.9c.8-.8 2.1-.8 2.9 0l2.3 2.3c.8.8.8 2.1 0 2.9l-9.5 9.5-5.3 1.3 1.1-5.5Z"
          className="fill-emerald-100"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <path
          d="m17.4 9.4 5.2 5.2"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <rect
          height="27"
          rx="7"
          stroke="currentColor"
          strokeWidth="2"
          width="27"
          x="2.5"
          y="2.5"
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
