"use client";

import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome {session?.user?.email}</p>
      <button
        onClick={() => signOut()}
        className="mt-4 rounded bg-red-500 px-4 py-2 text-white"
      >
        Sign out
      </button>
    </div>
  );
}
