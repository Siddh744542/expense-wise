import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SERVER_URL } from "../../../constants";

export function getAvailableMonths(userId) {
  const { data: availableMonths, isLoading: isLoadingMonths } = useQuery({
    queryKey: ["availableMonths", userId],
    queryFn: async () => {
      const response = await axios.get(`${SERVER_URL}/dashboard/getavailablemonths`, {
        params: { userId: userId }
      });
      return response.data?.months;
    },
    enabled: !!userId
  });
  return [availableMonths, isLoadingMonths];
}
