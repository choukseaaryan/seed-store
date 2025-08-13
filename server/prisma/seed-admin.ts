import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user if it doesn't exist
  const adminEmail = 'admin@seedstore.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin User',
        role: Role.ADMIN,
      },
    });
    console.log('Admin user created successfully');
  } else {
    console.log('Admin user already exists');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
