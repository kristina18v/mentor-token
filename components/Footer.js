import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div>
        <h3>Mentor Token</h3>

        <p>
          With Mentor Token, every failure transforms
          into an opportunity for growth.
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

      <p>©2024 Mentor Token. All rights reserved.</p>
    </footer>
  );
}