import PropTypes from "prop-types";

export const formatName = (nama, type = "name") => {
  if (!nama) return "";

  return type === "name"
    ? nama
        .replace(/,.*/g, "")
        .trim()
        .replace(/\s+/g, "")
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : nama.trim().toUpperCase();
};

formatName.propTypes = {
  nama: PropTypes.string,
  type: PropTypes.string,
};
