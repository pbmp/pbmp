import * as yup from "yup";

export const validationSchema = yup.object().shape({
  Name: yup.string().required("Name is required"),
  Email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  Phone: yup.number().required("Phone is required"),
  Alamat: yup.string().required("Address is required"),
});
