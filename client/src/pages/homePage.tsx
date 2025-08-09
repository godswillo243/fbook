import PostsList from "../components/postList";

function HomePage() {
  return (
    <div className="w-full h-full relative z-1 ">
      <div className="h-[calc(100%)] pt-4">
        <PostsList />
      </div>
    </div>
  );
}
export default HomePage;
