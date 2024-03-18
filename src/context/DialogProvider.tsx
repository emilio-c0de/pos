import { Dialog, Slide, styled } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React, { FC, forwardRef } from "react";

type ProviderContext = readonly [(option: DialogOption) => void, () => void];

const EMPTY_FUNC = () => { };
const DialogContext = React.createContext<ProviderContext>([
    EMPTY_FUNC,
    EMPTY_FUNC
]);
// eslint-disable-next-line react-refresh/only-export-components
export const useDialog = () => React.useContext(DialogContext);

type DialogParams = {
    fullScreen?: boolean
    children: React.ReactNode;
    open: boolean;
    maxWidth: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false,
    scroll?: 'paper'|'body'
    onClose?: () => void;
    onExited?: () => void;
};
type DialogOption = Omit<DialogParams, "open">;
type DialogContainerProps = DialogParams & {
    onClose: () => void;
    onKill: () => void;
};


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="down" ref={ref} {...props} />;
});

function DialogContainer(props: DialogContainerProps) {
    const { children, open, maxWidth, fullScreen, scroll } = props;
    return (
        <BootstrapDialog
            scroll={scroll}
            fullScreen={fullScreen}
            fullWidth={true}
            maxWidth={maxWidth}
            open={open}
            TransitionComponent={Transition}
            keepMounted   >
            {children}
        </BootstrapDialog>
    );
}

const DialogProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [dialogs, setDialogs] = React.useState<DialogParams[]>([]);
    const createDialog = (option: DialogOption) => {
        const dialog = { ...option, open: true };
        setDialogs((dialogs) => [...dialogs, dialog]);
    };
    const closeDialog = () => {
        setDialogs((dialogs) => {
            const updatedDialogs = [...dialogs];
            const latestDialog = updatedDialogs.pop();

            if (!latestDialog) {
                // No dialogs left, reset state
                return [];
            }

            if (latestDialog.onClose) {
                latestDialog.onClose();
            }

            return updatedDialogs;
        });
    };
    const contextValue = React.useRef([createDialog, closeDialog] as const);

    return (
        <DialogContext.Provider value={contextValue.current}>
            {children}
            {dialogs.map((dialog, i) => {
                const { ...dialogParams } = dialog;
                const handleKill = () => {
                    if (dialog.onExited) dialog.onExited();
                    setDialogs((dialogs) => dialogs.slice(0, dialogs.length - 1));
                };

                return (
                    <DialogContainer
                        key={i}
                        onClose={closeDialog}
                        onKill={handleKill}
                        {...dialogParams}
                    />
                );
            })}
        </DialogContext.Provider>
    );
}


export default DialogProvider;