// src/components/Footer.tsx
import "../Front_page/Front.css"; // same file that holds your .btn class etc.

/** Simple site-wide footer.  No props needed for now. */
export default function Footer() {
  return (
    <footer className="w-full bg-gray-300 h-12 flex items-center justify-center">
      <p className="text-sm text-gray-700">
        © {new Date().getFullYear()} chess brothers — All rights reserved
      </p>
    </footer>
  );
}
