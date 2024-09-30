import { signInAction } from "@/app/actions";
import SignInDrawerContent from "@/components/SignInDrawer";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { headers } from "next/headers";
import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";
// import { createClient } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";
export default async function Signup({
  searchParams,
}: {
  searchParams: Message & { referralCode?: string };
}) {
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  const signUpAction = async (formData: FormData) => {
    "use server";
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const confirmPassword = formData.get("confirmPassword")?.toString();
    const referralCode =
      searchParams.referralCode || formData.get("referralCode")?.toString();
    const origin = headers().get("origin");

    // validate acceptable form inputs
    if (!email || !password) {
      return encodedRedirect(
        "error",
        "/sign-up",
        "Email and password are required"
      );
    }
    if (confirmPassword != password) {
      return encodedRedirect("error", "/sign-up", "Passwords are not matching");
    }
    if (!referralCode) {
      return encodedRedirect("error", "/sign-up", "Referral code is required");
    }

    // Check
    let currentDateTime = new Date();
    const { data: referralData, error: referralError } = await supabase
      .from("referrals")
      .select("expires_at")
      .eq("referral_code", referralCode)
      .eq("used", false)
      .single();
    if (referralError || referralData.expires_at < currentDateTime) {
      return encodedRedirect(
        "error",
        "/sign-up",
        "Invalid or expired referral code"
      );
    }

    // Query the `public.users` table to check if the email is already in use
    const { data: existingUser, error: userError } = await supabase
      .from("users")
      .select()
      .eq("email", email)
      .single();
    if (userError && userError.code !== "PGRST116") {
      console.log(userError);
      return encodedRedirect(
        "error",
        `/sign-up`,
        "Unexpected error, please try again."
      );
    }
    // If an existing user is found, prevent the sign-up
    if (existingUser) {
      return encodedRedirect("error", `/sign-up`, "Email already in use");
    }
    // Proceed with sign up if referral code is valid
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });
    if (signUpError) {
      console.error("Sign-up error:", signUpError.code, signUpError.message);
      return encodedRedirect("error", `/sign-up`, "Error trying to sign up");
    } else {
      // const { error: useReferral } = await supabase
      //   .from("referrals")
      //   .update({ used: true })
      //   .eq("referral_code", referralCode)
      //   .single();
      // const { data } = await supabase
      //   .from("referrals")
      //   .select("referrer_id")
      //   .eq("referral_code", referralCode)
      //   .single();
      // const { error: addReferrer } = await supabase
      //   .from("users")
      //   .update({ referrer_id: data?.referrer_id })
      //   .eq("email", email);

      return encodedRedirect(
        "success",
        `/sign-up`,
        // ?referralCode=${referralCode}
        "Thanks for signing up!  Please check your email for a verification link."
      );
    }

    // FIXFIX
  };
  const hasReferralCodeInUrl = Boolean(searchParams.referralCode);

  return (
    <>
      <div className="w-full flex flex-col justify-center items-center sm:max-w-lg gap-2 p-8">
        <section className="flex w-full">
          <Link
            href="/"
            className=" py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>{" "}
            Back
          </Link>
        </section>
        <form className="flex flex-col w-full justify-center gap-2 text-foreground [&>input]:mb-6 max-w-md">
          <h1 className="text-2xl font-medium">Sign up</h1>
          <p className="text-sm text text-foreground/60">
            Already have an account?{" "}
            <Drawer>
              <DrawerTrigger className="text-primary font-medium underline">
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
                      <Input
                        name="email"
                        placeholder="you@example.com"
                        required
                      />
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
          </p>
          <div className="mt-8 flex flex-col gap-2 [&>input]:mb-3">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              name="email"
              placeholder="you@example.com"
              required
            />
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              // required
            />
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              // required
            />
            <Label htmlFor="referralCode">Referral Code</Label>
            <Input
              type="text"
              name="referralCode"
              placeholder="Enter referral code"
              // required
              value={searchParams.referralCode}
              disabled={hasReferralCodeInUrl}
            />
            <SubmitButton formAction={signUpAction} pendingText="Signing up...">
              Sign up
            </SubmitButton>
          </div>
          <FormMessage message={searchParams} />
        </form>
      </div>
    </>
  );
}
