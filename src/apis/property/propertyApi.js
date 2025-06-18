import { dmApi } from "@/store/dmApi";
import {
  getAuthorizationHeader,
  handleQueryError,
  handleQueryErrorAndSuccess,
} from "@/helpers/RtkQueryUtils";

export const propertyApi = dmApi.injectEndpoints({
  endpoints: (build) => ({
    // Add property-related endpoints here
  }),
});

export const {
  // Export property-related hooks here
} = propertyApi;
