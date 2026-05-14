function requireEnv(key: string): string {
  const value = import.meta.env[key];
  if (!value) throw new Error(`Missing env variable: ${key}`);
  return value;
}

export const API_URL = requireEnv("VITE_API_URL");
