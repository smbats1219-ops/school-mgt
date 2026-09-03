import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from '../generated/prisma/client';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

const SYSTEM_ROLE_KEYS = [
  {
    role_key: 'super_admin',
    name: 'Super Admin',
    description: 'Full system access and management.',
  },
  {
    role_key: 'admin',
    name: 'Admin',
    description: 'Manages users, roles, and core configuration.',
  },
  {
    role_key: 'manager',
    name: 'Manager',
    description: 'Oversees day-to-day operations.',
  },
  {
    role_key: 'accountant',
    name: 'Accountant',
    description: 'Handles financial records and collections.',
  },
  {
    role_key: 'staff',
    name: 'Staff',
    description: 'General operational staff access.',
  },
  {
    role_key: 'trader',
    name: 'Trader',
    description: 'Broker and trading access.',
  },
];

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required to run the seed.');
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });

  try {
    console.log('Seeding roles…');
    for (const role of SYSTEM_ROLE_KEYS) {
      await prisma.role.upsert({
        where: { role_key: role.role_key },
        update: {
          name: role.name,
          description: role.description,
          isSystemRole: true,
          status: 'ACTIVE',
        },
        create: {
          role_key: role.role_key,
          name: role.name,
          description: role.description,
          isSystemRole: true,
          status: 'ACTIVE',
        },
      });
    }

    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@invledger.local';
    const adminFullName = process.env.ADMIN_FULL_NAME || 'System Administrator';

    const passwordHash = await hashPassword(adminPassword);
    const existing = await prisma.user.findUnique({
      where: { username: adminUsername },
    });

    let adminUser: Prisma.UserGetPayload<object>;
    if (existing) {
      adminUser = await prisma.user.update({
        where: { username: adminUsername },
        data: { status: 'APPROVED' },
      });
      console.log(
        `Admin "${adminUsername}" already exists — ensured APPROVED.`,
      );
    } else {
      adminUser = await prisma.user.create({
        data: {
          username: adminUsername,
          email: adminEmail,
          fullName: adminFullName,
          passwordHash,
          status: 'APPROVED',
        },
      });
      console.log(`Created bootstrap admin "${adminUsername}".`);
    }

    for (const roleKey of ['super_admin', 'admin']) {
      const role: Prisma.RoleGetPayload<object> | null =
        await prisma.role.findUnique({
          where: { role_key: roleKey },
        });
      if (!role) continue;
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId: adminUser.id, roleId: role.id } },
        update: {},
        create: {
          userId: adminUser.id,
          roleId: role.id,
          assignedById: adminUser.id,
        },
      });
    }

    console.log('Seed complete. Bootstrapped roles and approved admin.');
    console.log('Sign-in:');
    console.log(`  username: ${adminUsername}`);
    console.log(
      `  password: ${process.env.ADMIN_PASSWORD ? '(from ADMIN_PASSWORD env)' : 'ChangeMe123! (default — change it!)'}`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
