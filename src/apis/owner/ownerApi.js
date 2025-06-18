import { dmApi } from "@/store/dmApi";
import {
  getAuthorizationHeader,
  handleQueryError,
  handleQueryErrorAndSuccess,
} from "@/helpers/RtkQueryUtils";

export const ownerApi = dmApi.injectEndpoints({
  endpoints: (build) => ({
    createOwner: build.mutation({
      query: (request) => ({
        url: "/owner/create",
        method: "POST",
        body: request,
        headers: getAuthorizationHeader(),
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await handleQueryErrorAndSuccess(queryFulfilled, "Added", "Owner");
      },
    }),

    getOwnerList: build.query({
      query: ({ page = 1, per_page = 10, search = "" } = {}) => ({
        url: `/owner?page=${page}&per_page=${per_page}&search=${encodeURIComponent(
          search
        )}`,
        method: "GET",
        headers: getAuthorizationHeader(),
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await handleQueryError(queryFulfilled);
      },
    }),

    getOwnerById: build.query({
      query: (id) => ({
        url: `/owner/${id}`,
        method: "GET",
        headers: getAuthorizationHeader(),
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await handleQueryError(queryFulfilled);
      },
    }),

    updateOwner: build.mutation({
      query: ({ id, data }) => ({
        url: `/owner/update/${id}`,
        method: "POST",
        body: data,
        headers: getAuthorizationHeader(),
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await handleQueryErrorAndSuccess(queryFulfilled, "Updated", "Owner");
      },
    }),

    deleteOwner: build.mutation({
      query: (id) => ({
        url: `/owner/delete/${id}`,
        method: "DELETE",
        headers: getAuthorizationHeader(),
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await handleQueryErrorAndSuccess(queryFulfilled, "Deleted", "Owner");
      },
    }),

    getOwnerDashboardSummary: build.query({
      query: ({
        type = "overview",
        filter = "yearly",
        start_date,
        end_date,
        owner_id,
      }) => {
        const params = new URLSearchParams({
          type,
          filter,
          owner_id,
          ...(start_date && { start_date }),
          ...(end_date && { end_date }),
        });

        return {
          url: `/owner/dashboard-summary?${params.toString()}`,
          method: "GET",
          headers: getAuthorizationHeader(),
        };
      },
      async onQueryStarted(_, { queryFulfilled }) {
        await handleQueryError(queryFulfilled);
      },
    }),
  }),
});

export const {
  useCreateOwnerMutation,
  useGetOwnerListQuery,
  useGetOwnerByIdQuery,
  useUpdateOwnerMutation,
  useDeleteOwnerMutation,
  useGetOwnerDashboardSummaryQuery,
} = ownerApi;
