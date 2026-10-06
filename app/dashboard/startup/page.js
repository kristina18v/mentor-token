"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function StartupDashboard() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mentors, setMentors] = useState([]);

  useEffect(() => {

    // CURRENT USER
    fetch("/api/auth/me", {
      credentials: "include",
    })
      .then(async (res) => {
        if (res.status === 401) {
          router.push("/");
          return;
        }

        const data = await res.json();

        if (!res.ok) {
          setError(
            data.message ||
              "Неуспешно вчитување на корисникот"
          );
          return;
        }

        setCurrentUser(data.user);
      })
      .catch(() => {
        setError("Се појави грешка");
      });

    // JOBS
    fetch("/api/jobs", {
      credentials: "include",
    })
      .then(async (res) => {
        if (res.status === 401) {
          router.push("/");
          return;
        }

        const data = await res.json();

        if (!res.ok) {
          setError(
            data.message ||
              "Неуспешно вчитување на задачите"
          );
          return;
        }

        setJobs(data);
      })
      .catch(() => {
        setError("Се појави грешка");
      })
      .finally(() => {
        setLoading(false);
      });

    // MENTORS
    fetch("/api/mentors", {
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();

        if (res.ok) {
          setMentors(data);
        }
      })
      .catch(() => {
        console.log(
          "Грешка при вчитување на менторите"
        );
      });
  }, []);

  const filteredJobs =
    filter === "all"
      ? jobs
      : jobs.filter(
          (job) => job.status === filter
        );
        async function handleLogout() {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      router.push("/");
      router.refresh();
    }
  } catch (error) {
    setError("Неуспешно одјавување");
  }
}

  return (
    <main className={styles.page}>

      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <Link href="/">
          <h2>Mentor Token</h2>
        </Link>

        <nav>
          <Link href="/dashboard/startup">
            Dashboard
          </Link>

          <Link href="/mentors">
            Mentors
          </Link>

          <Link href="/jobs">
            Jobs
          </Link>


  <button
    className={styles.logout}
    type="button"
    onClick={handleLogout}
  >
    Logout
  </button>
        </nav>
      </aside>

      {/* DASHBOARD */}
      <section className={styles.content}>

        {/* TOP BAR */}
        <div className={styles.topbar}>
          <input
            type="text"
            placeholder="Search Mentor..."
          />

          {currentUser && (
            <div className={styles.profile}>
              <p>
                {currentUser.name}{" "}
                {currentUser.surname}
              </p>

              <span>Startup</span>
            </div>
          )}
        </div>

        {/* ASSIGNED JOBS */}
        <section className={styles.assigned}>
          <h2>Assigned Jobs</h2>

          <div className={styles.filters}>
            <button
              className={
                filter === "all"
                  ? styles.activeFilter
                  : styles.filter
              }
              onClick={() => setFilter("all")}
            >
              All
            </button>

            <button
              className={
                filter === "done"
                  ? styles.activeFilter
                  : styles.filter
              }
              onClick={() => setFilter("done")}
            >
              Done
            </button>

            <button
              className={
                filter === "rejected"
                  ? styles.activeFilter
                  : styles.filter
              }
              onClick={() =>
                setFilter("rejected")
              }
            >
              Rejected
            </button>

            <button
              className={
                filter === "in-progress"
                  ? styles.activeFilter
                  : styles.filter
              }
              onClick={() =>
                setFilter("in-progress")
              }
            >
              In Progress
            </button>
          </div>

          {loading && (
            <p className={styles.message}>
              Loading...
            </p>
          )}

          {error && (
            <p className={styles.error}>
              {error}
            </p>
          )}

          {!loading &&
            !error &&
            filteredJobs.map((job) => (
              <article
                className={styles.job}
                key={job._id}
              >
                <h3>{job.title}</h3>

                <p>{job.description}</p>

                <p
                  className={`${styles.status} ${
                    styles[job.status] || ""
                  }`}
                >
                  Status: {job.status}
                </p>

                {job.mentor && (
                  <p>
                    Mentor: {job.mentor.name}{" "}
                    {job.mentor.surname}
                  </p>
                )}

                <Link
                  href={`/jobs/${job._id}`}
                >
                  View Job
                </Link>
              </article>
            ))}

          {!loading &&
            !error &&
            filteredJobs.length === 0 && (
              <p className={styles.message}>
                Нема задачи.
              </p>
            )}
        </section>

        {/* BEST PERFORMING MENTORS */}
        <section className={styles.mentors}>
          <h2>Best Performing Mentors</h2>

          {mentors.length === 0 && (
            <p className={styles.message}>
              Нема ментори.
            </p>
          )}

          {mentors.slice(0, 3).map((mentor) => (
            <article
              className={styles.mentor}
              key={mentor._id}
            >
              <h3>
                {mentor.name}{" "}
                {mentor.surname}
              </h3>

              <p>{mentor.email}</p>

              <p className={styles.achieved}>
                {mentor.achievedJobs} Achieved Jobs
              </p>
            </article>
          ))}
        </section>

        {/* STATISTICS */}
        <section className={styles.statistics}>
          <p>OVERALL STATISTIC</p>

          <h2>STATISTICS</h2>

          <p>
            Overall target accomplishment over
            the year
          </p>
        </section>

      </section>
    </main>
  );
}