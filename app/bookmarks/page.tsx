import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import { AddBookmarkForm } from "./AddBookmarkForm";
import { BookmarkList } from "./BookmarkList";

export default async function BookmarksPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/bookmarks");
  }

  const { data: bookmarks = [] } = await supabase
    .from("bookmarks")
    .select("id, title, url, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white/90">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-2xl font-semibold tracking-tight">Bookmarks</h1>
        <p className="mt-2 text-sm text-white/50">
          Signed in as {user.email ?? user.id}
        </p>
        <div className="mt-8 space-y-8">
          <AddBookmarkForm userId={user.id} />
          <BookmarkList initialBookmarks={bookmarks ?? []} userId={user.id} />
        </div>
      </div>
    </div>
  );
}
