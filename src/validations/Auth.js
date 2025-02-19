import * as yup from "yup";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const authSchema = yup.object().shape({
  identifier: yup
    .string()
    .test(
      "is-valid-email-or-nidn",
      "Harap masukkan email atau NIDN yang valid",
      function (value) {
        if (!value)
          return this.createError({
            path: "identifier",
            message: "Email atau NIDN wajib diisi",
          });

        if (emailRegex.test(value)) {
          return true; // Valid sebagai email
        } else if (/^\d+$/.test(value)) {
          return true; // Valid sebagai NIDN (hanya angka)
        }

        return this.createError({
          path: "identifier",
          message: "Format tidak dikenali, masukkan email atau NIDN",
        });
      }
    )
    .required("Email atau NIDN wajib diisi"),

  password: yup.string().required("Password wajib diisi"),
});
