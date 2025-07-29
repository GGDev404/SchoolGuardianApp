const LOGIN_URL = 'https://api-schoolguardian.onrender.com/api/users/login';

export async function login({ email, password, user_uuid }: {
  email: string;
  password: string;
  user_uuid?: string;
}) {
  const body: any = { email, password };
  if (user_uuid) body['user_uuid'] = user_uuid;
  const res = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Credenciales inválidas o usuario no encontrado');
  return await res.json();
}
