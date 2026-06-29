import api from "./axios";

export const registerEvent = (eventId: number) =>
  api.post("/event/registration/register", { eventId });

export const unregisterEvent = (eventId: number) =>
  api.post("/event/registration/unregister", { eventId });

export const checkIn = (eventId: number) =>
  api.post("/event/registration/checkin", { eventId });

export const submitFeedback = (eventId: number, rating: number) =>
  api.post("/event/registration/feedback", { eventId, rating });

export const getMyRegistrations = () =>
  api.get("/event/registration/my");

export const createOrder = (eventId: number, emailId: string) =>
  api.post(`/payment/create-order`, null, {
    params: { eventId, emailId }
  });

export const verifyPayment = (data: any) =>
  api.post(`/payment/verify`, null, {
    params: data
  });

