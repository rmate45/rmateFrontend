import { dmApi } from "@/store/dmApi";
import {
  getAuthorizationHeader,
  handleQueryError,
  handleQueryErrorAndSuccess,
} from "@/helpers/RtkQueryUtils";

export const adminApi = dmApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminList: build.query({
      query: ({ page = 1, per_page = 10, search = "" } = {}) => ({
        url: `/subadmin?page=${page}&per_page=${per_page}&search=${encodeURIComponent(
          search
        )}`,
        method: "GET",
        headers: getAuthorizationHeader(),
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await handleQueryError(queryFulfilled);
      },
    }),
    getAdminById: build.query({
      query: (id) => ({
        url: `/subadmin/${id}`,
        method: "GET",
        headers: getAuthorizationHeader(),
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await handleQueryError(queryFulfilled);
      },
    }),
    createAdmin: build.mutation({
      query: (data) => ({
        url: "/subadmin/create",
        method: "POST",
        body: data,
        headers: getAuthorizationHeader(),
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await handleQueryErrorAndSuccess(queryFulfilled, "Added", "Admin");
      },
    }),
    updateAdmin: build.mutation({
      query: ({ id, data }) => ({
        url: `/subadmin/update/${id}`,
        method: "POST",
        body: data,
        headers: getAuthorizationHeader(),
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await handleQueryErrorAndSuccess(queryFulfilled, "Updated", "Admin");
      },
    }),
    deleteAdmin: build.mutation({
      query: (id) => ({
        url: `/subadmin/delete/${id}`,
        method: "DELETE",
        headers: getAuthorizationHeader(),
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await handleQueryErrorAndSuccess(queryFulfilled, "Deleted", "Admin");
      },
    }),
    getDashboardSummary: build.query({
      query: ({
        type = "overview",
        filter = "yearly",
        start_date,
        end_date,
      }) => {
        const params = new URLSearchParams({
          type,
          filter,
          ...(start_date && { start_date }),
          ...(end_date && { end_date }),
        });

        return {
          url: `/subadmin/dashboard-summary?${params.toString()}`,
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
  useGetAdminListQuery,
  useGetAdminByIdQuery,
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
  useGetDashboardSummaryQuery
} = adminApi;
