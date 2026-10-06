"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me", {
      credentials: "include",
    })
      .then(async (response) => {
        if (!response.ok) {
          setUser(null);
          return;
        }

        const data = await response.json();
        setUser(data.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <nav>
      <Link href="/">
        Mentor Token
      </Link>

      <div>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </div>

      <div>
        {!loading && (
          <>
            {user ? (
              <Link
                href={
                  user.role === "mentor"
                    ? "/dashboard/mentor"
                    : "/dashboard/startup"
                }
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/auth/login">
                  Login
                </Link>

                <Link href="/auth/register">
                  Get Started
                </Link>
              </>
            )}
          </>
        )}
      </div>
    </nav>
  );
}