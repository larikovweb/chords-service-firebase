import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { ITrack } from '../interfaces';

export const trackAPI = createApi({
  reducerPath: 'trackAPI',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://65225287f43b17938414629b.mockapi.io/api/v1' }),
  tagTypes: ['Track'],
  endpoints: (build) => ({
    fetchAllTracks: build.query<ITrack[], number>({
      query: (limit = 5) => ({
        url: `/tracks`,
        params: {
          page: 1,
          limit: limit,
        },
      }),
      providesTags: () => ['Track'],
    }),
    // TODO при переносе на нормальный бэк, надо убрать ITrack[] у fetchTrack
    fetchTrack: build.query<ITrack[], number | undefined>({
      query: (id) => ({
        url: `/tracks`,
        params: {
          id: id,
        },
      }),
      providesTags: () => ['Track'],
    }),
    createTrack: build.mutation<ITrack, ITrack>({
      query: (track) => ({
        url: `/tracks`,
        method: 'POST',
        body: track,
      }),
      invalidatesTags: ['Track'],
    }),
    updateTrack: build.mutation<ITrack, ITrack>({
      query: (track) => ({
        url: `/tracks/${track.id}`,
        method: 'PUT',
        body: track,
      }),
      invalidatesTags: ['Track'],
    }),
    deleteTrack: build.mutation<ITrack, ITrack>({
      query: (track) => ({
        url: `/tracks/${track.id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Track'],
    }),
  }),
});
