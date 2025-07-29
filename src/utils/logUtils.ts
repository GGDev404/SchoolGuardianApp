// Funciones utilitarias
export function formatLog(message: string): string {
  const timestamp = new Date().toLocaleTimeString();
  return `[${timestamp}] ${message}`;
}
