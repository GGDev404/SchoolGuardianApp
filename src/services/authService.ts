const API_URL = 'https://api-schoolguardian.onrender.com/api/users';

export async function signUp({ name, email, password, role, user_uuid, matricula }: {
  name: string;
  email: string;
  password: string;
  role: string;
  user_uuid?: string;
  matricula?: string;
}) {
  const body: any = { name, email, password, role, matricula };
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
    const errorMsg = responseJson?.message || responseJson?.error || require('../i18n').t('es', 'errors', 'errorCreatingUser');
    throw new Error(errorMsg);
  }
  return responseJson;
}
