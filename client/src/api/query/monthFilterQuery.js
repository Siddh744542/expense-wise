import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function getAvailableMonths(userId) {
  const { data: availableMonths, isLoading: isLoadingMonths } = useQuery({
    queryKey: ["availableMonths", userId],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/getavailablemonths`,
        {
          params: { userId: userId }
        }
      );
      return response.data?.months;
    },
    enabled: !!userId
  });
  return [availableMonths, isLoadingMonths];
}
