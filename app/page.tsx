"use client";

import Dashboard from "./dashboard/page";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <meta name="base:app_id" content="696e6dbbf22fe462e74c158f" />
      </Head>
      <Dashboard />
    </>
  );
}
