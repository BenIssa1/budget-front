import { z } from "zod";

/* User */

export const loginSchema = z.object({
  email: z.string().min(1, { message: "L'email est requis" }),
  password: z.string().min(1, { message: "Le mot de passe est requis" }),
});

export const userFormSchema = z.object({
  email: z.string().min(1, { message: "L'email est requis" }),
  lastName: z.string().min(1, { message: "Le nom est requis" }),
  firstName: z.string().min(1, { message: "Le prénoms est requis" }),
  password: z.string().min(1, { message: "Le mot de passe est requis" }),
});

export const userEditFormSchema = z.object({
  email: z.string().min(1, { message: "L'email est requis" }),
  lastName: z.string().min(1, { message: "Le nom est requis" }),
  firstName: z.string().min(1, { message: "Le prénoms est requis" }),
  password: z.string().optional(),
});

export type userFormData = z.infer<typeof userFormSchema>;
export type userEditFormData = z.infer<typeof userEditFormSchema>;

export const emailSchema = z.object({
  email: z.string().email("Adresse email invalide"),
});

export const otpSchema = z.object({
  code: z.string().length(4, "Le code doit contenir 4 chiffres"),
});

export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(4, "Le mot de passe doit contenir au moins 4 caractères"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

/* Budget */

export const budgetFormSchema = z
  .object({
    label: z.string().min(1, "Le libellé du budget est requis"),
    amount: z.string().min(1, "Le montant du budget est requis"),
    description: z.string().min(1, "La description est requise"),
  })
  .refine((data) => {
    const value = Number(data.amount);
    return !isNaN(value) && value > 0;
  }, {
    path: ["amount"],
    message: "Le montant doit être un nombre supérieur à 0",
  });

export const budgetEditFormSchema = z
  .object({
    label: z.string().min(1, "Le libellé du budget est requis"),
    amount: z.string().min(1, "Le montant du budget est requis"),
    description: z.string().min(1, "La description est requise"),
  })
  .refine((data) => {
    const value = Number(data.amount);
    return !isNaN(value) && value > 0;
  }, {
    path: ["amount"],
    message: "Le montant doit être un nombre supérieur à 0",
  });
export type BudgetFormData = z.infer<typeof budgetFormSchema>;
export type BudgetEditFormData = z.infer<
  typeof budgetEditFormSchema
>;

/* Service */

export const serviceFormSchema = z
  .object({
    label: z.string().min(1, "Le libellé du service est requis"),
    description: z.string().min(1, "La description est requise"),
  });

export const serviceEditFormSchema = z
  .object({
    label: z.string().min(1, "Le libellé du service est requis"),
    description: z.string().min(1, "La description est requise"),
  });

export type serviceFormData = z.infer<typeof serviceFormSchema>;
export type serviceEditFormData = z.infer<
  typeof serviceEditFormSchema
>;

/* Pricing Free */

export const pricingFreeFormSchema = z
  .object({
    contact: z.string().min(1, "Le contact est requis"),
    description: z.string().min(1, "La description est requise"),
  });

export const pricingFreeEditFormSchema = z
  .object({
    contact: z.string().min(1, "Le contact est requis"),
    description: z.string().min(1, "La description est requise"),
  })

export type pricingFreeFormData = z.infer<typeof pricingFreeFormSchema>;
export type pricingFreeEditFormData = z.infer<
  typeof pricingFreeEditFormSchema
>;


/* Pricing Paid */

export const pricingPaidFormSchema = z
  .object({
    ordernumber: z.string().min(1, "Le numéro d'ordre est requis"),
    prefix: z.string().min(1, "Le préfix est requis"),
    amount: z.string().min(1, "Le montant est requis"),
    description: z.string().min(1, "La description est requise"),
  }).refine((data) => {
    const value = Number(data.amount);
    return !isNaN(value) && value > 0;
  }, {
    path: ["amount"],
    message: "Le montant doit être un nombre supérieur à 0",
  });

export const pricingPaidEditFormSchema = z
  .object({
    ordernumber: z.string().min(1, "Le numéro d'ordre est requis"),
    prefix: z.string().min(1, "Le préfixe est requis"),
    amount: z.string().min(1, "Le montant est requis"),
    description: z.string().min(1, "La description est requise"),
  }).refine((data) => {
    const value = Number(data.amount);
    return !isNaN(value) && value > 0;
  }, {
    path: ["amount"],
    message: "Le montant doit être un nombre supérieur à 0",
  });

export type pricingPaidFormData = z.infer<typeof pricingPaidFormSchema>;
export type pricingPaidEditFormData = z.infer<
  typeof pricingPaidEditFormSchema
>;

/* Configuration */

export const configFormSchema = z
  .object({
    ip: z.string().ip("Adresse IP invalide"),
    clientId: z.string().min(1, "L'ID client est requis"),
    secretId: z.string().min(1, "L'ID secret est requis"),
    isActive: z.boolean().optional(),
  });

export const configEditFormSchema = z
  .object({
    ip: z.string().ip("Adresse IP invalide"),
    clientId: z.string().min(1, "L'ID client est requis"),
    secretId: z.string().min(1, "L'ID secret est requis"),
    isActive: z.boolean().optional(),
  });

export type configFormData = z.infer<typeof configFormSchema>;
export type configEditFormData = z.infer<typeof configEditFormSchema>;