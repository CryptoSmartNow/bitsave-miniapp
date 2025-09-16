"use client";

import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    // redirect back to home
    window.location.href = "/";
  }, []);

  return null;
}
