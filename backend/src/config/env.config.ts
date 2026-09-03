import 'dotenv/config';

function required(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

export const config = {
  databaseUrl: required('DATABASE_URL'),
  port: Number(process.env.PORT || 4000),
  jwt: {
    secret: required('JWT_SECRET'),
    expiresIn: required('JWT_EXP_TIME'),
  },
} as const;
