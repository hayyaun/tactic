import { Header } from "./header";

export function SiteHeader({ path }: { path?: string }) {
  const activePage = ["/services", "/portfolio", "/about"].find(
    (page) => path === page || path?.startsWith(`${page}/`),
  );
  return (
    <>
      <a
        href="#page-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-6 focus:z-50 focus:bg-foreground focus:p-4 focus:text-background"
      >
        Skip to content
      </a>
      <div className="pt-24 min-[600px]:pt-28">
        <Header sectionLinks={false} activePage={activePage} />
      </div>
    </>
  );
}
