'use client'

import CustomSonner from "@/components/custom-sonner"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useSignInMutation } from "@/lib/services/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import Cookies from "js-cookie"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { signInSchema } from "./schemas/sign-in"
import { jwtDecode } from "jwt-decode";
import { useSendMessageMutation } from "@/lib/services/telegram"

export default function Page() {
  const router = useRouter()

  const [isVisible, setIsVisible] = useState<boolean>(false);

  const [sendMessage] = useSendMessageMutation();
  const [signIn, { isLoading: isSigningIn }] = useSignInMutation();

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    try {
      const { code, data: token, message } = await signIn(values).unwrap();
      if (code !== 200) throw new Error(message);

      const { exp } = jwtDecode<{ exp: number }>(token);
      const expires = new Date(exp * 1000);

      Cookies.set("sessionToken", token, {
        expires,
        path: "/",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });

      router.push("/")
    } catch (err: any) {
      toast.custom((t) => <CustomSonner t={t} description="Correo electrónico o contraseña incorrectos" variant="error" />)
      console.error(err)
      sendMessage({
        location: "app/(public)/sign-in/page.tsx",
        rawError: err,
        fnLocation: "onSubmit"
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 min-w-[400px]">
        <div className="grid gap-4">
          <div className="grid gap-2 group">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="email"
                  >
                    Correo electrónico
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      placeholder="m@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2 group">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="password"
                  >
                    Contraseña
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        id="password"
                        type={isVisible ? "text" : "password"}
                        placeholder="•••••••••••"
                        {...field}
                      />
                      <Button
                        className="absolute inset-y-0 end-0 flex p-0 !w-7 !h-7 items-center justify-center rounded-full text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 top-1/2 transform -translate-y-1/2 right-1.5 focus-visible:!ring-0 focus-visible:!outline-none focus-visible:!shadow-none focus-visible:ring-offset-0"
                        variant="ghost"
                        type="button"
                        onClick={toggleVisibility}
                        aria-label={isVisible ? "Hide password" : "Show password"}
                        aria-pressed={isVisible}
                        aria-controls="password"
                      >
                        {isVisible ? (
                          <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
                        ) : (
                          <Eye size={16} strokeWidth={2} aria-hidden="true" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            size="sm"
            className="w-fit ml-auto mt-2"
            loading={isSigningIn}
          >
            Iniciar sesión
          </Button>
        </div>
      </form>
    </Form>
  );
}