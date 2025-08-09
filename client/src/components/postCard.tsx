import { MessageCircle } from "lucide-react";
import type { IPost } from "../types";

interface PostCardProps {
  post: IPost;
}

function PostCard({ post }: PostCardProps) {
  if (!post.author) return "";

  return (
    <div className=" bg-base-200 card w-full  max-w-[500px] my-2 py-6  px-2 shadow">
      <div className="w-full flex items-center justify-start gap-2 px-4 py-2">
        <figure className="">
          <img
            src={post?.author.avatarUrl.trim() || "/avatar.avif"}
            alt=""
            className="w-10 h-10 rounded-full"
          />
        </figure>
        <h2 className="card-title">{post.author.name}</h2>
      </div>
      {post.imageUrl?.trim() && (
        <figure>
          <img src={post.imageUrl} alt="Shoes" />
        </figure>
      )}
      <div className="card-body">
        {post.content[100] ? (
          <>
          <p className="text-lg">{post.content.substring(0, 100)}</p>
          <span className="text-sm uppercase">Show</span>
          </>
        ) : (
          <p className="text-lg">{post.content}</p>
        )}
      </div>
      <div className="flex items-center justify-start gap-4 mt-4 pl-2">
        <button>
          <MessageCircle />
          <span>Comments</span>
        </button>
      </div>
    </div>
  );
}
export default PostCard;
