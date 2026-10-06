"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


export default function About() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/users", {
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          setError(
            data.message ||
            data.error ||
            "Неуспешно вчитување на корисниците"
          );

          return;
        }

        setUsers(data);
      })
      .catch(() => {
        setError("Се појави грешка");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className={styles.page}>
      <Navbar />

      <section className={styles.hero}>
        <h1>Meet our team members</h1>

        <p>
          We Focus on the details of everything we do.
          All to help businesses around the world focus
          on what's most important to them.
        </p>

        <Link href="/contact">
          Get in touch
        </Link>
      </section>

      <section className={styles.team}>
        {loading && <p className={styles.message}>Loading...</p>}

        {error && <p className={styles.error}>{error}</p>}

        {!loading &&
          !error &&
          users.map((user) => (
            <article className={styles.member} key={user._id}>
              <h2>
                {user.name} {user.surname}
              </h2>

              <p>{user.role}</p>
            </article>
          ))}
      </section>

      <Footer />
    </main>
  );
}