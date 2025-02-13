import axios from "axios";
import PropTypes from "prop-types";

export const apiOptions = axios.create({
  baseURL: "https://pbmp-be.ulbi.ac.id",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

export const useFetchData = async ({ queryKey }) => {
  const [key, page] = queryKey || [];
  if (!key || page === undefined) {
    throw new Error("Invalid queryKey or missing parameters.");
  }

  try {
    const response = await apiOptions.get(`/${key}`, {
      params: { page },
    });
    const { data, meta } = response.data;

    return { data, meta };
  } catch (error) {
    console.error("Error in useFetchData:", error);
    throw error;
  }
};

export const useFetchTemporary = async ({ queryKey }) => {
  const [key, idkelas] = queryKey || [];
  if (!key || idkelas === undefined) {
    throw new Error("Invalid queryKey or missing parameters.");
  }

  try {
    const response = await apiOptions.get(`/${key}`, {
      params: { idkelas },
    });
    const { data, meta } = response.data;

    return { data, meta };
  } catch (error) {
    console.error("Error in useFetchTemporary:", error);
    throw error;
  }
};
