import api from "./axios";

/* ============================
   USER AUTH & PROFILE APIS
   ============================ */

export const registerUser = (data: {
  emailId: string;
  password: string;
  address: string;
  phoneNumber: string;
  userRole: "VOLUNTEER" | "ORGANIZER";
}) => {
  return api.post("/user/register", data);
};

export const loginUser = (data: {
  emailId: string;
  password: string;
}) => {
  return api.post("/user/login", data);
};

export const getUserProfile = () => {
  return api.get("/user/profile");
};

export const updateUserProfile = (data: {
  emailId: string;
  phoneNumber?: number;
  address?: string;
}) => {
  return api.put("/user/update", data);
};



export const resetPassword = (data: {
  oldPassword: string;
  newPassword: string;
}) => {
  return api.post("/user/resetPassword", data);
};

export const logoutUser = () => {
  return api.post("/user/logout");
};
