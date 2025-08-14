export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8">
      <div className="container flex flex-col items-center justify-between gap-4 text-sm text-white/70 md:flex-row">
        <p>
          &copy; {new Date().getFullYear()} Infynia Labs. Engineering Infinite Intelligence.
        </p>
        <p>Privacy • Security • Responsible AI</p>
      </div>
    </footer>
  );
}
