import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-white w-full h-screen flex items-center justify-center">
      <Link className="px-7 py-5 rounded-lg  bg-slate-200" href={"/GroupEventPlanner"}>
        <span className="text-black underline ">
          Event Planner
        </span>
      </Link>
    </main>
  );
}
