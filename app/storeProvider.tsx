"use client";

import { useRef, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "../lib/store";
// import { createClient } from "@/utils/supabase/client";
import { createClient } from "@supabase/supabase-js";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
