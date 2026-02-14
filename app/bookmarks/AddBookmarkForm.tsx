"use client";

import { createClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState } from "react";

function isValidUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!/^https?:\/\/.+/.test(trimmed)) return false;
  try {
    new URL(trimmed);
    return true;
  } catch {
    return false;
  }
}

export function AddBookmarkForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    const trimmedUrl = url.trim();

    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }
    if (!isValidUrl(trimmedUrl)) {
      setError("Please enter a valid URL (e.g. https://example.com).");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: insertError } = await supabase.from("bookmarks").insert({
        user_id: userId,
        title: trimmedTitle,
        url: trimmedUrl,
      });
      if (insertError) throw insertError;
      setTitle("");
      setUrl("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add bookmark.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
    >
      <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div>
          <label
            htmlFor="bookmark-title"
            className="mb-1.5 block text-xs font-medium text-white/50"
          >
            Title
          </label>
          <input
            id="bookmark-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My bookmark"
            disabled={loading}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/95 placeholder:text-white/30 focus:border-cyan-500/40 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 disabled:opacity-60"
          />
        </div>
        <div>
          <label
            htmlFor="bookmark-url"
            className="mb-1.5 block text-xs font-medium text-white/50"
          >
            URL
          </label>
          <input
            id="bookmark-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            disabled={loading}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/95 placeholder:text-white/30 focus:border-cyan-500/40 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 disabled:opacity-60"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-sm font-medium text-cyan-400 transition-all duration-200 hover:border-cyan-500/50 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_-6px_rgba(34,211,238,0.2)] disabled:opacity-60"
        >
          {loading ? "Adding…" : "Add"}
        </button>
      </div>
      {error && (
        <p className="mt-3 text-sm text-red-400/90" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
