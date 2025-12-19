'use server';

import prisma from '@/lib/api/prisma';
import bcrypt from 'bcryptjs';

type RegisterProps = {
  name: string;
  email: string;
  password: string;
};

export const RegisterAction = async (data: RegisterProps) => {
  try {
    const { name, email, password } = data;

    if (!name || !email || !password) {
      return { error: 'All fields are required' };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: 'Email already in use!' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return { success: 'Account created successfully!' };
  } catch (error) {
    console.error('REGISTRATION ERROR:', error);
    return { error: 'Something went wrong' };
  }
};
