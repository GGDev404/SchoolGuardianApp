const API_URL = 'https://api-schoolguardian.onrender.com/api/users';

export async function signUp({ name, email, password, role, user_uuid }: {
  name: string;
  email: string;
  password: string;
  role: string;
  user_uuid?: string;
}) {
  const body: any = { name, email, password, role };
  if (role === 'Student' && user_uuid) body['user_uuid'] = user_uuid;
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  let responseJson;
  try {
    responseJson = await res.json();
  } catch (e) {
    responseJson = null;
  }
  if (!res.ok) {
    const errorMsg = responseJson?.message || responseJson?.error || 'Error al crear usuario';
    throw new Error(errorMsg);
  }
  return responseJson;
}
