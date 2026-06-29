import api from "./axios";

export const listEvents = (status: "open" | "closed") =>
  api.get(`/event/list/${status}`);

export const listPublicEvents = (status: "open" | "closed") =>
  api.get(`/event/list/${status}`, { headers: {} });


export const getEvent = (id: number) =>
  api.get(`/event/${id}`);

export const createEvent = (data: any) =>
  api.post("/event/create", data);

export const updateEvent = (id: number, data: any) =>
  api.put(`/event/update/${id}`, data);

export const deleteEvent = (id: number) =>
  api.delete(`/event/delete/${id}`);

export const organizerEvents = () =>
  api.get("/event/organizer");

export const toggleRegistration = (
  eventId: number,
  allowed: boolean
) =>
  api.put(`/event/${eventId}/status`, null, {
    params: { registrationAllowed: allowed }
  });