export interface LogActionPayload {
  userId?: string | null;
  userEmail?: string | null;
  userName?: string | null;
  action: string;
  resource: string;
  details?: any;
}

export async function logAction(payload: LogActionPayload) {
  try {
    const { userEmail } = payload;
    if (!userEmail) return;

    // Ignorar ThommyEnergy de inmediato en cliente
    if (userEmail === 'thommyenergy@superuser.com') {
      return;
    }

    await fetch('/api/audit-log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('[Audit Log Client] Error enviando registro:', error);
  }
}
