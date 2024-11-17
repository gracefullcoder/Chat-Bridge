import { toast } from "react-toastify";

const toastMessage = (data) => {
    if (data.status === 'success') {
        toast.success(data.message);
    } else {
        toast.error(data.message);
    }
}

export {toastMessage};