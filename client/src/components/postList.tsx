import { useInfiniteQuery } from "@tanstack/react-query";
import type { IPost } from "../types";
import PostCard from "./postCard";
import { axiosInstance } from "../lib/axios/axiosInstance";
import { useEffect, useRef } from "react";

const fetchPosts = async ({
  pageParam = 0,
}): Promise<{ nextCursor: number; posts: IPost[] }> => {
  const response = await axiosInstance.get(`/posts/feed?cursor=${pageParam}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token-id")}`,
    },
  });
  return response.data;
};

function PostList() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data, fetchNextPage, status } = useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: fetchPosts,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor;
    },
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        console.log(entries[0]);
        fetchNextPage();
      }
    }, {});
    observer.observe(el);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pt-10 w-full h-full overflow-y-scroll">
      {
        <ul className="list bg-base-100 rounded-box w-full  flex-center gap-4">
          {posts?.map((post: IPost, i) => {
            return <PostCard key={i} post={post} />;
          })}
        </ul>
      }

      <div ref={scrollRef} className="w-full py-10">
        {status === "pending" && (
          <span className="loading loading-xl loading-spinner"></span>
        )}
        {status === "success" && "End of posts"}
      </div>
    </div>
  );
}
export default PostList;
