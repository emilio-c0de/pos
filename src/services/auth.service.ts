import { http } from "@/utils/http";
import { ApiResponse } from "@/models/api-response.ts";
import { PERSIS_USER, PATHS_API } from "@/constants/constants.ts";
import { UserRole } from "@/models/user.model.ts";


class AuthService {
  async login(username: string, password: string, userAgent: string): Promise<ApiResponse> {
    const response = await http({
      method: "post",
      url: PATHS_API.ACCOUNT,
      data: {
        username,
        password,
        userAgent,
        external: true,
      },
    });
    return response.data;
  }


  async createToken(data: object) {
    const response = await http({
      method: "post",
      url: PATHS_API.CREATE_TOKEN,
      data,
    });
    return response.data;
  }

  mapUserRole(userRoles: Array<UserRole>) {
    return userRoles.map(userRole => { 
      return {
        userId: userRole.userId,
        userRoleId: userRole.userRoleId,
        codeRole: userRole.codeRole,
        role: userRole.role,
        username: userRole.username,
        fullname: userRole.fullname,
        email: userRole.email,
        IDCardUser: userRole.IDCardUser,
        profilePicture: userRole.profilePicture,
        tradeName: userRole.tradeName,
        bussinesName: userRole.bussinesName,
        IDCardCompany: userRole.IDCardCompany,
        companyId: userRole.companyId,
        token: userRole.token,
        urlGateway: userRole.urlGateway,
        establecimientos: userRole.establecimientos.map(estab => {
          return {
            idEstab_Asig: estab.idEstab_Asig,
            codEstab_Asig: estab.codEstab_Asig,
            idUsuarioRol: estab.idUsuarioRol,
            codEstab: estab.codEstab,
            predeterminado: estab.predeterminado,
            defaultEstab: estab.predeterminado,
            usuario: estab.usuario,
            idEstablecimiento: estab.idEstablecimiento,
            ruc: estab.ruc,
            nombreComercial: estab.nombreComercial,
            estab: estab.estab,
            idEntidad: estab.idEntidad,
            entidad: estab.entidad,
            rucEmpresa: estab.rucEmpresa
          }
        })
      }
    })
  }

  getToken(): string | null {
    return localStorage.getItem(PERSIS_USER.TOKEN);
  }

  decodeToken() {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    const tokenToAtob = token.split(".");
    if (!tokenToAtob) return null;

    const object = JSON.parse(atob(tokenToAtob[1]!));
    return object;
  }

  //Verificamos si el token es expirado
  isTokenExpired() {
    const token = this.decodeToken();
    if (!token) {
      return true;
    }

    if (token?.exp * 1000 < new Date().getTime()) {
      return true;
    }
    return false;
  }

  clearStorageToken() {
    Object.keys(localStorage).forEach(function (key) {
      localStorage.removeItem(key);
    })
  }

}


export const authService = new AuthService()
