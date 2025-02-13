import PropTypes from "prop-types";

export const formatName = (nama) => {
  return nama.replace(/,.*/g, "").trim().replace(/\s+/g, "-").toLowerCase();
};

formatName.propTypes = {
  nama: PropTypes.string,
};
