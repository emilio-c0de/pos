import { PATHS, PATHS_API } from "@/constants/constants";
import { http } from "@/utils/http";

export const tableSvc = { 
    async putStateAssigned(id: number, data: object) {
        const responseAxios = await http({
            method: 'put',
            url: `${PATHS_API.PRIVATE}${PATHS.TABLE}${id}`,
            data,
        })
        return responseAxios;
    }
}