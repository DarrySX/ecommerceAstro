import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { User, db, eq } from 'astro:db';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

export const registerUser = defineAction({
  accept: 'form',
  input: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
  }),
  handler: async ({ name, email, password }) => {
    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(User)
      .where(eq(User.email, email));

    if (existingUser) {
      throw new Error('El usuario ya existe con este email');
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create user
    const [newUser] = await db.insert(User).values({
      id: uuid(),
      name,
      email,
      password: hashedPassword,
      role: 'user',
    }).returning();

    const { password: _, ...userWithoutPassword } = newUser;

    return {
      ok: true,
      user: userWithoutPassword
    };
  },
});
