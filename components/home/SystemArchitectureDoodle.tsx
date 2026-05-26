"use client";

import { useEffect, useRef, useState } from "react";

type Point = [number, number];

function rectPoint(x: number, y: number, w: number, h: number, d: number): Point {
  const perimeter = 2 * (w + h);
  let distance = ((d % perimeter) + perimeter) % perimeter;

  if (distance <= w) {
    return [x + distance, y];
  }

  distance -= w;
  if (distance <= h) {
    return [x + w, y + distance];
  }

  distance -= h;
  if (distance <= w) {
    return [x + w - distance, y + h];
  }

  distance -= w;
  return [x, y + h - distance];
}

function easeOut(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function segment(progress: number, start: number, end: number) {
  if (progress <= start) {
    return 0;
  }

  if (progress >= end) {
    return 1;
  }

  return easeOut((progress - start) / (end - start));
}

export function SystemArchitectureDoodle() {
  const [progress, setProgress] = useState(() => {
    if (typeof window === "undefined") {
      return 0;
    }

    return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0.66 : 0;
  });
  const frameRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const cycle = 6200;

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (motionQuery.matches) {
      return undefined;
    }

    const tick = (timestamp: number) => {
      startRef.current ??= timestamp;
      setProgress(((timestamp - startRef.current) % cycle) / cycle);
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const box1 = segment(progress, 0, 0.09);
  const arrow1 = segment(progress, 0.09, 0.14);
  const box2 = segment(progress, 0.14, 0.23);
  const arrow2 = segment(progress, 0.23, 0.28);
  const box3 = segment(progress, 0.28, 0.37);
  const arrow3 = segment(progress, 0.37, 0.42);
  const box4 = segment(progress, 0.42, 0.51);
  const labels = segment(progress, 0.51, 0.63);
  const globalOpacity =
    progress > 0.85 ? Math.max(0, 1 - (progress - 0.85) / 0.15) : 1;

  let cursor: Point = [85, 76];
  let showCursor = false;

  if (box1 > 0 && box1 < 1) {
    cursor = rectPoint(20, 40, 130, 72, box1 * 404);
    showCursor = true;
  } else if (arrow1 > 0 && arrow1 < 1) {
    cursor = [150 + arrow1 * 78, 76];
    showCursor = true;
  } else if (box2 > 0 && box2 < 1) {
    cursor = rectPoint(230, 40, 130, 72, box2 * 404);
    showCursor = true;
  } else if (arrow2 > 0 && arrow2 < 1) {
    cursor = [360 + arrow2 * 78, 76];
    showCursor = true;
  } else if (box3 > 0 && box3 < 1) {
    cursor = rectPoint(440, 40, 130, 72, box3 * 404);
    showCursor = true;
  } else if (arrow3 > 0 && arrow3 < 1) {
    cursor = [570 + arrow3 * 78, 76];
    showCursor = true;
  } else if (box4 > 0 && box4 < 1) {
    cursor = rectPoint(650, 40, 130, 72, box4 * 404);
    showCursor = true;
  }

  const ink = "var(--dd-text)";
  const mutedInk = "var(--dd-text-muted)";
  const dot = "var(--dd-border)";
  const fill = "var(--dd-surface)";
  const perimeter = 500;
  const arrowLength = 100;

  return (
    <div className="h-[208px] bg-[var(--dd-bg)] px-4 py-7 sm:px-9">
      <svg
        aria-label="DoodleDraw system architecture"
        className="h-full w-full overflow-visible"
        role="img"
        style={{ opacity: globalOpacity }}
        viewBox="0 0 820 160"
      >
        <defs>
          <pattern id="system-architecture-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="0.5" cy="0.5" r="0.7" fill={dot} />
          </pattern>
        </defs>
        <rect width="820" height="160" fill="url(#system-architecture-dots)" />

        <rect
          x="20"
          y="40"
          width="130"
          height="72"
          rx="6"
          fill={fill}
          stroke={ink}
          strokeDasharray={perimeter}
          strokeDashoffset={perimeter * (1 - box1)}
          strokeWidth="1.7"
        />
        <line
          x1="150"
          y1="76"
          x2="228"
          y2="76"
          stroke={ink}
          strokeDasharray={arrowLength}
          strokeDashoffset={arrowLength * (1 - arrow1)}
          strokeWidth="1.5"
        />
        <polygon points="224,73 230,76 224,79" fill={ink} opacity={arrow1 > 0.8 ? 1 : 0} />

        <rect
          x="230"
          y="40"
          width="130"
          height="72"
          rx="6"
          fill={fill}
          stroke={ink}
          strokeDasharray={perimeter}
          strokeDashoffset={perimeter * (1 - box2)}
          strokeWidth="1.7"
        />
        <line
          x1="360"
          y1="76"
          x2="438"
          y2="76"
          stroke={ink}
          strokeDasharray={arrowLength}
          strokeDashoffset={arrowLength * (1 - arrow2)}
          strokeWidth="1.5"
        />
        <polygon points="434,73 440,76 434,79" fill={ink} opacity={arrow2 > 0.8 ? 1 : 0} />

        <rect
          x="440"
          y="40"
          width="130"
          height="72"
          rx="6"
          fill="var(--dd-accent-bg)"
          stroke="var(--dd-accent)"
          strokeDasharray={perimeter}
          strokeDashoffset={perimeter * (1 - box3)}
          strokeWidth="1.7"
        />
        <line
          x1="570"
          y1="76"
          x2="648"
          y2="76"
          stroke={ink}
          strokeDasharray={arrowLength}
          strokeDashoffset={arrowLength * (1 - arrow3)}
          strokeWidth="1.5"
        />
        <polygon points="644,73 650,76 644,79" fill={ink} opacity={arrow3 > 0.8 ? 1 : 0} />

        <rect
          x="650"
          y="40"
          width="130"
          height="72"
          rx="6"
          fill={fill}
          stroke={ink}
          strokeDasharray={perimeter}
          strokeDashoffset={perimeter * (1 - box4)}
          strokeWidth="1.7"
        />

        <text x="85" y="74" textAnchor="middle" fontSize="12" fill={ink} opacity={labels}>
          App Router
        </text>
        <text x="85" y="91" textAnchor="middle" fontSize="10" fill={mutedInk} opacity={labels}>
          / /designs
        </text>
        <text x="295" y="74" textAnchor="middle" fontSize="12" fill={ink} opacity={labels}>
          Excalidraw
        </text>
        <text x="295" y="91" textAnchor="middle" fontSize="10" fill={mutedInk} opacity={labels}>
          editor client
        </text>
        <text
          x="505"
          y="74"
          textAnchor="middle"
          fontSize="12"
          fill="var(--dd-accent-text)"
          fontWeight="600"
          opacity={labels}
        >
          IndexedDB
        </text>
        <text x="505" y="91" textAnchor="middle" fontSize="10" fill="var(--dd-accent-text)" opacity={labels}>
          saved designs
        </text>
        <text x="715" y="74" textAnchor="middle" fontSize="12" fill={ink} opacity={labels}>
          Export
        </text>
        <text x="715" y="91" textAnchor="middle" fontSize="10" fill={mutedInk} opacity={labels}>
          thumbnails
        </text>

        {showCursor ? (
          <g opacity={0.9 * globalOpacity}>
            <circle cx={cursor[0]} cy={cursor[1]} r="6" fill="var(--dd-accent)" opacity="0.18" />
            <circle cx={cursor[0]} cy={cursor[1]} r="2.8" fill="var(--dd-accent)" />
          </g>
        ) : null}
      </svg>
    </div>
  );
}
