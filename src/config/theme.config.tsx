import { createTheme, CssBaseline, ThemeProvider } from "@mui/material"

type ThemeProp = {
    children: JSX.Element
}
export enum themePalette {
    BG = "12118B",
    PINK = "#d61672"
}

const theme = createTheme({
    palette: {
        primary: {
            main: themePalette.PINK
        }, 
    },
    typography: {
        fontFamily: "'Roboto','Poppins', sans-serif"
    },components: {
        MuiButton: {
            defaultProps: {
                style: {
                    boxShadow:'none',
                    textTransform: 'none',
                    borderRadius: '0.5em'
                }
            }
        },
        MuiCard: {
            defaultProps: {
                style: {
                    borderRadius: "1em",
                    borderBottom: `2px solid ${themePalette.PINK}`  
                }
            }
        }
    }
})

export const ThemeConfig: React.FC<ThemeProp> = ({ children }) => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    )
}