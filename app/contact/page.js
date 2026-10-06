"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Contact() {
    const[name, setName] = useState("");
    const[email, setEmail] = useState("");
    const[message, setMessage] = useState("");

    function handleSubmit(e) {
        e.preventDefault();

        console.log({
            name,
            email,
            message
        });
    }
    return (
        <main className={styles.page}>
            <Navbar />
            <section className={styles.contact}>
                <h1>Lets Talk</h1>
                  <p>
          We're thrilled to connect with you! Whether you have a question,
          need assistance, or want to discuss a potential project, we're here
          to listen and help.
        </p>

        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <textarea
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit">Send Message</button>
        </form>
            </section>
            <Footer />
        </main>
    )
}