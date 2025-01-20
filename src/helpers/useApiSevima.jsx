import axios from "axios";

axios.defaults.withCredentials = true;

export const apiOptions = axios.create({
  baseURL: "https://pbmp-be.ulbi.ac.id",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 5000,
});

export const useFetchData = async ({ queryKey }) => {
  const [key, page] = queryKey;
  const response = await apiOptions.get(`/${key}`, {
    params: {
      page,
    },
  });

  const { data, meta } = response.data;

  return {
    data,
    meta,
  };
};
