import PropTypes from "prop-types";

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(date);
};

formatDate.propTypes = {
  dateString: PropTypes.string,
};
