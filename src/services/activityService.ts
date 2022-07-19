import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./baseQuery";

export type GetActivityResponse = {
  activity: {
    activityId: string;
    activityName: string;
    activityDescription: string;
    createdAt: string;
  }[];
}

export type CreateActivityRequest = {
  activityName: string;
  activityDescription: string;
}

export type UpdateActivityRequest = Pick<CreateActivityRequest, "activityName" | "activityDescription"> & {
  activityId: string;
}

export const activityService = createApi({
  reducerPath: "activity",
  baseQuery,
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  endpoints: (builder) => ({
    getActivities: builder.query<HttpResponse<GetActivityResponse>, void>({
      query: () => ({
        url: "/activity",
        method: "GET",
      }),
    }),

    createActivity: builder.mutation<HttpResponse<null>, CreateActivityRequest>({
      query: (body) => ({
        url: "/activity",
        method: "POST",
        body,
      }),
    }),

    updateActivity: builder.mutation<HttpResponse<null>, UpdateActivityRequest>({
      query: ({ activityId, activityName, activityDescription }) => ({
        url: `/activity/${activityId}`,
        method: "PUT",
        body: {
          activityName,
          activityDescription,
        },
      }),
    }),

    deleteActivity: builder.mutation<HttpResponse<null>, string>({
      query: (activityId) => ({
        url: `/activity/${activityId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetActivitiesQuery,
  useCreateActivityMutation,
  useUpdateActivityMutation,
  useDeleteActivityMutation,
} = activityService;
