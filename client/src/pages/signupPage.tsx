import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { axiosInstance } from "../lib/axios/axiosInstance";
import type { AxiosError } from "axios";

const signupSchema = z.object({
  name: z.string("Name is required"),
  email: z.email("Email is required"),
  password: z.string("Password is required"),
});

function SignupPage() {
  const [formData, setFormData] = useState<z.infer<typeof signupSchema>>({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const { status, mutate: signupFn } = useMutation({
    mutationFn: async (formData: z.infer<typeof signupSchema>) => {
      try {
        const response = await axiosInstance.post("/auth/new-user", formData);
        return response.data;
      } catch (error) {
        const errData = (error as AxiosError).response?.data;
        const errMsg = (errData as Record<string, string>).message;
        const err = new Error(errMsg);
        throw err;
      }
    },
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = signupSchema.safeParse(formData);
    if (!result.success) {
      setErrors(result.error.issues.map((issue) => issue.message));
      return;
    }
    setErrors([]);
    signupFn(formData, {
      onSuccess: (data) => {
        localStorage.setItem("token-id", data.tokenId);
        queryClient.invalidateQueries({
          queryKey: ["auth-user"],
        });
      },
      onError: (error) => {
        setErrors((prevState) => [error.message, ...prevState]);
      },
    });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <div className="auth-page">
      <h3 className="mb-[16px]">
        Sign Up on <span className="text-primary font-bold font-[Playpen_Sans]">Fbook</span>
      </h3>
      <form onSubmit={handleSubmit} className="auth-form max-w-[400px]">
        <div className="auth-form">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" onChange={handleChange} />
        </div>
        <div className="auth-form">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" onChange={handleChange} />
        </div>
        <div className="auth-form">
          <label htmlFor="password">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-gray-700! absolute right-[10px] p-0! py-0! h-fit! top-[45px]  text-sm bg-white! "
          >
            {showPassword ? "Hide" : "Show"}{" "}
          </button>
        </div>
        <p className="text-red-500 px-2 font-semibold text-sm">{errors[0]}</p>
        <button className="w-full! text-primary-content! bg-primary!">
          {status === "pending" ? "Signning up..." : "Signup"}
        </button>
      </form>
      <Link to={"/login"} className="link text-blue-500 text-sm">
        Already have an account{"."}
      </Link>
    </div>
  );
}
export default SignupPage;
