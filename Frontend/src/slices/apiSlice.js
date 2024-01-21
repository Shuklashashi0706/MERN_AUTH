// Importing necessary functions from the "@reduxjs/toolkit/query/react" library.
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Creating a base query using the fetchBaseQuery function and providing an empty baseUrl.
// The empty string is used because a proxy is configured in vite.config.js.
const baseQuery = fetchBaseQuery({ baseUrl: "http://localhost:4000" });

// Creating an API slice using createApi function.
export const apiSlice = createApi({
  baseQuery, // Providing the base query created above.

  // Defining tag types for caching. In this case, a tag type 'User' is specified.
  tagTypes: ["User"],

  // Defining endpoints using the builder parameter.
  endpoints: (builder) => ({}),
});
