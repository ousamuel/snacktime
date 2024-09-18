import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import Link from "next/link";
import SignInDrawerContent from "@/components/SignInDrawer";
export default function Index() {
  return (
    <>
      {/* <Hero /> */}
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-5xl flex justify-center items-center p-3 px-5 text-sm">
          {/* <div className="flex gap-5 items-center font-semibold">
                    <Link href={"/"}>Next.js Supabase Starter</Link>
                    <div className="flex items-center gap-2">
                    </div>
                  </div> */}
          <Link href="/" className="text-4xl font-bold">
            SNACKTIME
          </Link>
        </div>
      </nav>

      <Drawer>
        <DrawerTrigger className="text-xl p-10 bg-accent my-10">
          Log in
        </DrawerTrigger>
        <SignInDrawerContent />
        {/* <DrawerContent className="items-center h-2/3">
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
        </DrawerContent> */}
      </Drawer>
    </>
  );
}
