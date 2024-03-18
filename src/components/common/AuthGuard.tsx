
import { Navigate, Outlet } from "react-router-dom";
import { PublicRoutes } from "@/routes";
import { getToken } from "@/services/persist-user.service.ts";

const AuthGuard = () => {
  const userState = getToken() ? true : false; 
  return userState ? <Outlet /> : <Navigate replace to={PublicRoutes.LOGIN} />

};

export default AuthGuard;
