import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import { useSearchForUsers } from "../lib/react-query/queries";
import UsersList from "../components/usersLists";
import { useSearchStore } from "../store/searchStore";

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  const { data, refetch, status } = useSearchForUsers({ debouncedSearchQuery });

  useEffect(() => {
    refetch();
  }, [refetch, debouncedSearchQuery]);

  useEffect(() => {
    if (status === "success") {
      useSearchStore.setState((state) => ({ ...state, results: [...data] }));
    }
  }, [data, status]);

  return (
    <div className="w-full h-full overflow-hidden bg-base-100 relative">
      <div className="absolute bg-base-100 top-2 left-1/2 gap-2 w-full -translate-x-1/2 z-45 overflow-clip flex-center">
        <input
          type="search"
          className="rounded-full! max-w-[400px] w-full"
          name=""
          id=""
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className=" bg-transparent! aspect-square! text-base-content! hover:bg-base-300! rounded-full! p-2! ">
          <SearchIcon />
        </button>
      </div>

      <div className="h-full overflow-scroll pt-10">
        {status === "pending" && (
          <span className="loading loading-spinner"></span>
        )}
        <div>
          <UsersList />
        </div>
      </div>
    </div>
  );
}
export default SearchPage;
