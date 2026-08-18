import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(60),
  email: z.string().trim().toLowerCase().email("Correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").max(100),
});

export type RegisterInput = z.infer<typeof registerSchema>;
