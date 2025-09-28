'use client';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues } from "@/types/auth";
import { loginSchema } from "@/lib/validation";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/services/auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {


  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });


  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: LoginFormValues) =>
      await loginUser(email, password),
    onSuccess: async (data) => {
      toast.success("Connexion réussie !");

      await login({
        token: data.token,
        dataUser: data.user,
      });
      router.refresh();
    },
    onError: (error: any) => {
      if (error?.response?.data) {
        toast.error(
          error?.response?.data?.message || "Échec de l'authentification"
        );
      } else {
        toast.error("Erreur lors de la connexion");
      }
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    loginMutation.mutate(data);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Content de te revoir</h1>
                <p className="text-muted-foreground text-balance">
                  Connectez-vous à votre compte Budget.
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...register("email")}
                />

                {errors.email && (
                  <p
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.email.message as string}
                  </p>)}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Mot de passe oublié?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  {...register("password")}
                />

                {errors.password && (
                  <p
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.password.message as string}
                  </p>)}
              </div>
              <Button
                type="submit"
                className="w-full cursor-pointer"
                onClick={handleSubmit(onSubmit)}
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    Connexion en cours...
                    <Loader2 className="w-15 h-15 animate-spin" />
                  </span>
                ) : (
                  'Connecter'
                )}
              </Button>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
