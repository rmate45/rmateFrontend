import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const dmApi = createApi({
  reducerPath: "dmApi",
  baseQuery: async (args, api, extraOptions) => {
    const rawBaseQuery = fetchBaseQuery({
      baseUrl: "http://54.235.55.43/api",
    });
    const result = await rawBaseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
      Cookies.remove("authToken");
    }

    return result;
  },
  tagTypes: [],
  endpoints: () => ({}),
});
