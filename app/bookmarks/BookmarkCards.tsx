"use client";

import { AnimatePresence, motion } from "framer-motion";

export type Bookmark = {
  id: string;
  title: string;
  url: string;
  created_at: string;
};

type BookmarkCardsProps = {
  bookmarks: Bookmark[];
  confirmingId: string | null;
  onDeleteRequest: (id: string) => void;
  onConfirmDelete: (id: string) => void;
  onCancelConfirm: () => void;
};

const cardClasses =
  "flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all duration-200 hover:border-cyan-500/20 hover:bg-white/8 hover:shadow-[0_0_24px_-6px_rgba(34,211,238,0.15)]";

export function BookmarkCards({
  bookmarks,
  confirmingId,
  onDeleteRequest,
  onConfirmDelete,
  onCancelConfirm,
}: BookmarkCardsProps) {
  if (bookmarks.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
        <p className="text-sm text-white/40">No bookmarks yet.</p>
      </div>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      <AnimatePresence mode="popLayout">
        {bookmarks.map((bookmark) => (
          <motion.li
            key={bookmark.id}
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cardClasses}
          >
            {confirmingId === bookmark.id ? (
              <ConfirmDelete
                onConfirm={() => onConfirmDelete(bookmark.id)}
                onCancel={onCancelConfirm}
              />
            ) : (
              <>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0 flex-1"
                >
                  <h3 className="font-medium text-white/95 line-clamp-2">
                    {bookmark.title}
                  </h3>
                  <p className="mt-1.5 truncate text-sm text-cyan-400/80">
                    {bookmark.url}
                  </p>
                </a>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onDeleteRequest(bookmark.id);
                  }}
                  aria-label="Delete bookmark"
                  className="shrink-0 rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-red-400/90"
                >
                  <TrashIcon />
                </button>
              </>
            )}
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}

function ConfirmDelete({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex w-full items-center justify-between gap-3">
      <span className="text-sm text-white/60">Remove this bookmark?</span>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-3 py-1.5 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white/90"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-400/90 transition-colors hover:bg-red-500/20 hover:text-red-400"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}
