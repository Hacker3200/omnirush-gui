import { memo, useCallback } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

import {
  selectSessionIsStickyBottom,
  selectSessionTopClippedMessageId,
  useSessionScrollStore,
} from "./scroll-store";

function useSessionScrollOverlayState(sessionId: string) {
  const isAtBottom = useSessionScrollStore((state) => selectSessionIsStickyBottom(state.sessions, sessionId));
  const topClippedMessageId = useSessionScrollStore((state) => selectSessionTopClippedMessageId(state.sessions, sessionId));

  return { isAtBottom, topClippedMessageId };
}

type JumpToStartButtonProps = {
  onJumpToStartOfMessage: (behavior?: ScrollBehavior) => void;
};

const JUMP_BUTTON_CLASS =
  "pointer-events-auto inline-flex size-8 items-center justify-center rounded-full border border-dls-border bg-dls-surface/95 text-dls-text shadow-(--dls-card-shadow) backdrop-blur-md transition-colors hover:bg-dls-hover focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-dls-border";

const JumpToStartButton = memo(function JumpToStartButton({
  onJumpToStartOfMessage,
}: JumpToStartButtonProps) {
  const handleClick = useCallback(() => {
    onJumpToStartOfMessage("smooth");
  }, [onJumpToStartOfMessage]);

  return (
    <button
      type="button"
      className={JUMP_BUTTON_CLASS}
      aria-label="Jump to start"
      title="Jump to start"
      data-testid="jump-to-start"
      onClick={handleClick}
    >
      <ArrowUp aria-hidden="true" className="size-4" />
    </button>
  );
});

type JumpToLatestButtonProps = {
  onJumpToLatest: (behavior?: ScrollBehavior) => void;
};

const JumpToLatestButton = memo(function JumpToLatestButton({
  onJumpToLatest,
}: JumpToLatestButtonProps) {
  const handleClick = useCallback(() => {
    onJumpToLatest("smooth");
  }, [onJumpToLatest]);

  return (
    <button
      type="button"
      className={JUMP_BUTTON_CLASS}
      aria-label="Jump to latest"
      title="Jump to latest"
      data-testid="jump-to-latest"
      onClick={handleClick}
    >
      <ArrowDown aria-hidden="true" className="size-4" />
    </button>
  );
});

type SessionScrollOverlayProps = {
  sessionId: string;
  isStreaming: boolean;
  onJumpToLatest: (behavior?: ScrollBehavior) => void;
  onJumpToStartOfMessage: (behavior?: ScrollBehavior) => void;
};

export const SessionScrollOverlay = memo(function SessionScrollOverlay({
  sessionId,
  isStreaming,
  onJumpToLatest,
  onJumpToStartOfMessage,
}: SessionScrollOverlayProps) {
  const { isAtBottom, topClippedMessageId } = useSessionScrollOverlayState(sessionId);
  const showJumpToStart = !isStreaming && Boolean(topClippedMessageId);
  const showJumpToLatest = !isAtBottom;

  if (!showJumpToStart && !showJumpToLatest) {
    return null;
  }

  return (
    <div
      className="pointer-events-none absolute inset-y-0 end-0 z-30 flex w-10 flex-col items-center py-3 sm:w-12"
      data-testid="session-scroll-rail"
      aria-label="Chat navigation"
    >
      {showJumpToStart ? <JumpToStartButton onJumpToStartOfMessage={onJumpToStartOfMessage} /> : null}
      {showJumpToLatest ? (
        <div className="mt-auto">
          <JumpToLatestButton onJumpToLatest={onJumpToLatest} />
        </div>
      ) : null}
    </div>
  );
});
