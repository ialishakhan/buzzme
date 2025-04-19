import SearchField from "@/components/SearchField";
import UserButton from "@/components/UserButton";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-2">
        <Link
          href="/"
          className="flex items-center text-2xl font-bold text-primary"
        >
          <Image src="/logo.png" alt="DevBuzz" width={50} height={50} />
          <span className="hidden md:-ml-2 md:flex">DevBuzz</span>
        </Link>
        <SearchField />
        <UserButton className="sm:ms-auto" />
      </div>
    </header>
  );
}
