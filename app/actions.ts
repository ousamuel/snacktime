"use server";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const addProductAction = async (formData: any) => {
  console.log(formData);

  return { error: "nice" };
};

export const signUpAction = async (formData: FormData) => {
  "use server";
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();
  const referralCode = formData.get("referralCode")?.toString();
  const supabase = createClient();
  const origin = headers().get("origin");

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
  let currentDateTime = new Date();
  const { data: validReferralData, error: referralError } = await supabase
    .from("referrals")
    .select()
    .eq("referral_code", referralCode);
  // .eq("used", false)
  // .single();

  console.log(validReferralData);
  // || validReferral.expires_at < currentDateTime
  if (referralError) {
    console.log(referralError);
    return encodedRedirect(
      "error",
      "/sign-up",
      "Invalid or expired referral code"
    );
  }

  // // Query the `public.users` table to check if the email is already in use
  // const { data: existingUser, error: userError } = await supabase
  //   .from("users")
  //   .select("id")
  //   .eq("email", email)
  //   .single();
  // if (userError && userError.code !== "PGRST116") {
  //   // Handle any unexpected errors (ignore no rows found error)
  //   console.error("Error querying users:", userError.message);
  //   return { error: "Unexpected error occurred. Please try again." };
  // }
  // // If an existing user is found, prevent the sign-up
  // if (existingUser) {
  //   return encodedRedirect("error", "/signup", "Email already in use");
  // }

  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (signUpError) {
    console.error(signUpError.code + " " + signUpError.message);
    return encodedRedirect(
      "error",
      "/sign-up",
      "Error signing up. Please try again or contact us snacktimeexec@gmail.com"
    );
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up!  Please check your email for a verification link."
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Invalid login credentials" };
  }

  return redirect("/verified");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = createClient();
  const origin = headers().get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/verified/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/verified/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/verified/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/verified/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/verified/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
