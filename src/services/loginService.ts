const LOGIN_URL = 'https://api-schoolguardian.onrender.com/api/users/login';

export async function login({ email, password, user_uuid }: {
  email: string;
  password: string;
  user_uuid?: string;
}) {
  const body: any = { email, password };
  if (user_uuid) body['user_uuid'] = user_uuid;
  console.log('[loginService] Sending:', JSON.stringify(body));
  
  const res = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  
  let responseText = await res.text();
  console.log('[loginService] Raw response:', responseText, 'Status:', res.status);
  
  let responseJson;
  try {
    responseJson = JSON.parse(responseText);
  } catch {
    responseJson = { message: responseText };
  }
  
  if (!res.ok) {
    // Crear un error más detallado que incluya el status y la respuesta
    const error = new Error(responseJson.message || 'Error de autenticación');
    (error as any).response = {
      status: res.status,
      data: responseJson
    };
    (error as any).status = res.status;
    throw error;
  }
  
  return responseJson;
}
