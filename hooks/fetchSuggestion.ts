import { fetchSuggestions } from "@/service/apiClient";
import { useQuery } from "react-query";

export const useSuggestions = (query:string) => {
    return useQuery(['suggestions'], () => fetchSuggestions(query), {
      enabled: !!query, 
    });
  };