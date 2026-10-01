import Link from "next/link";
import { SkillEditor } from "@/components/admin/skill-editor";

export default function NewSkillPage() {
  return (
    <div className="max-w-3xl">
      <Link href="/admin/skills" className="font-mono text-sm font-bold hover:underline">← BACK TO SKILLS</Link>
      <h1 className="mt-2 text-4xl font-bold uppercase">New skill</h1>
      <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-6 border-2 p-6">
        <SkillEditor />
      </div>
    </div>
  );
}
