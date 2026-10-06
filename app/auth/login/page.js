"use client";

import styles from "./page.module.css";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

 async function handleLogin(e) {
  e.preventDefault();

  setMessage("");
  setLoading(true);

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "Login failed");
      return;
    }

    if (data.data.user.role === "mentor") {
      router.push("/dashboard/mentor");
    } else if (data.data.user.role === "startup") {
      router.push("/dashboard/startup");
    }

  } catch (error) {
    setMessage(
      "Се појави грешка. Обиди се повторно."
    );
  } finally {
    setLoading(false);
  }
}
  return (
    <main className={styles["auth-page"] + " " + styles["auth-login"]}>
      <div className={styles["auth-container"]}>
        <section className={styles["auth-left"]} aria-label="Mentor Token">
          <div className={styles["left-content"]}>
            <h1>GROW<br />YOUR<br />STARTUP!</h1>
            <p>MONITORING AND EVALUATING NOW IS EASY!</p>
            <div className={styles["rocket"]}><svg viewBox="0 0 300 340" fill="none" aria-hidden="true">
                <defs>
                  <linearGradient id="rocket-body" x1="98" y1="50" x2="201" y2="235" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#f5f5f5" /><stop offset=".45" stopColor="#d9d9db" /><stop offset="1" stopColor="#9a9a9e" />
                  </linearGradient>
                  <linearGradient id="rocket-nose" x1="75" y1="24" x2="132" y2="110" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#606062" /><stop offset="1" stopColor="#242426" />
                  </linearGradient>
                  <linearGradient id="rocket-fin" x1="122" y1="141" x2="199" y2="214" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#8245f5" /><stop offset="1" stopColor="#4e1bb4" />
                  </linearGradient>
                  <linearGradient id="rocket-engine" x1="188" y1="218" x2="229" y2="270" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#555557" /><stop offset="1" stopColor="#222224" />
                  </linearGradient>
                  <linearGradient id="rocket-flame" x1="223" y1="259" x2="271" y2="321" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#fa8fa8" /><stop offset=".55" stopColor="#ef718b" /><stop offset="1" stopColor="#be435f" />
                  </linearGradient>
                  <linearGradient id="rocket-rim" x1="108" y1="91" x2="171" y2="160" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#939395" /><stop offset="1" stopColor="#474749" />
                  </linearGradient>
                  <radialGradient id="rocket-window" cx=".35" cy=".25" r=".9">
                    <stop stopColor="#303032" /><stop offset="1" stopColor="#171719" />
                  </radialGradient>
                </defs>
                <path d="m191 199 10 79 17 15 8-6-3-66Z" fill="url(#rocket-fin)" />
                <path d="m212 145 50 37-2 11-50-4Z" fill="url(#rocket-fin)" />
                <path d="M65 42c-6-18-2-32 3-34 30-1 66 14 91 35L92 103C75 82 68 62 65 42Z" fill="url(#rocket-nose)" />
                <path d="M92 103c6-36 36-66 67-60 49 15 87 90 93 153l-58 54c-53-24-98-87-102-147Z" fill="url(#rocket-body)" />
                <path d="m187 83 24-15 59 43c4 3 4 15-1 17l-44 13-9 14Z" fill="url(#rocket-fin)" />
                <path d="m211 68 59 43-45 14-38-42Z" fill="#7134e7" />
                <path d="m120 155 51 47-26 16-8 20-25-2-30-64 20-20Z" fill="url(#rocket-fin)" />
                <path d="m102 152 69 50-26 16-43-51Z" fill="#7536eb" />
                <ellipse cx="142" cy="105" rx="39" ry="43" transform="rotate(-37 142 105)" fill="#bcbcbf" />
                <ellipse cx="146" cy="111" rx="35" ry="39" transform="rotate(-37 146 111)" fill="url(#rocket-rim)" />
                <ellipse cx="146" cy="111" rx="27" ry="30" transform="rotate(-37 146 111)" fill="url(#rocket-window)" />
                <path d="M185 233c8-24 39-51 62-53l7 17c-25 4-48 23-61 52Z" fill="#575759" />
                <path d="M193 249c10-24 33-43 61-52l-4 24-42 39Z" fill="#303032" />
                <path d="m207 246 13-22 23-13 21 38-29 29Z" fill="url(#rocket-engine)" />
                <path d="m218 231 10 15m12-28 9 15" stroke="#646466" strokeWidth="5" strokeLinecap="round" />
                <path d="M236 267c-2-13 19-31 30-25 12 7 15 37 30 61l-22 16c-19-21-35-31-38-52Z" fill="url(#rocket-flame)" />
              </svg></div>
            <div className={styles["brand"]}>
              <div className={styles["brand-name"]}><svg viewBox="0 0 32 36" fill="none" aria-hidden="true">
                <path d="M16 3 29 10.5v15L16 33 3 25.5v-15L16 3Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
                <path d="m3 10.5 8 4.5m10 0 8-4.5M16 23v10" stroke="currentColor" strokeWidth="3" />
                <circle cx="16" cy="18" r="6" stroke="currentColor" strokeWidth="3" />
              </svg><strong>Mentor Token</strong></div>
              <span>mentortoken.com</span>
            </div>
          </div>
        </section>
        <section className={styles["auth-right"]} aria-labelledby="auth-title">
          <div className={styles["login-form"]}>
            <div className={styles["logo"]}><svg viewBox="0 0 32 36" fill="none" aria-hidden="true">
                <path d="M16 3 29 10.5v15L16 33 3 25.5v-15L16 3Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
                <path d="m3 10.5 8 4.5m10 0 8-4.5M16 23v10" stroke="currentColor" strokeWidth="3" />
                <circle cx="16" cy="18" r="6" stroke="currentColor" strokeWidth="3" />
              </svg></div>
            <h2 id="auth-title">LOG IN TO MENTOR TOKEN</h2>
            <p className={styles["subtitle"]}>Enter your email and pass to login.</p>
            <form onSubmit={handleLogin}>
              <div className={styles["auth-field"] + " " + styles["auth-field-email"]}>
                <label htmlFor="login-email">Email</label>
                <input id="login-email" type="email" autoComplete="email" placeholder="mentortoken@mail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className={styles["auth-field"]}>
                <label className={styles["auth-sr-only"]} htmlFor="login-password">Password</label>
                <input id="login-password" type="password" autoComplete="current-password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Link className={styles["forgot-password"]} href="/auth/forgot-password">Forgot password?</Link>
              {message && <p className={styles["error-message"]} role="alert">{message}</p>}
              <button className={styles["auth-submit"]} type="submit" disabled={loading}>{loading ? "Logging in..." : "Log in"}</button>
            </form>
            <p className={styles["register-text"]}>Don't have account? <Link href="/auth/register">Register.</Link></p>
          </div>
        </section>
      </div>
    </main>
  );
}
