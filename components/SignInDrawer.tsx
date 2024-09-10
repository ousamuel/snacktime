import {
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { signInAction } from "@/app/actions";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/submit-button";
export default function SignInDrawerContent() {

  return (
        <DrawerContent className="items-center h-2/3">
          <form className="flex-1 flex flex-col w-full  gap-2 text-foreground [&>input]:mb-6 max-w-md p-4">
            <DrawerTitle>
              <p className="text-2xl font-medium">Log in</p>
            </DrawerTitle>
            <p className="text-sm text-foreground/60">
              Don't have an account?{" "}
              <Link
                className="text-blue-600 font-medium underline"
                href="/sign-up"
              >
                Sign up
              </Link>
            </p>
            <DrawerDescription asChild>
              <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                <Label htmlFor="email">Email</Label>
                <Input name="email" placeholder="you@example.com" required />
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>

                  <Link
                    className="text-sm text-blue-600 underline"
                    href="/forgot-password"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <Input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  required
                />
                <SubmitButton
                  formAction={signInAction}
                  pendingText="Signing In..."
                >
                  Log in
                </SubmitButton>
              </div>
            </DrawerDescription>
          </form>
        </DrawerContent>
  );
}
