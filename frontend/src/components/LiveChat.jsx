import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { SITE } from '../config';

const DISMISS_KEY = 'imototo-livechat-dismissed';
const POS_KEY = 'imototo-livechat-pos';
const DRAG_THRESHOLD = 8;
const OFF_SCREEN_MARGIN = 48;

function ChatAvatar() {
  return (
    <span className="live-chat__avatar" aria-hidden="true">
      <svg className="live-chat__person" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M4.5 19.75c0-3.15 2.85-5.5 7.5-5.5s7.5 2.35 7.5 5.5H4.5z"
        />
        <circle cx="12" cy="9" r="4.35" fill="currentColor" />
        <g className="live-chat__shades">
          <rect x="7.35" y="7.85" width="3.35" height="2.35" rx="1.1" />
          <rect x="13.3" y="7.85" width="3.35" height="2.35" rx="1.1" />
          <rect x="10.45" y="8.55" width="3.1" height="0.75" rx="0.38" />
        </g>
        <path
          className="live-chat__smile"
          d="M10.15 12.05c0.55 0.65 1.35 1 2.85 1s2.3-0.35 2.85-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
      </svg>
      <span className="live-chat__status" title="Online" />
    </span>
  );
}

function clampPosition(x, y, w, h) {
  const pad = 10;
  const maxX = Math.max(pad, window.innerWidth - w - pad);
  const maxY = Math.max(pad, window.innerHeight - h - pad);
  return {
    x: Math.min(Math.max(pad, x), maxX),
    y: Math.min(Math.max(pad, y), maxY),
  };
}

function isOffScreen(x, y, w, h) {
  return (
    x + w < -OFF_SCREEN_MARGIN ||
    y + h < -OFF_SCREEN_MARGIN ||
    x > window.innerWidth + OFF_SCREEN_MARGIN ||
    y > window.innerHeight + OFF_SCREEN_MARGIN
  );
}

export default function LiveChat() {
  const rootRef = useRef(null);
  const dragRef = useRef(null);
  const [hidden, setHidden] = useState(() => {
    try {
      return localStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [pos, setPos] = useState(null);
  const [ready, setReady] = useState(false);
  const [dragging, setDragging] = useState(false);

  const measure = useCallback(() => {
    const el = rootRef.current;
    if (!el) return null;
    return el.getBoundingClientRect();
  }, []);

  const defaultPosition = useCallback(() => {
    const rect = measure();
    if (!rect) return { x: 16, y: 16 };
    const pad = 20;
    const mobile = window.innerWidth <= 600;
    const x = mobile ? pad : window.innerWidth - rect.width - pad;
    const y = window.innerHeight - rect.height - pad;
    return clampPosition(x, y, rect.width, rect.height);
  }, [measure]);

  useLayoutEffect(() => {
    if (hidden) return;

    const rect = measure();
    if (!rect) return;

    try {
      const saved = localStorage.getItem(POS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          setPos(clampPosition(parsed.x, parsed.y, rect.width, rect.height));
          setReady(true);
          return;
        }
      }
    } catch {
      /* ignore */
    }

    setPos(defaultPosition());
    setReady(true);
  }, [hidden, defaultPosition, measure]);

  useEffect(() => {
    if (hidden || !pos) return undefined;

    const onResize = () => {
      const rect = measure();
      if (!rect) return;
      setPos((current) => clampPosition(current.x, current.y, rect.width, rect.height));
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [hidden, pos, measure]);

  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    const rect = measure();
    if (!rect || !pos) return;

    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: pos.x,
      originY: pos.y,
      width: rect.width,
      height: rect.height,
      moved: false,
    };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;

    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (Math.abs(dx) + Math.abs(dy) > DRAG_THRESHOLD) drag.moved = true;

    setPos({ x: drag.originX + dx, y: drag.originY + dy });
  };

  const finishDrag = (e) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;

    dragRef.current = null;
    setDragging(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }

    if (!drag.moved) {
      window.location.href = SITE.mailto;
      return;
    }

    const x = drag.originX + (e.clientX - drag.startX);
    const y = drag.originY + (e.clientY - drag.startY);

    if (isOffScreen(x, y, drag.width, drag.height)) {
      try {
        localStorage.setItem(DISMISS_KEY, '1');
      } catch {
        /* ignore */
      }
      setHidden(true);
      return;
    }

    const next = clampPosition(x, y, drag.width, drag.height);
    setPos(next);
    try {
      localStorage.setItem(POS_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  if (hidden) return null;

  return (
    <div
      ref={rootRef}
      className={`live-chat ${ready ? 'live-chat--ready' : ''} ${dragging ? 'live-chat--dragging' : ''}`}
      style={ready && pos ? { left: `${pos.x}px`, top: `${pos.y}px` } : undefined}
    >
      <div
        className="live-chat__btn"
        role="button"
        tabIndex={0}
        aria-label={`Email ${SITE.email}. Drag to move; drag off screen to hide.`}
        title={`${SITE.email} — drag to move`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.location.href = SITE.mailto;
          }
        }}
      >
        <ChatAvatar />
        <span className="live-chat__label">We&apos;re online — Email us</span>
      </div>
    </div>
  );
}
