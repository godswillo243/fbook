import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios/axiosInstance";
import type { AxiosError } from "axios";
import type { IMessage, IPost, IUser } from "../../types";

const headers = {
  Authorization: `Bearer ${localStorage.getItem("token-id")}`,
};

export const useGetProfile = (id: string) => {
  return useQuery<IUser, AxiosError>({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/users/${id === "me" ? "me" : id + "/profile"}`,
        { headers }
      );
      return response.data;
    },
  });
};
export const useGetStuff = () => {
  return useQuery({
    queryKey: ["stuff"],
    queryFn: async () => {
      const response = await axiosInstance.get("/users/stuff", {
        headers,
      });
      return response.data;
    },
  });
};
export const useGetUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await axiosInstance.get("/auth/user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token-id")}`,
        },
      });
      return response.data;
    },
  });
};
export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axiosInstance.get("/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token-id")}`,
        },
      });
      return response.data;
    },
  });
};
export const useGetFriends = (userId: string) => {
  return useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      if (!userId) return null;
      const response = await axiosInstance.get(`/users/${userId}/friends`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token-id")}`,
        },
      });
      return response.data;
    },
  });
};
export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: async ({
      pageParam = 0,
    }): Promise<{ lastPage: { nextCursor: number }; posts: IPost[] }> => {
      const response = await axiosInstance.get(
        `/posts/feed?cursor=${pageParam}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token-id")}`,
          },
        }
      );
      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.lastPage.nextCursor,
  });
};
export const useSearchForUsers = ({
  debouncedSearchQuery,
}: {
  debouncedSearchQuery: string;
}) => {
  return useQuery({
    queryKey: ["search"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/users/search?q=${debouncedSearchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token-id")}`,
          },
        }
      );
      return response.data;
    },
    enabled: debouncedSearchQuery.length > 0,
  });
};

export const useGetMessages = (id: string) => {
  return useQuery(
    {
      queryKey: ["messages"],
      queryFn: async (): Promise<IMessage[]> => {
        const response = await axiosInstance.get(`/messages/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token-id")}`,
          },
        });
        return response.data;
      },
      enabled: !!id
    },
  );
};
