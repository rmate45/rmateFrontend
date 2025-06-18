import { serialize } from "@/helpers/utils";
import { dmApi } from "./dmApi";
import {
  getAuthorizationHeader,
  handleQueryError,
  handleQueryErrorAndSuccess,
} from "@/helpers/RtkQueryUtils";

export const globalApi = dmApi.injectEndpoints({
  endpoints: (build) => ({
    getRoles: build.query({
      query: (data) => {
        const paramData = serialize(data);
        return {
          url: `/roles?${paramData}`,
          method: "GET",
          headers: getAuthorizationHeader(),
        };
      },
      providesTags: ["getAllRoles"],
      async onQueryStarted(_, { queryFulfilled }) {
        await handleQueryError(queryFulfilled);
      },
    }),

    getEnums: build.query({
      query: () => ({
        url: `/enums`,
        method: "GET",
        headers: getAuthorizationHeader(),
      }),
      // providesTags: ["getEnums"],
      async onQueryStarted(_, { queryFulfilled }) {
        await handleQueryError(queryFulfilled);
      },
    }),

    getPropertyCategories: build.query({
      query: () => ({
        url: `/property-categories`,
        method: "GET",
        headers: getAuthorizationHeader(),
      }),
      // providesTags: ["getPropertyCategories"],
      async onQueryStarted(_, { queryFulfilled }) {
        await handleQueryError(queryFulfilled);
      },
    }),

    getPropertyAmenities: build.query({
      query: () => ({
        url: `/property-amenities`,
        method: "GET",
        headers: getAuthorizationHeader(),
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await handleQueryError(queryFulfilled);
      },
    }),

    deleteMedia: build.mutation({
      query: (body) => ({
        url: `/media/deletion`,
        method: "POST",
        headers: {
          ...getAuthorizationHeader(),
          "Content-Type": "application/json",
        },
        body,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await handleQueryErrorAndSuccess(queryFulfilled, {
          successMsg: "Media deleted successfully",
        });
      },
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetEnumsQuery,
  useGetPropertyCategoriesQuery,
  useGetPropertyAmenitiesQuery,
  useDeleteMediaMutation,
} = globalApi;
