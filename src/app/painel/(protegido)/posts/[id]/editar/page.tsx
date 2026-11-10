import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/post-form";
import { getAdminPosts } from "@/lib/admin-posts-store";

export default async function EditarPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = (await getAdminPosts()).find((item) => item.id === id);
  if (!post) notFound();
  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 lg:px-6 lg:py-8">
      <header><p className="text-sm text-muted-foreground">Posts</p><h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Editar {post.titulo}</h2></header>
      <PostForm editId={id} publication={{ author: post.author, publishedAt: post.publishedAt, updatedAt: post.updatedAt }} values={post} />
    </div>
  );
}
