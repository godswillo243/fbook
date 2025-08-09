import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../axios/axiosInstance";
import type { AxiosError } from "axios";

const headers = {
  Authorization: `Bearer ${localStorage.getItem("token-id")}`,
};

export const useSendFriendRequest = () => {
  return useMutation({
    mutationFn: async (userId: string) => {
      try {
        const response = await axiosInstance.post(
          `/users/${userId}/friends/request`,
          undefined,
          {
            headers,
          }
        );

        return response.data;
      } catch (error) {
        console.log(error);

        const err = (error as AxiosError).response?.data;
        const message = (err as Record<string, string>).message;

        throw new Error(message);
      }
    },
  });
};

export const useAcceptFriendRequest = () =>
  useMutation({
    mutationFn: async (reqId: string) => {
      try {
        const res = await axiosInstance.put(
          `/users/${reqId}/friends/request`,
          undefined,
          {
            headers,
          }
        );
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });
export const useRejectFriendRequest = () =>
  useMutation({
    mutationFn: async (userId: string) => {
      try {
        const res = await axiosInstance.delete(
          `/users/${userId}/friends/request`,
          { headers }
        );
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });
export const useEditProfile = () =>
  useMutation({
    mutationFn: async (data: Record<string, string | unknown>) => {
      try {
        const res = await axiosInstance.put(
          `/users/me`,
          {
            ...data,
          },
          { headers }
        );
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
  });
export const useCreatePost = () =>
  useMutation({
    mutationFn: async (data: Record<string, string | unknown>) => {
      try {
        const res = await axiosInstance.post(
          `/posts`,
          {
            ...data,
          },
          { headers }
        );
        return res.data;
      } catch (error) {
        console.log(error);
        const err = error as AxiosError;
        const errData = err.response?.data;
        throw new Error((errData as Record<string, string>).message);
      }
    },
  });
export const useSendMessage = () =>
  useMutation({
    mutationFn: async ({ message, id }: { message: string; id: string }) => {
      try {
        const res = await axiosInstance.post(
          `/messages/${id}`,
          {
            content: message,
          },
          { headers }
        );
        return res.data;
      } catch (error) {
        console.log(error);
        const err = error as AxiosError;
        const errData = err.response?.data;
        throw new Error((errData as Record<string, string>).message);
      }
    },
  });
