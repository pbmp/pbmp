import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";

export const toastMessage = (type, message, option = {}) => {
  toast[type](message, {
    position: option.position || "top-right",
    autoClose: option.autoClose || 3000,
    hideProgressBar: option.hideProgressBar || false,
    closeOnClick: option.closeOnClick || true,
    pauseOnHover: option.pauseOnHover || true,
    draggable: option.draggable || true,
    progress: option.progress || undefined,
    theme: option.theme || "light",
  });
};

toastMessage.propTypes = {
  type: PropTypes.string,
  message: PropTypes.string,
  option: PropTypes.object,
};

export const toastPromise = (
  promise,
  defaultMessages,
  option = {},
  onCloseCallback = null
) => {
  const { pending, success, error } = defaultMessages;

  let isSuccessful = false;

  return toast.promise(
    promise
      .then((res) => {
        isSuccessful = true;
        return res;
      })
      .catch((err) => {
        isSuccessful = false;
        throw err;
      }),
    {
      pending: pending || "Processing...",
      success: {
        render({ data }) {
          return data?.data?.message || success || "Action successful!";
        },
      },
      error: {
        render({ data }) {
          return data?.response?.data?.message || error || "An error occurred!";
        },
      },
    },
    {
      position: option.position || "top-center",
      autoClose: option.autoClose || 3000,
      hideProgressBar: option.hideProgressBar || false,
      closeOnClick: option.closeOnClick || true,
      pauseOnHover: option.pauseOnHover || true,
      draggable: option.draggable || true,
      progress: option.progress || undefined,
      theme: option.theme || "light",
      onClose: () => {
        if (onCloseCallback) {
          onCloseCallback(isSuccessful);
        }
      },
    }
  );
};

toastPromise.propTypes = {
  promise: PropTypes.object,
  defaultMessages: PropTypes.object,
  option: PropTypes.object,
  onCloseCallback: PropTypes.func,
};
