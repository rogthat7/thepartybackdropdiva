export interface ConsultationRequest {
  email?: string;
  phone?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5148';

export const submitConsultation = async (request: ConsultationRequest): Promise<void> => {
  const { email, phone } = request;
  
  if (!email && !phone) {
    console.log(`[Notification Service] No contact info provided, ignoring.`);
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications/consultation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, phone })
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
