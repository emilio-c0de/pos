import { Bounce, Flip, Slide, toast, Zoom } from 'react-toastify';

export enum ToastType {
    Success = "success",
    Warning = "warning",
    Info = "info",
    Error = "error"
}

type ToastTheme = "light" | "dark" | "colored";
type ToastTransition = 'Bounce' | "Slide" | "Zoom" | "Flip";

type ToastConfig = {
    position?: "bottom-left" | "top-left" | "top-right" | "top-center" | "bottom-right" | "bottom-center";
    autoClose?: number;
    hideProgressBar?: boolean;
    closeOnClick?: boolean;
    pauseOnHover?: boolean;
    draggable?: boolean;
    progress?: undefined;
    theme?: ToastTheme;
    transition?: ToastTransition;
}

type ToastProps = {
    type?: ToastType;
    content: string;
    options?: ToastConfig;
}

const transitionMap = {
    Bounce,
    Slide,
    Zoom,
    Flip
};

export const notify = (props: ToastProps) => {
    const { type, content, options = {} } = props;
    const {
        position = "bottom-left",
        autoClose = 5000,
        hideProgressBar = false,
        closeOnClick = true,
        pauseOnHover = true,
        draggable = true,
        progress,
        theme = "colored",
        transition
    } = options;

    const trans = transitionMap[transition || 'Flip'];

    const toastOptions = { 
        position,
        autoClose,
        hideProgressBar,
        closeOnClick,
        pauseOnHover,
        draggable,
        progress,
        theme,
        transition: trans || Flip,
    }; 
    switch (type) {
        case ToastType.Success:
            toast.success(content, toastOptions);
            break;
        case ToastType.Info:
            toast.info(content, toastOptions);
            break;
        case ToastType.Error:
            toast.error(content, toastOptions);
            break;
        case ToastType.Warning:
            toast.warning(content, toastOptions);
            break;
        default:
            toast(content, toastOptions);
            break;
    }
};
