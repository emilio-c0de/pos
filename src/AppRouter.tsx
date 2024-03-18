import { lazy } from 'react'
import { Navigate, Route } from 'react-router-dom'

import AuthGuard from './components/common/AuthGuard'
import RoutesWithNotFound from './components/common/RoutesWithNotFound'
import LoginPage from './pages/login-page/LoginPage'
import { PrivateRoutes, PublicRoutes } from './routes'

const AuthLayout = lazy(() => import("@/layouts/AuthLayout"));
const MainLayout = lazy(() => import("@/layouts/MainLayout"));
// const Sale = lazy(() => import("@/pages/sale/Sale"));
const DashboardPage = lazy(() => import("@/pages/dashboard-page/DashboardPage"));
const CustomerCompanyPage = lazy(() => import("@/pages/customer-company-page/CustomerCompanyPage"));
const OrderPage = lazy(() => import("@/pages/order-page/OrderPage"));
const PosPage = lazy(() => import("@/pages/pos-page/POSPage"));

const AppRouter = () => {
    return (
        <RoutesWithNotFound>
            <Route element={<AuthGuard />}>
                <Route path="/" element={<MainLayout />}>
                    <Route path={PrivateRoutes.DASHBOARD} element={<DashboardPage />} />
                    <Route path="/" element={<Navigate to={PrivateRoutes.POS} />} />
                    <Route path={PrivateRoutes.POS} element={<PosPage />} />
                    <Route path={PrivateRoutes.CUSTOMER_COMPANY} element={<CustomerCompanyPage />} />
                    <Route path={PrivateRoutes.ORDER} element={<OrderPage />} />
                </Route>
            </Route>
            <Route path="/" element={<Navigate to={PrivateRoutes.POS}></Navigate>}></Route>
            <Route path={PublicRoutes.LOGIN} element={<AuthLayout />}>
                <Route index element={<LoginPage />}></Route>
            </Route>
        </RoutesWithNotFound>
    )
}

export default AppRouter