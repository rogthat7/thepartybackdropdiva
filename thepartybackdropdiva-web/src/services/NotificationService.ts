export interface ConsultationRequest {
  name?: string;
  email?: string;
  phone?: string;
  comments?: string;
  eventType?: string;
  eventDate?: string;
  guestCount?: string;
  venueLocation?: string;
  servicesInterested?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5148';

export const submitConsultation = async (request: ConsultationRequest): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications/consultation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`Failed to submit consultation: ${response.statusText}`);
    }

    console.log(`[Notification Service] Successfully sent consultation request.`);
  } catch (error) {
    console.error(`[Notification Service] Error submitting consultation request:`, error);
    throw error;
  }
};
