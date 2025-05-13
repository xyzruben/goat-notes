"use client";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { CardContent, CardFooter } from "./card";
import { Label } from "./label";
import { Input } from "./input";
import { useTransition } from "react";
import { Button } from "./button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { loginAction, signUpAction } from "@/actions/users";

type Props = {
    type: "login" | "signUp";
}

function AuthForm({type}: Props) {

    const isLoginForm = type === "login";

    const router = useRouter();
    const {toast} = useToast();

    const [isPending, startTransition] = useTransition();

    const handleSubmit = (formData : FormData) => {
        startTransition( async () => {
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;

            let errorMessage;
            let title;
            let description;

            if (isLoginForm) {
                errorMessage = (await loginAction(email, password)).errorMessage;
                title = "Logged in";
                description = "You have successfully logged in."
            } else {
                errorMessage = (await signUpAction(email, password)).errorMessage;
                title = "Signed up";
                description = "Check your email for confirmation link."
            }

            if (!errorMessage) {
                toast({
                    title,
                    description,
                    variant: "success",
                })
                router.replace("/");
            } else {
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive"
                })
            }
        })
    }

  return (
    <form action={handleSubmit}>
        <CardContent className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input 
        id="email"
        name="email"
        placeholder="enter your Email"
        type="email"
        required
        disabled={isPending}
        />
            </div>
            <div className="flex flex-col space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input 
        id="password"
        name="password"
        placeholder="enter your Password"
        type="password"
        required
        disabled={isPending}
        />
            </div>
        </CardContent>
        <CardFooter className="mt-4 flex flex-col gap-6">
            <Button className="w-full">
                {isPending ? <Loader2 className="animate-spin" /> : isLoginForm ? "Login" : "Sign Up"}
            </Button>
            <p className="text-xs">
                {isLoginForm ? "Don't have an account yet?" : "Already have an account?"}{" "}
                <Link href={isLoginForm ? "/sign-up" : "/login"} 
                className={`text-blue-500 underline ${isPending ? "pointer-events-none opacity-50": ""}`}>
                    {isLoginForm ? "Sign Up" : "Login"}
                </Link>
            </p>
        </CardFooter>
    </form>
  )
}

export default AuthForm;