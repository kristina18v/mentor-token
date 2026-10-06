import styles from "./page.module.css";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className={styles.page}>

      <Navbar />
      <Footer />

      {/* HERO */}
      <section className={styles.hero}>
        <h1>
          Grow your StartUp!
          <br />
          Monitoring and
          <br />
          Evaluating now is easy!
        </h1>

        <p>
          Welcome to Mentor Token, where we redefine the dynamics
          of startup success. Our innovative platform offers a
          transformative approach to mentorship, fostering
          connections that propel emerging businesses toward
          their full potential.
        </p>

        <div className={styles.actions}>
          <Link href="/auth/register">
            Get Started
          </Link>

          <Link href="/contact">
            Get in Touch
          </Link>
        </div>

        {/* Подоцна тука ќе ја ставиме сликата од dashboard */}
      </section>


      {/* COMPANIES */}
      <section className={styles.companies}>
        <div className={styles.companyGrid}>
          <span>Adobe</span>
          <span>Google</span>
          <span>HelloSign</span>
          <span>Maze</span>
          <span>Ghost</span>
          <span>Atlassian</span>
          <span>Treehouse</span>
          <span>Intercom</span>
          <span>Opendoor</span>
          <span>HubSpot</span>
        </div>

        <p>
          More than 25+ Startups around the
          <br />
          world trusted Mentor Token
        </p>
      </section>


      {/* FEATURES */}
      <section className={styles.features}>
        <p>FEATURES</p>

        <h2>
          Boost Your Startup&apos;s Journey:
          <br />
          Discover Mentor Token&apos;s Robust
          <br />
          Features
        </h2>

        <div className={styles.featureGrid}>
          <article>
            <span>01</span>
            <h3>Goal Setting</h3>
            <p>
              Set your startup goals and track your progress.
            </p>
          </article>

          <article>
            <span>02</span>
            <h3>Performance Tracking</h3>
            <p>
              Monitor weekly performance and the progress
              of your startup.
            </p>
          </article>

          <article>
            <span>03</span>
            <h3>Reward System</h3>
            <p>
              Celebrate the achievements and progress
              of your startup.
            </p>
          </article>

          <article>
            <span>04</span>
            <h3>Knowledge Library</h3>
            <p>
              Discover useful resources and information
              for startup growth.
            </p>
          </article>
        </div>
      </section>


      {/* SUCCESS */}
      <section className={styles.success}>
        <h2>Every success is rewarded!</h2>

        {/* Подоцна тука ќе ја ставиме големата dashboard слика */}
        <div className={styles.dashboardPreview}>
          Mentor Token Dashboard
        </div>
      </section>


      {/* FOOTER */}
      <footer>
        <div>
          <h3>Mentor Token</h3>

          <p>
            With Mentor Token, every failure
            transforms into an opportunity for growth.
          </p>
        </div>

        <div>
          <h4>Pages</h4>
          <Link href="/">Home</Link>
          <Link href="/contact">Contact US</Link>
        </div>

        <div>
          <h4>Contact</h4>
          <p>info@mentortoken.com</p>
          <p>+ (389) 123 456 789</p>
        </div>

        <div>
          <h4>Follow Us</h4>
          <span>LinkedIn</span>
          <span>Twitter</span>
          <span>Facebook</span>
        </div>

        <p>
          ©2024 Mentor Token. All rights reserved.
        </p>
      </footer>

    </main>
  );
}