import { Link } from "@tanstack/react-router";
import { socials } from "@/lib/portfolio-data";

export function SiteFooter() {
  return (
    <footer className="hairline-t relative">
      <div className="shell flex flex-col gap-8 py-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-title font-medium tracking-tight">SAID</p>
          <p className="label mt-2">BUILT BY HAND — 2026</p>
        </div>

        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                data-cursor="link"
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="label underline-sweep transition-colors duration-500 hover:text-foreground"
              >
                {s.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              to="/lab"
              data-cursor="link"
              className="label underline-sweep transition-colors duration-500 hover:text-foreground"
            >
              THE LAB
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
