"use client";

import { createClient } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import type { Bookmark } from "./BookmarkCards";
import { BookmarkCards } from "./BookmarkCards";

function toBookmark(row: Record<string, unknown>): Bookmark {
  return {
    id: String(row.id),
    title: String(row.title),
    url: String(row.url),
    created_at: String(row.created_at),
  };
}

type BookmarkListProps = {
  initialBookmarks: Bookmark[];
  userId: string;
};

export function BookmarkList({ initialBookmarks, userId }: BookmarkListProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  useEffect(() => {
    setBookmarks(initialBookmarks);
  }, [initialBookmarks]);

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();
    // No filter: RLS limits events to this user's rows. Subscription must use
    // the same anon key + session so Supabase only sends our bookmarks' changes.
    const channel = supabase
      .channel(`bookmarks-realtime-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookmarks",
        },
        (payload) => {
          const row = payload.new as Record<string, unknown>;
          if (String(row.user_id) !== userId) return;
          setBookmarks((prev) => {
            const next = toBookmark(row);
            if (prev.some((b) => b.id === next.id)) return prev;
            return [next, ...prev];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "bookmarks",
        },
        (payload) => {
          const old = payload.old as Record<string, unknown>;
          const id = old?.id as string | undefined;
          if (id) setBookmarks((prev) => prev.filter((b) => b.id !== id));
        }
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          console.error("[Realtime] Subscription error. Ensure the bookmarks table is in the supabase_realtime publication.");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  async function handleConfirmDelete(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("bookmarks").delete().eq("id", id);
    if (!error) {
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    }
    setConfirmingId(null);
  }

  return (
    <BookmarkCards
      bookmarks={bookmarks}
      confirmingId={confirmingId}
      onDeleteRequest={setConfirmingId}
      onConfirmDelete={handleConfirmDelete}
      onCancelConfirm={() => setConfirmingId(null)}
    />
  );
}
