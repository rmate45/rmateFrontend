import {
  getAuthorizationHeader,
  handleQueryError,
  handleQueryErrorAndSuccess,
} from "@/helpers/RtkQueryUtils";
import { dmApi } from "@/store/dmApi";

export const authApi = dmApi.injectEndpoints({
  endpoints: (build) => ({
    loginUser: build.mutation({
      query: (request) => ({
        url: "/login",
        method: "POST",
        body: request,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await handleQueryError(queryFulfilled);
      },
    }),
    forgotPassword: build.mutation({
      query: (request) => ({
        url: "/forgot-password",
        method: "POST",
        body: request,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await handleQueryError(queryFulfilled);
      },
    }),
    resetPassword: build.mutation({
      query: (request) => ({
        url: "/reset-password",
        method: "POST",
        body: request,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await handleQueryError(queryFulfilled);
      },
    }),
    changePassword: build.mutation({
      query: ({ id, data }) => ({
        url: `/change-password/${id}`,
        method: "PUT",
        body: data,
        headers: getAuthorizationHeader(),
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await handleQueryErrorAndSuccess(queryFulfilled);
      },
    }),
  }),
});

export const {
  useLoginUserMutation,
  useForgotPasswordMutation,
  useChangePasswordMutation,
  useResetPasswordMutation,
} = authApi;
