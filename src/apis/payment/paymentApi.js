import { dmApi } from "@/store/dmApi";
import {
  getAuthorizationHeader,
  handleQueryError,
  handleQueryErrorAndSuccess,
} from "@/helpers/RtkQueryUtils";

export const paymentApi = dmApi.injectEndpoints({
  endpoints: (build) => ({
    // Add payment-related endpoints here
  }),
});

export const {
  // Export payment-related hooks here
} = paymentApi;
