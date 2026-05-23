import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { SITE } from '../config';

const DISMISS_KEY = 'imototo-livechat-dismissed';
const POS_KEY = 'imototo-livechat-pos-v4';
const POS_ANCHOR = 'br';
const DRAG_THRESHOLD = 8;
const OFF_SCREEN_MARGIN = 56;
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
  const baseX = narrow ? 12 : 16;
  const baseY = narrow ? 10 : 12;
  return {
    left: baseX,
    right: baseX,
    top: baseY,
    bottom: baseY,
  };
}

/** Space above bottom edge — safe area + mobile sticky quote/WhatsApp bar */
function getBottomInset() {
  const pad = getSafePad();
  let inset = pad.bottom;
  if (typeof window !== 'undefined' && window.innerWidth <= 767) {
    inset += 76;
  }
  return inset;
}

function clampPosition(x, y, w, h) {
  const v = getViewportBox();
  const pad = getSafePad();
  const iw = window.innerWidth;
  const ih = window.innerHeight;

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

/** Drop saves pinned to the top half — default is bottom-right */
function isTopPinnedSave(parsed, widgetHeight) {
  const v = getViewportBox();
  const limit = v.top + v.height * 0.45;
  return typeof parsed.y === 'number' && parsed.y + widgetHeight * 0.5 < limit;
}

/** Drop old saves on the left — default corner is bottom-right */
function isLeftPinnedSave(parsed, widgetWidth) {
  const v = getViewportBox();
  const centerX = parsed.x + widgetWidth / 2;
  return centerX < v.left + v.width * 0.42;
}

function shouldUseSavedPosition(parsed, w, h) {
  if (parsed.anchor !== POS_ANCHOR) return false;
  if (isStaleViewportSave(parsed)) return false;
  if (isTopPinnedSave(parsed, h)) return false;
  if (isLeftPinnedSave(parsed, w)) return false;
  return true;
}

function estimateWidgetSize(rect) {
  const v = getViewportBox();
  const mobile = v.width <= 600;
  const w = rect?.width > 0 ? rect.width : mobile ? 56 : 220;
  const h = rect?.height > 0 ? rect.height : mobile ? 92 : 52;
  return { w, h };
}

function computeDefaultPosition(rect) {
  const pad = getSafePad();
  const { w, h } = estimateWidgetSize(rect);
  const x = window.innerWidth - w - pad.right;
  const y = window.innerHeight - h - getBottomInset();
  return clampPosition(x, y, w, h);
}

export default function LiveChat() {
  const rootRef = useRef(null);
  const dragRef = useRef(null);
  const draggingActiveRef = useRef(false);
  const rafRef = useRef(null);
  const pendingPosRef = useRef(null);
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
    return computeDefaultPosition(rect);
  }, [measure]);

  const pressTimerRef = useRef(null);

  const clearPressTimer = useCallback(() => {
    if (pressTimerRef.current != null) {
      window.clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  }, []);

  const flushPosition = useCallback(() => {
    rafRef.current = null;
    if (pendingPosRef.current) {
      setPos(pendingPosRef.current);
      pendingPosRef.current = null;
    }
  }, []);

  const schedulePosition = useCallback(
    (next) => {
      pendingPosRef.current = next;
      if (rafRef.current == null) {
        rafRef.current = window.requestAnimationFrame(flushPosition);
      }
    },
    [flushPosition]
  );

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

    const applyPosition = () => {
      const rect = measure();
      const { w, h } = estimateWidgetSize(rect);

      try {
        const saved = localStorage.getItem(POS_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
            if (!shouldUseSavedPosition(parsed, w, h)) {
              try {
                localStorage.removeItem(POS_KEY);
              } catch {
                /* ignore */
              }
              setPos(computeDefaultPosition(rect));
            } else {
              setPos(clampPosition(parsed.x, parsed.y, w, h));
            }
            setReady(true);
            return true;
          }
        }
      } catch {
        /* ignore */
      }

      setPos(computeDefaultPosition(rect));
      setReady(true);
      return true;
    };

    if (!applyPosition()) {
      requestAnimationFrame(applyPosition);
    }
  }, [hidden, measure]);

  useEffect(() => {
    if (hidden || !pos) return undefined;

    const onResize = () => {
      if (draggingActiveRef.current) return;
      const rect = measure();
      if (!rect) return;
      setPos((current) => clampPosition(current.x, current.y, rect.width, rect.height));
    };

    window.addEventListener('resize', onResize);
    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener('resize', onResize);
    }
    return () => {
      window.removeEventListener('resize', onResize);
      if (vv) {
        vv.removeEventListener('resize', onResize);
      }
    };
  }, [hidden, pos, measure]);

  useEffect(() => {
    const onPageShow = (e) => {
      if (e.persisted) {
        draggingActiveRef.current = false;
        dragRef.current = null;
        setDragging(false);
      }
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);

  useEffect(
    () => () => {
      clearPressTimer();
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    },
    [clearPressTimer]
  );

  useEffect(() => {
    draggingActiveRef.current = dragging;
  }, [dragging]);

  useEffect(() => {
    if (!dragging) return undefined;

    const onMove = (e) => {
      const drag = dragRef.current;
      if (!drag || e.pointerId !== drag.pointerId) return;

      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      if (Math.abs(dx) + Math.abs(dy) > DRAG_THRESHOLD) {
        if (!drag.moved) clearPressTimer();
        drag.moved = true;
      }

      if (!drag.moved) return;

      schedulePosition({
        x: e.clientX - drag.offsetX,
        y: e.clientY - drag.offsetY,
      });
    };

    const onEnd = (e) => {
      clearPressTimer();

      const drag = dragRef.current;
      if (!drag || e.pointerId !== drag.pointerId) return;

      dragRef.current = null;
      draggingActiveRef.current = false;
      setDragging(false);

      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      const pending = pendingPosRef.current;
      pendingPosRef.current = null;

      if (!drag.moved) {
        window.location.href = SITE.mailto;
        return;
      }

      const x = pending ? pending.x : e.clientX - drag.offsetX;
      const y = pending ? pending.y : e.clientY - drag.offsetY;

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
        localStorage.setItem(
          POS_KEY,
          JSON.stringify({ ...next, vw: v.width, vh: v.height, anchor: POS_ANCHOR })
        );
      } catch {
        /* ignore */
      }
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onEnd);
    window.addEventListener('pointercancel', onEnd);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onEnd);
      window.removeEventListener('pointercancel', onEnd);
    };
  }, [dragging, clearPressTimer, schedulePosition]);

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
    draggingActiveRef.current = true;
    setDragging(true);

    clearPressTimer();
    pressTimerRef.current = window.setTimeout(() => {
      pressTimerRef.current = null;
      const drag = dragRef.current;
      if (!drag || drag.moved) return;
      dragRef.current = null;
      draggingActiveRef.current = false;
      setDragging(false);
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

  const transform =
    ready && pos ? `translate3d(${Math.round(pos.x)}px, ${Math.round(pos.y)}px, 0)` : undefined;

  return (
    <div
      ref={rootRef}
      className={`live-chat ${ready ? 'live-chat--ready' : ''} ${dragging ? 'live-chat--dragging' : ''}`}
      style={transform ? { transform } : undefined}
    >
      <div
        className="live-chat__btn"
        role="button"
        tabIndex={0}
        aria-label={`We're listening. Email ${SITE.email}. Drag to move; drag off screen to hide. Hold one second to reset its position.`}
        title={`${SITE.email}. Drag to move; hold 1s to reset spot; drag off screen to hide`}
        onPointerDown={onPointerDown}
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
        <span className="live-chat__label">Email us. We&apos;re online</span>
      </div>
    </div>
  );
}
