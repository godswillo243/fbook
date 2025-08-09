import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios/axiosInstance";
import { useCountDown } from "../hooks/useCountDown";

function ResetPasswordPage() {
  const [errors, setErrors] = useState<string[]>([]);

  const { countDown, setCountDown } = useCountDown();

  const [formData, setFormData] = useState<{
    email: string;
    newPassword: string;
    code: string;
  }>({
    email: "",
    newPassword: "",
    code: "",
  });

  const navigate = useNavigate();

  const { mutate: sendCodeFn, status: sendCodeStatus } = useMutation({
    mutationFn: async (email: string) => {
      try {
        const response = await axiosInstance.get(
          `/auth/user/password/${email}`
        );
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
  });
  const { mutate: resetPasswordFn, status: resetPasswordStatus } = useMutation({
    mutationFn: async ({ code, email, newPassword }: typeof formData) => {
      try {
        const response = await axiosInstance.put(
          `/auth/user/password/${email}`,
          {
            code,
            newPassword,
          }
        );
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const handleSendCode = () => {
    if (!formData.email) {
      setErrors((prev) => ["Enter your email", ...prev]);
      return;
    }
    sendCodeFn(formData.email, {
      onSuccess: () => {
        setCountDown(60);
      },
    });
  };
  const handleResetPassword = () => {
    if (!formData.email) {
      setErrors((prev) => ["Enter your email", ...prev]);
      return;
    }
    if (!formData.code) {
      setErrors((prev) => ["Enter the code", ...prev]);
      return;
    }
    if (!formData.newPassword) {
      setErrors((prev) => ["Enter your new password", ...prev]);
      return;
    }
    resetPasswordFn(formData, {
      onSuccess: () => {
        navigate("/login");
      },
    });
  };

  return (
    <div className="flex-center gap-6 flex-col w-full h-full">
      <div className=" flex-center flex-col gap-2">
        <h3 className="mb-4">Reset your password </h3>
        <p>Enter your email to reset your password</p>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) =>
            setFormData((state) => ({ ...state, email: e.target.value }))
          }
        />
        <button
          onClick={handleSendCode}
          disabled={sendCodeStatus === "pending" || countDown > 0}
        >
          {countDown > 0 ? (
            `${countDown} seconds`
          ) : sendCodeStatus === "pending" ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Send Code"
          )}
        </button>
      </div>
      {errors.length > 0 && <p className="text-error">{errors[0]}</p>}
      <div className=" flex-center flex-col gap-2">
        <p>Enter your code and new password</p>

        <input
          type="text"
          placeholder="Enter Code"
          onChange={(e) =>
            setFormData((state) => ({ ...state, code: e.target.value }))
          }
        />
        <input
          type="password"
          placeholder="New Password"
          onChange={(e) =>
            setFormData((state) => ({ ...state, newPassword: e.target.value }))
          }
        />
        <button onClick={handleResetPassword}>
          {resetPasswordStatus === "pending" ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Reset Password"
          )}
        </button>
      </div>
      <Link to={"/login"}> Go back to login page </Link>
    </div>
  );
}
export default ResetPasswordPage;
