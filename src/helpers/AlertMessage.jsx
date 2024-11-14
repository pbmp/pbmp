import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const toastMessage = (type, messages, position = "bottom-right") => {
  toast[type](messages, {
    position: position,
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    className: "toast",
  });
};
