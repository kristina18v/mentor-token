"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MentorDashboard() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      // CURRENT USER
      const userResponse = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (userResponse.status === 401) {
        router.push("/");
        return;
      }

      const userData = await userResponse.json();

      if (!userResponse.ok) {
        setError(
          userData.message ||
            "Неуспешно вчитување на корисникот"
        );
        return;
      }

      setCurrentUser(userData.user);

      // JOBS
      const jobsResponse = await fetch("/api/jobs", {
        credentials: "include",
      });

      if (jobsResponse.status === 401) {
        router.push("/");
        return;
      }

      const jobsData = await jobsResponse.json();

      if (!jobsResponse.ok) {
        setError(
          jobsData.message ||
            "Неуспешно вчитување на jobs"
        );
        return;
      }

      setJobs(jobsData);

      // APPLICATIONS SENT
      const applicationsResponse = await fetch(
        "/api/job-applications",
        {
          credentials: "include",
        }
      );

      const applicationsData =
        await applicationsResponse.json();

      if (!applicationsResponse.ok) {
        setError(
          applicationsData.message ||
            "Неуспешно вчитување на апликациите"
        );
        return;
      }

      setApplications(applicationsData);
    } catch (error) {
      setError("Се појави грешка");
    } finally {
      setLoading(false);
    }
  }

  // Pending jobs
  const pendingJobs = jobs.filter(
    (job) => job.status === "pending"
  );

  // Assigned jobs
  const assignedJobs = jobs.filter((job) =>
    ["in-progress", "done", "rejected"].includes(
      job.status
    )
  );

  // Филтрирање
  const filteredAssignedJobs =
    filter === "all"
      ? assignedJobs
      : assignedJobs.filter(
          (job) => job.status === filter
        );

  // Accept / Reject / Done
  async function changeJobStatus(jobId, status) {
    try {
      setError("");

      const response = await fetch(
        `/api/jobs/${jobId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Неуспешна промена на статус"
        );
        return;
      }

      setJobs((currentJobs) =>
        currentJobs.map((job) =>
          job._id === jobId ? data.job : job
        )
      );
    } catch (error) {
      setError("Се појави грешка");
    }
  }

  // Logout
  async function handleLogout() {
    try {
      const response = await fetch(
        "/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setError("Неуспешно одјавување");
    }
  }

  if (loading) {
    return (
      <p className={styles.loading}>
        Loading...
      </p>
    );
  }

  return (
    <main className={styles.page}>

      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <Link href="/">
          <h2>Mentor Token</h2>
        </Link>

        <nav>
          <Link href="/dashboard/mentor">
            Dashboard
          </Link>

          <Link href="/dashboard/mentor/stats">
            My Stats
          </Link>

          <Link href="/jobs">
            Job Feed
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

      {/* MAIN CONTENT */}
      <section className={styles.content}>

        {/* TOP BAR */}
        <header className={styles.topbar}>
          <input
            type="text"
            placeholder="Search..."
          />

          <div className={styles.profile}>
            {currentUser && (
              <>
                <p>
                  {currentUser.name}{" "}
                  {currentUser.surname}
                </p>

                <span>Mentor</span>
              </>
            )}
          </div>
        </header>

        {error && (
          <p className={styles.error}>
            {error}
          </p>
        )}

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
              type="button"
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
              type="button"
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
              type="button"
              onClick={() => setFilter("rejected")}
            >
              Rejected
            </button>

            <button
              className={
                filter === "in-progress"
                  ? styles.activeFilter
                  : styles.filter
              }
              type="button"
              onClick={() =>
                setFilter("in-progress")
              }
            >
              In Progress
            </button>
          </div>

          {filteredAssignedJobs.length === 0 && (
            <p className={styles.message}>
              Нема доделени jobs.
            </p>
          )}

          {filteredAssignedJobs.map((job) => (
            <article
              className={styles.job}
              key={job._id}
            >
              <h3>{job.title}</h3>

              <p>{job.description}</p>

              {job.startup && (
                <p>
                  Startup: {job.startup.name}{" "}
                  {job.startup.surname}
                </p>
              )}

              <p
                className={`${styles.status} ${
                  styles[job.status] || ""
                }`}
              >
                Status: {job.status}
              </p>

              {job.status === "in-progress" && (
                <button
                  className={styles.doneButton}
                  type="button"
                  onClick={() =>
                    changeJobStatus(
                      job._id,
                      "done"
                    )
                  }
                >
                  Mark as Done
                </button>
              )}
            </article>
          ))}
        </section>

        {/* PENDING JOBS */}
        <section className={styles.pending}>
          <h2>Pending Jobs</h2>

          {pendingJobs.length === 0 && (
            <p className={styles.message}>
              Нема pending jobs.
            </p>
          )}

          {pendingJobs.map((job) => (
            <article
              className={styles.pendingJob}
              key={job._id}
            >
              <h3>{job.title}</h3>

              <p>{job.description}</p>

              {job.startup && (
                <p>
                  Startup: {job.startup.name}{" "}
                  {job.startup.surname}
                </p>
              )}

              <button
                className={styles.acceptButton}
                type="button"
                onClick={() =>
                  changeJobStatus(
                    job._id,
                    "in-progress"
                  )
                }
              >
                Accept
              </button>

              <button
                className={styles.rejectButton}
                type="button"
                onClick={() =>
                  changeJobStatus(
                    job._id,
                    "rejected"
                  )
                }
              >
                Reject
              </button>
            </article>
          ))}
        </section>

        {/* APPLICATIONS */}
        <section className={styles.applications}>
          <h2>Applications sent</h2>

          {applications.length === 0 && (
            <p className={styles.message}>
              Немате испратено апликации.
            </p>
          )}

          {applications.map((application) => (
            <article
              className={styles.application}
              key={application._id}
            >
              {application.job && (
                <>
                  <h3>
                    {application.job.title}
                  </h3>

                  <p>
                    {application.job.description}
                  </p>

                  {application.job.startup && (
                    <p>
                      Startup:{" "}
                      {
                        application.job.startup
                          .name
                      }{" "}
                      {
                        application.job.startup
                          .surname
                      }
                    </p>
                  )}
                </>
              )}

              <p
                className={`${styles.status} ${
                  styles[application.status] || ""
                }`}
              >
                Status: {application.status}
              </p>
            </article>
          ))}
        </section>

      </section>
    </main>
  );
}