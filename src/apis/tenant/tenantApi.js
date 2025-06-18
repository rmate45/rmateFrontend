import { dmApi } from "@/store/dmApi";
import {
  getAuthorizationHeader,
  handleQueryError,
  handleQueryErrorAndSuccess,
} from "@/helpers/RtkQueryUtils";

export const tenantApi = dmApi.injectEndpoints({
  endpoints: (build) => ({
    getTenantList: build.query({
      query: ({ page = 1, per_page = 10, search = "" } = {}) => ({
        url: `/tenant?page=${page}&per_page=${per_page}&search=${encodeURIComponent(
          search
        )}`,
        method: "GET",
        headers: getAuthorizationHeader(),
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await handleQueryError(queryFulfilled);
      },
    }),
    getTenantById: build.query({
      query: (id) => ({
        url: `/tenant/${id}`,
        method: "GET",
        headers: getAuthorizationHeader(),
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await handleQueryError(queryFulfilled);
      },
    }),
    createTenant: build.mutation({
      query: (data) => ({
        url: "/tenant/create",
        method: "POST",
        body: data,
        headers: getAuthorizationHeader(),
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await handleQueryErrorAndSuccess(queryFulfilled, "Added", "Tenant");
      },
    }),
    updateTenant: build.mutation({
      query: ({ id, data }) => ({
        url: `/tenant/update/${id}`,
        method: "POST",
        body: data,
        headers: getAuthorizationHeader(),
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await handleQueryErrorAndSuccess(queryFulfilled, "Updated", "Tenant");
      },
    }),
    deleteTenant: build.mutation({
      query: (id) => ({
        url: `/tenant/delete/${id}`,
        method: "DELETE",
        headers: getAuthorizationHeader(),
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await handleQueryErrorAndSuccess(queryFulfilled, "Deleted", "Tenant");
      },
    }),
    getTenantDashboardSummary: build.query({
      query: ({
        type = "overview",
        filter = "custom",
        start_date,
        end_date,
        tenant_id
      }) => {
        const params = new URLSearchParams({
          type,
          filter,
          tenant_id,
          ...(start_date && { start_date }),
          ...(end_date && { end_date }),
        });

        return {
          url: `/tenant/dashboard-summary?${params.toString()}`,
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
  useGetTenantListQuery,
  useGetTenantByIdQuery,
  useCreateTenantMutation,
  useUpdateTenantMutation,
  useDeleteTenantMutation,
  useGetTenantDashboardSummaryQuery,
} = tenantApi;
