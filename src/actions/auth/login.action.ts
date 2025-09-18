import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { User, db, eq } from 'astro:db';
import bcrypt from 'bcryptjs';

export const loginUser = defineAction({
  accept: 'form',
  input: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
  handler: async ({ email, password }) => {
    const [user] = await db
      .select()
      .from(User)
      .where(eq(User.email, email));

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new Error('Contraseña incorrecta');
    }

    return {
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  },
});
