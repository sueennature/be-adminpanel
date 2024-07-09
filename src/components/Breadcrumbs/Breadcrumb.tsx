import Link from "next/link";
interface BreadcrumbProps {
  pageName: string;
  firstLink?: any;
  secondLink?: any;
  pageNameTwo?: string;
}
const Breadcrumb = ({
  pageName,
  pageNameTwo,
  firstLink,
  secondLink,
}: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 bg-gray sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black ">{pageName} {pageNameTwo ? `/ ${pageNameTwo}` : ""}</h2>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium text-black" href="/">
              Dashboard /
            </Link>
          </li>
          <Link href={firstLink || "#"}>
            <li className="font-medium text-black">{pageName}</li>
          </Link>
          {pageNameTwo && (
            <Link href={secondLink || "#"}>
              <li className="font-medium text-black">/ {pageNameTwo}</li>
            </Link>
          )}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
