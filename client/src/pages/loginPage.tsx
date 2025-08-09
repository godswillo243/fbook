import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { axiosInstance } from "../lib/axios/axiosInstance";

const loginSchema = z.object({
  email: z.email("Email is required"),
  password: z.string("Password is required"),
});

function LoginPage() {
  const [formData, setFormData] = useState<z.infer<typeof loginSchema>>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const queryClient = useQueryClient();
  const { status, mutate: loginFn } = useMutation({
    mutationFn: async function (formData: z.infer<typeof loginSchema>) {
      try {
        const response = await axiosInstance.post("/auth/user", formData);
        return response.data;
      } catch (error) {
        const errData = (error as AxiosError).response?.data;
        const errMsg = (errData as Record<string, string>).message;
        throw new Error(errMsg);
      }
    },
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      setErrors(result.error.issues.map((issue) => issue.message));
      return;
    }

    setErrors([]);

    loginFn(formData, {
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
      <h3 className="mb-[16px] text-center w-full">
        Login to your <span className="text-primary font-[Playpen_Sans]">Fbook</span> account
      </h3>
      <form onSubmit={handleSubmit} className="auth-form max-w-[400px]">
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
            className="text-gray-700! absolute right-[10px] p-0! h-fit! top-[45px]  text-sm bg-white! "
          >
            {showPassword ? "Hide" : "Show"}{" "}
          </button>
        </div>
        <p className="text-red-500 px-2 font-semibold text-sm">{errors[0]}</p>
        <Link to={"/reset-password"} className={"text-sm link text-blue-500 w-full"}>Forgot password</Link>
        <button className="w-full! text-primary-content! bg-primary!">
          {status === "pending" ? <span className="loading loading-spinner"></span>: "Login"}
        </button>
      </form>
      <Link to={"/signup"} className="text-sm text-blue-500 link">
        Already have an account{"."}
      </Link>
    </div>
  );
}
export default LoginPage;
