import ErrorBoundary from '@/components/common/ErrorBoundary';
import { isApiResponse } from '@/models/api-response.ts';
import { UserRole } from '@/models/user.model';
import { PrivateRoutes } from '@/routes';
import { authService } from '@/services/auth.service.ts';
import { setDataEstab, setEstabs, setToken, setUserData } from '@/services/persist-user.service.ts';
import { hideLoader, showLoader } from '@/utils/loader';
import { notify, ToastType } from '@/utils/toastify/toastify.util';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Avatar, Box, Button, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, Typography } from '@mui/material'
import { pink } from '@mui/material/colors'
import { useFormik } from 'formik';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import Copyright from './components/Copyright';
import EstabsDialog from './components/EstabsDialog';

const LoginPage = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [open, setOpen] = useState(false);
    const [userRoles, setUserRoles] = useState<Array<UserRole>>([]);

    const validationSchema = yup.object({
        username: yup.string().trim("Usuario es requerido").required('Usuario es requerido'),
        password: yup
            .string().trim("Contraseña es requerido").required('Contraseña es requerida'),
    });

    const setDataLogin = (dataLogin: UserRole) => {
        notify({
            type: ToastType.Success,
            content: "Inciando Sessión"
        })

        setToken(dataLogin.token)
        setUserData(dataLogin);
        setEstabs(dataLogin.establecimientos);
        if (dataLogin.establecimientos.length == 1) {
            setDataEstab(dataLogin.establecimientos[0])
        }
        navigate(`/${PrivateRoutes.POS}`, { replace: true });
    }

    const login = (username: string, password: string) => {
        try {
            showLoader();
            const agent = navigator.userAgent;
            const paramsOption = JSON.stringify({ application: "Restaurant", browser: agent });

            authService.login(username, password, paramsOption).then(response => {
                if (isApiResponse(response)) {
                    if (response.code === "0") {
                        notify({
                            type: ToastType.Warning,
                            content: response.message
                        })
                    }
                    if (response.code === "1") {
                        if (typeof response.payload === 'string') {
                            let userRoles: Array<UserRole> = JSON.parse(response.payload);

                            userRoles = authService.mapUserRole(userRoles)

                            const establecimientos = userRoles.flatMap(userRole => userRole.establecimientos)
                            if (establecimientos.length > 1) {
                                setUserRoles(userRoles)
                                setOpen(true);
                            } else {

                                const dataLogin = userRoles[0];
                                setDataLogin(dataLogin)
                            }
                        }
                    }

                }
            }).finally(() => {
                hideLoader();
            })
        } catch (error) {
            console.log(error)
            hideLoader();
        }
    }

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            login(values.username, values.password)
        }
    });





    const handleClickShowPassword = () => setShowPassword((show) => !show);

    return (
        <ErrorBoundary fallBackComponent={<h1>Error al cargar login</h1>}>
            <Box
                sx={{
                    my: 8,
                    mx: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{
                    m: 1,
                    bgcolor: pink[500],
                }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Inicio de Sesión
                </Typography>
                <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
                    <FormControl variant="outlined" margin='normal' fullWidth error={formik.touched.username && Boolean(formik.errors.username)}>
                        <InputLabel htmlFor="username">Usuario</InputLabel>
                        <OutlinedInput
                            id="username"
                            type="text"
                            required
                            name="username"
                            label="Usuario"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <FormHelperText id="username-error-text">
                            {formik.touched.username && formik.errors.username
                                ? formik.errors.username
                                : ''}
                        </FormHelperText>
                    </FormControl>
                    <FormControl variant="outlined" margin='normal' fullWidth error={formik.touched.password && Boolean(formik.errors.password)}>
                        <InputLabel htmlFor="password">Contraseña</InputLabel>
                        <OutlinedInput
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            required
                            name="password"
                            label="Contraseña"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <FormHelperText id="password-error-text">
                            {formik.touched.password && formik.errors.password
                                ? formik.errors.password
                                : ''}
                        </FormHelperText>
                    </FormControl>
                    <Button type="submit"
                        fullWidth
                        size='large'
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}>
                        Ingresar

                    </Button>
                    <Copyright sx={{ mt: 5 }} />
                </Box>
            </Box>

            {
                open && <EstabsDialog
                    userRoles={userRoles}
                    open={open}
                    onClose={setOpen}
                    setDataLogin={setDataLogin}
                />
            }
        </ErrorBoundary>
    )
}

export default LoginPage