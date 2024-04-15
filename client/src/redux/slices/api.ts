import { apiUrlDB } from "@/lib/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrlDB,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getUserDetails: builder.query<any, void>({
      query: () => ({ url: "api/auth/user-details", cache: "no-store" }),
    }),
  }),
});

export const { useGetUserDetailsQuery } = api;
