import axios, { CancelTokenSource } from "axios";
import { http } from "./http";

const makeRequestCreator = () => {
  let call: CancelTokenSource;

  return async (query: string, params: object) => {
    // Check if we made a request
    if (call) {
      // Cancel the previous request before making a new request
      call.cancel()
    }
    // Create a new CancelToken
    call = axios.CancelToken.source()

    const res = await http({
      method: 'get',
      url: query,
      params,
      cancelToken: call.token
    })

    const result = res;
    return result;
  }
}


export const fetchSearch = makeRequestCreator()
