import Link from "next/link";
import type { Breadcrumb } from "../lib/content-breadcrumbs";

export function Breadcrumbs({
  items,
  className = "font-mono text-[11px] leading-relaxed text-green uppercase",
}: {
  items: readonly Breadcrumb[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`min-w-0 wrap-anywhere ${className}`}
    >
      <ol className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        {items.map((item, index) => (
          <li key={item.path} className="flex min-w-0 items-baseline gap-2">
            {index > 0 && <span aria-hidden="true">/</span>}
            {index === items.length - 1 ? (
              <span aria-current="page">{item.name}</span>
            ) : (
              <Link
                href={item.path}
                className="underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
