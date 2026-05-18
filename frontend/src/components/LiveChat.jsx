import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { SITE } from '../config';

const DISMISS_KEY = 'imototo-livechat-dismissed';
const POS_KEY = 'imototo-livechat-pos-v2';
const DRAG_THRESHOLD = 6;
const OFF_SCREEN_MARGIN = 40;
const LONG_PRESS_MS = 750;

function getViewportBox() {
  const vv = window.visualViewport;
  if (vv) {
    return {
      left: vv.offsetLeft,
      top: vv.offsetTop,
      width: vv.width,
      height: vv.height,
    };
  }
  return { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
}

function getSafePad() {
  const v = getViewportBox();
  const narrow = v.width <= 600;
  const baseX = narrow ? 8 : 12;
  const baseY = narrow ? 8 : 10;
  return {
    left: baseX,
    right: baseX,
    top: baseY + (narrow ? 4 : 0),
    bottom: baseY + (narrow ? 14 : 12),
  };
}

function clampPosition(x, y, w, h) {
  const v = getViewportBox();
  const pad = getSafePad();
  const iw = window.innerWidth;
  const ih = window.innerHeight;

  /* Use the looser of visual viewport vs layout viewport so Safari chrome does not “trap” the bubble */
  const minX = Math.min(v.left + pad.left, pad.left);
  const maxX = Math.max(v.left + v.width - w - pad.right, iw - w - pad.right);
  const minY = Math.min(v.top + pad.top, pad.top);
  const maxY = Math.max(v.top + v.height - h - pad.bottom, ih - h - pad.bottom);

  const loX = Math.min(minX, maxX);
  const hiX = Math.max(minX, maxX);
  const loY = Math.min(minY, maxY);
  const hiY = Math.max(minY, maxY);

  return {
    x: Math.min(Math.max(loX, x), hiX),
    y: Math.min(Math.max(loY, y), hiY),
  };
}

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

function isOffScreen(x, y, w, h) {
  const v = getViewportBox();
  const right = v.left + v.width;
  const bottom = v.top + v.height;
  return (
    x + w < v.left - OFF_SCREEN_MARGIN ||
    y + h < v.top - OFF_SCREEN_MARGIN ||
    x > right + OFF_SCREEN_MARGIN ||
    y > bottom + OFF_SCREEN_MARGIN
  );
}

function isStaleViewportSave(parsed) {
  if (typeof parsed.vw !== 'number' || typeof parsed.vh !== 'number') return false;
  const v = getViewportBox();
  const dw = Math.abs(parsed.vw - v.width) / Math.max(parsed.vw, 120);
  const dh = Math.abs(parsed.vh - v.height) / Math.max(parsed.vh, 120);
  return dw > 0.2 || dh > 0.2;
}

function clearScrollLockClass() {
  document.documentElement.classList.remove('imototo-livechat-dragging');
}

function releasePointerCaptureSafe() {
  const el = captureRef.current;
  const pid = capturePointerIdRef.current;
  captureRef.current = null;
  capturePointerIdRef.current = null;
  if (!el || pid == null) return;
  try {
    if (typeof el.hasPointerCapture === 'function' && el.hasPointerCapture(pid)) {
      el.releasePointerCapture(pid);
    }
  } catch {
    /* ignore */
  }
}

function computeDefaultPosition(rect) {
  const v = getViewportBox();
  const pad = getSafePad();
  const mobile = v.width <= 600;
  const x = mobile ? v.left + pad.left : v.left + v.width - rect.width - pad.right;
  const y = v.top + v.height - rect.height - pad.bottom;
  return clampPosition(x, y, rect.width, rect.height);
}

export default function LiveChat() {
  const rootRef = useRef(null);
  const dragRef = useRef(null);
  const captureRef = useRef(null);
  const capturePointerIdRef = useRef(null);
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
    if (!rect) {
      const v = getViewportBox();
      return clampPosition(v.left + 16, v.top + 16, 56, 56);
    }
    return computeDefaultPosition(rect);
  }, [measure]);

  const pressTimerRef = useRef(null);

  const clearPressTimer = useCallback(() => {
    if (pressTimerRef.current != null) {
      window.clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  }, []);

  useLayoutEffect(() => {
    const hashReset =
      typeof window !== 'undefined' && window.location.hash === '#reset-livechat';

    if (hashReset) {
      try {
        localStorage.removeItem(POS_KEY);
        localStorage.removeItem(DISMISS_KEY);
      } catch {
        /* ignore */
      }
      const { pathname, search } = window.location;
      window.history.replaceState(null, '', `${pathname}${search}`);
      setHidden(false);
    }

    if (hidden && !hashReset) return;

    const rect = measure();
    if (!rect) return;

    try {
      const saved = localStorage.getItem(POS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          if (isStaleViewportSave(parsed)) {
            try {
              localStorage.removeItem(POS_KEY);
            } catch {
              /* ignore */
            }
            setPos(computeDefaultPosition(rect));
          } else {
            setPos(clampPosition(parsed.x, parsed.y, rect.width, rect.height));
          }
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
    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener('resize', onResize);
      vv.addEventListener('scroll', onResize);
    }
    return () => {
      window.removeEventListener('resize', onResize);
      if (vv) {
        vv.removeEventListener('resize', onResize);
        vv.removeEventListener('scroll', onResize);
      }
    };
  }, [hidden, pos, measure]);

  useEffect(() => {
    const onPageShow = (e) => {
      if (e.persisted) {
        clearScrollLockClass();
        releasePointerCaptureSafe();
        dragRef.current = null;
        setDragging(false);
      }
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);

  useEffect(() => () => clearPressTimer(), [clearPressTimer]);

  useEffect(() => {
    if (!dragging) return undefined;

    const onMove = (e) => {
      const drag = dragRef.current;
      if (!drag || e.pointerId !== drag.pointerId) return;

      if (e.cancelable) e.preventDefault();

      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      if (Math.abs(dx) + Math.abs(dy) > DRAG_THRESHOLD) {
        if (!drag.moved) clearPressTimer();
        drag.moved = true;
      }

      setPos({
        x: e.clientX - drag.offsetX,
        y: e.clientY - drag.offsetY,
      });
    };

    const onEnd = (e) => {
      clearPressTimer();

      const drag = dragRef.current;
      if (!drag || e.pointerId !== drag.pointerId) return;

      dragRef.current = null;
      setDragging(false);
      releasePointerCaptureSafe();

      if (!drag.moved) {
        window.location.href = SITE.mailto;
        return;
      }

      const x = e.clientX - drag.offsetX;
      const y = e.clientY - drag.offsetY;

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
        const v = getViewportBox();
        localStorage.setItem(POS_KEY, JSON.stringify({ ...next, vw: v.width, vh: v.height }));
      } catch {
        /* ignore */
      }
    };

    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onEnd);
    window.addEventListener('pointercancel', onEnd);

    document.documentElement.classList.add('imototo-livechat-dragging');

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onEnd);
      window.removeEventListener('pointercancel', onEnd);
      clearScrollLockClass();
      releasePointerCaptureSafe();
    };
  }, [dragging, clearPressTimer]);

  const onPointerDown = (e) => {
    if (e.button !== 0) return;

    const rect = measure();
    if (!rect || !pos) return;

    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      width: rect.width,
      height: rect.height,
      moved: false,
    };
    captureRef.current = e.currentTarget;
    capturePointerIdRef.current = e.pointerId;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore — still works with window listeners on many browsers */
    }
    setDragging(true);

    clearPressTimer();
    pressTimerRef.current = window.setTimeout(() => {
      pressTimerRef.current = null;
      const drag = dragRef.current;
      if (!drag || drag.moved) return;
      dragRef.current = null;
      setDragging(false);
      clearScrollLockClass();
      releasePointerCaptureSafe();
      try {
        localStorage.removeItem(POS_KEY);
      } catch {
        /* ignore */
      }
      const r = rootRef.current?.getBoundingClientRect();
      if (r) setPos(computeDefaultPosition(r));
      else setPos(defaultPosition());
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(12);
    }, LONG_PRESS_MS);
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
        aria-label={`We're listening — email ${SITE.email}. Drag to move; drag off screen to hide. Hold one second on the button to reset its position.`}
        title={`${SITE.email} — drag to move; hold 1s to reset spot; drag off screen to hide`}
        onPointerDown={onPointerDown}
        onContextMenu={(ev) => ev.preventDefault()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.location.href = SITE.mailto;
          }
        }}
      >
        <span className="live-chat__listening">
          <span className="live-chat__listening-dot" />
          We&apos;re listening
        </span>
        <ChatAvatar />
        <span className="live-chat__label">Email us — we&apos;re online</span>
      </div>
    </div>
  );
}
