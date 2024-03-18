import { Box, DialogTitle, IconButton } from '@mui/material'
import { CloseIcon } from '../common/IconsMaterial'

type DialogHeaderProps = {
    title: string
    close(): void
}
const DialogHeader = ({ title, close }: DialogHeaderProps) => {
    return (
        <>
            <DialogTitle sx={{ p: "11px 24px" }}>
                {title}
            </DialogTitle>
            <Box position="absolute" top={8} right={8}>
                <IconButton onClick={close}>
                    <CloseIcon />
                </IconButton>
            </Box>
        </>
    )
}

export default DialogHeader