import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";

export default function EventRegistrations() {
  const { eventId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["event-registrations", eventId],
    queryFn: async () => {
      const res = await api.get(`/event/registration/event/${eventId}/registrations`);
      return res.data.data;   // backend returns { success, message, data }
    },
    enabled: !!eventId,
    refetchOnWindowFocus: false,
    retry: false
  });

  if (isLoading) return <p>Loading registrations…</p>;

  if (error) return <p>Failed to load registrations</p>;

  const registrations: string[] = data || [];

  return (
    <div>
      <h2>Event Registrations</h2>

      {registrations.length === 0 && <p>No registrations yet.</p>}

      <ul>
        {registrations.map(email => (
          <li key={email}>{email}</li>
        ))}
      </ul>
    </div>
  );
}
