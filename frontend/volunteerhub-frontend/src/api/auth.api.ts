import api from "./axios";

export const loginApi = (data: any) =>
  api.post("/user/login", data);

export const registerApi = (data: any) =>
  api.post("/user/register", data);
