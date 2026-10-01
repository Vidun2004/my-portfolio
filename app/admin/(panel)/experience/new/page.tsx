import Link from "next/link";
import { ExperienceEditor } from "@/components/admin/experience-editor";

export default function NewExperiencePage() {
  return (
    <div className="max-w-3xl">
      <Link href="/admin/experience" className="font-mono text-sm font-bold hover:underline">← BACK TO EXPERIENCE</Link>
      <h1 className="mt-2 text-4xl font-bold uppercase">New entry</h1>
      <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-6 border-2 p-6">
        <ExperienceEditor />
      </div>
    </div>
  );
}
