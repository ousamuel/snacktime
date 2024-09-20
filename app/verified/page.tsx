"use client";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { signOutAction } from "../actions";
import { redirect } from "next/navigation";
import userReducer, {
  setLoading,
  setUser,
  setSecureAccess,
  setError,
} from "@/lib/reducers/userReducer";
export default function VerifiedPage() {
  const router = useRouter();

  // storing user data and admin check into redux store
  const dispatch = useDispatch();
  const fetchUserAndCheckAdmin = (): any => {
    return async (dispatch: Dispatch) => {
      try {
        // Start loading
        dispatch(setLoading(true));

        // Fetch the user session
        const userResponse = await fetch("/api/user", { method: "POST" });
        const userData = await userResponse.json();

        if (userResponse.ok) {
          // Dispatch user data to the store
          dispatch(setUser(userData.user));

          // Check if the user is an admin
          const adminResponse = await fetch("/api/admin", {
            method: "POST",
            body: JSON.stringify({ userId: userData.user.id }),
          });
          const adminData = await adminResponse.json();

          if (adminResponse.ok && adminData.success) {
            dispatch(setSecureAccess(true)); // User has admin access
          } else {
            dispatch(setSecureAccess(false)); // User does not have admin access
          }
        } else {
          throw new Error(userData.error || "Failed to fetch user data");
        }
      } catch (error: any) {
        dispatch(setError(error.message));
        signOutAction();
      } finally {
        dispatch(setLoading(false)); // Stop loading
        router.push("/verified/home");
      }
    };
  };
  useEffect(() => {
    dispatch(fetchUserAndCheckAdmin());
  }, [dispatch]);
}
