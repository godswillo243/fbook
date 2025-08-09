import { useQuery } from "@tanstack/react-query";

export function useQueryHook<T>(queryKey: string[], queryFn: () => Promise<T>) {
    return useQuery<T, Error>({
        queryKey,
        queryFn,
    });
}