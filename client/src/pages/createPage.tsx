import { useState, type ChangeEvent, type FormEvent } from "react";
import { useToast } from "../components/toaster/context";
import { useCreatePost } from "../lib/react-query/mutations";
import type { IPost } from "../types";
import { useNavigate } from "react-router-dom";
import { usePostStore } from "../store/postStore";

function CreatePage() {
  const [formData, setFormData] = useState({
    content: "",
    image: "",
  });
  const { showToast } = useToast();
  const { mutate: createPostFn, status } = useCreatePost();
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formData.content) {
      showToast("Caption is required");
    }
    createPostFn(formData, {
      onError: (error) => {
        showToast(error.message, "error");
      },
      onSuccess: ({ post }: { post: IPost }) => {
        showToast("Post created!", "success");
        usePostStore.setState((state) => ({
          ...state,
          posts: [post, ...state.posts],
        }));
        navigate("/");
      },
    });
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const el = e.target;
    if (!el) return;
    const file = el.files![0];
    if (!file) return;

    const reader = new FileReader();

    reader.addEventListener("loadend", (e) => {
      setFormData((state) => ({
        ...state,
        image: e.target?.result as string,
      }));
    });
    reader.readAsDataURL(el.files![0]);
  }

  return (
    <div className="w-full h-full bg-base-100 ">
      <div className="w-full h-full flex-center flex-col py-20">
        <div>
          <h3>Create a post</h3>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full h-full mt-10 max-w-96 p-2"
        >
          <div className="w-full flex flex-col ">
            <label htmlFor="">Caption</label>
            <textarea
              name=""
              className="textarea resize-none w-full"
              id=""
              required
              value={formData.content}
              onChange={(e) =>
                setFormData((state) => ({ ...state, content: e.target.value }))
              }
            ></textarea>
          </div>
          <div className="w-full flex flex-col p-2">
            <label className="label">Pick a file</label>
            <input
              type="file"
              className="file-input max-w-64 fle"
              onChange={handleFileChange}
            />
            <label className="label font-light!">Max size 2MB</label>
          </div>
          <button className="bg-primary! text-primary-content! w-full!">
            {status === "pending" ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Create Post"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
export default CreatePage;
