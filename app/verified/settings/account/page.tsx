"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { redirect } from "next/navigation";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
// NEED TO DO: implement something like aws lambda to periodically delete expired link
//  or postgres trigger that works on every X amount of inserts --> run a delete
const Account = () => {
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showReferral, setShowReferral] = useState<string>("");
  // const [mySession, setMySession] = useState<any>();
  const supabase = createClient();

  const { user, secureAccess, loading, error } = useSelector(
    (state: RootState) => state.user
  );

  function generateCode(length: number) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
    // "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }
  async function deleteAccount() {
    const { error } = await supabase.rpc("deleteUser");
    if (error) {
      console.error("Failed to delete user:", error.message);
    } else {
      return redirect("/");
    }
  }
  const minutesTillExpire = 30;
  async function createReferral() {
    try {
      const referralCode = uuidv4();
      const referralLink = `https://snacktimeworldwide.com/sign-up?referralCode=${referralCode}`;
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + minutesTillExpire);
      console.log(expiresAt);
      //   Insert referral code into Supabase
      const { data, error } = await supabase.from("referrals").insert([
        {
          referral_code: referralCode,
          referrer_id: user.id,
          referrer_email: user.email,
          used: false,
          expires_at: expiresAt,
        },
      ]);

      if (error) {
        console.error("Error creating referral:", error);
        setErrorMessage("Failed to create referral. Please try again.");
        return;
      }

      // Copy the referral link to the clipboard
      navigator.clipboard.writeText(referralLink);

      // Set the invite link to display
      setInviteLink(referralLink);
      setShowReferral(referralCode);
      setSuccessMessage("Invite link copied to clipboard!");
    } catch (error) {
      console.error("Unexpected error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  }
  const fetchReferrals = async () => {
    const date = new Date();
    console.log(date);
    const { data, error } = await supabase
      .from("referrals")
      .select("expires_at");
    data?.forEach((referral) => {
      // older dates are greater than earlier
      let referralDate = new Date(referral.expires_at);
      console.log(referralDate <= date);
    });
  };
  return (
    <ContentLayout title="Account">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Account</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <main className="w-full h-full p-4 flex justify-between">
        <div>{user ? user.email : ""}</div>
        <button onClick={fetchReferrals}> fetch referrals</button>
        <button onClick={() => console.log(generateCode(8))}>
          make code 8
        </button>
        <button
          onClick={() => {
            deleteAccount();
          }}
        >
          delete account
        </button>
        <button
          onClick={createReferral}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Generate Invite Link
        </button>

        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
        {successMessage && (
          <p className="text-green-500 mt-4">{successMessage}</p>
        )}
        {inviteLink && (
          <div className="mt-4">
            <p>Link will expire in {minutesTillExpire} minutes</p>
            <p>Referral Code: {showReferral}</p>
            <a href={inviteLink} className="text-blue-500 underline">
              Click to copy invite link to clipboard
            </a>
          </div>
        )}
      </main>
    </ContentLayout>
  );
};

export default Account;
