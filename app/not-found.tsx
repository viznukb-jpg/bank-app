import Link from "next/link";
import { Button } from "@/shared/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center bg-slate-50 px-4 min-h-screen text-center">
      <h1 className="font-extrabold text-blue-600 text-9xl tracking-tighter">
        404
      </h1>
      <h2 className="mt-4 font-bold text-slate-900 text-3xl">Page Not Found</h2>
      <p className="mt-2 mb-8 text-slate-600">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Link href="/">
        <Button className="px-8 w-auto">Return Home</Button>
      </Link>
    </div>
  );
}
