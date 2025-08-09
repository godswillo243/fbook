import { XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useEditProfile } from "../lib/react-query/mutations";
import { useQueryClient } from "@tanstack/react-query";

interface ProfileEditorProps {
  closeEditor: () => void;
}

function ProfileEditor({ closeEditor }: ProfileEditorProps) {
  const [formData, setFormData] = useState({
    profileImage: "",
    name: "",
    bio: "",
    newPassword: "",
    currentPassword: "",
  });
  const fileRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { mutate: editProfileFn, status } = useEditProfile();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData((state) => ({ ...state, [e.target.name]: e.target.value }));
  }
  function handleEditProfile() {
    editProfileFn(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      },
    });
  }
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const el = e.target;
    if (!el) return;
    const file = el.files![0];
    if (!file) return;

    const reader = new FileReader();

    reader.addEventListener("loadend", (e) => {
      setFormData((state) => ({
        ...state,
        profileImage: e.target?.result as string,
      }));
    });
    reader.readAsDataURL(el.files![0]);
  }

  return (
    <div
      className="card shadow-sm p-2 py-10 flex-center flex-col gap-2 "
      id="profile-editor"
    >
      <div className="flex items-center justify-end w-full">
        <button
          onClick={() => closeEditor()}
          className="btn-ghost! h-fit! w-fit! p-2! rounded-full!"
        >
          <XIcon />
        </button>
      </div>
      <div className="flex items-start flex-col justify-start gap-2">
        <label htmlFor="profile-picture" className="label">
          Profile Picture:
        </label>
        <input
          type="file"
          id="profile-picture"
          accept="image/*"
          ref={fileRef}
          onChange={handleFileChange}
          className="file-input file-input-ghost px-0! w-10!"
        />
      </div>
      <div className="flex-center flex-col  mt-2 w-full  gap-2">
        <label className="label">Your bio:</label>
        <textarea
          className="textarea h-24 resize-none min-w-[200px]"
          placeholder="Bio"
          name="bio"
          onChange={handleChange}
          value={formData.bio}
        ></textarea>
      </div>
      <div className="flex items-center justify-between flex-col max-w-[400px]">
        <label htmlFor="email">Current Password</label>
        <input
          type="text"
          id="currentPassword"
          name="currentPassword"
          className="max-w-[150px]"
          onChange={handleChange}
          value={formData.currentPassword}
        />
      </div>
      <div className="flex items-center justify-between flex-col max-w-[400px]">
        <label htmlFor="email">New Password</label>
        <input
          type="text"
          id="newPassword"
          name="newPassword"
          className="max-w-[150px]"
          onChange={handleChange}
          value={formData.newPassword}
        />
      </div>
      <button
        onClick={() => handleEditProfile()}
        className="btn-primary text-primary-content! rounded-full! w-full! max-w-[240px] mt-8"
      >
        {status === "pending" ? (
          <span className="loading loading-spinner"></span>
        ) : (
          "Save"
        )}
      </button>
    </div>
  );
}
export default ProfileEditor;
