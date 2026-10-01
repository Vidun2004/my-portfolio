import { MediaUploader } from "@/components/admin/media-uploader";
import { MediaGrid } from "@/components/admin/media-grid";
import { createAdminClient } from "@/lib/supabase/admin";
import { MEDIA_FOLDERS } from "@/lib/media";

export type MediaFile = { folder: string; name: string; path: string; url: string };

async function listAll(): Promise<{ files: MediaFile[]; bucketMissing: boolean }> {
  const admin = createAdminClient();
  const files: MediaFile[] = [];
  let bucketMissing = false;
  for (const folder of MEDIA_FOLDERS) {
    const { data, error } = await admin.storage.from("portfolio").list(folder, { limit: 100 });
    if (error) {
      bucketMissing = true;
      continue;
    }
    for (const f of data ?? []) {
      if (!f.name || f.name.startsWith(".")) continue;
      const path = `${folder}/${f.name}`;
      const { data: pub } = admin.storage.from("portfolio").getPublicUrl(path);
      files.push({ folder, name: f.name, path, url: pub.publicUrl });
    }
  }
  return { files, bucketMissing };
}

export default async function AdminMediaPage() {
  const { files, bucketMissing } = await listAll();

  return (
    <div>
      <p className="font-mono text-sm text-black/50">STORAGE</p>
      <h1 className="text-4xl font-bold uppercase">Media</h1>

      <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-6 border-2 p-5">
        <MediaUploader />
      </div>

      {bucketMissing && files.length === 0 ? (
        <div className="border-ink bg-brand-yellow shadow-brutal rounded-brutal-md mt-6 border-2 p-6">
          <p className="font-bold">Bucket not found.</p>
          <p className="mt-1 font-mono text-xs">Run <span className="font-bold">supabase/migrations/0003_media_bucket.sql</span> in the SQL editor, then refresh.</p>
        </div>
      ) : files.length === 0 ? (
        <div className="border-ink bg-white shadow-brutal rounded-brutal-md mt-6 border-2 p-10 text-center">
          <p className="text-2xl font-bold uppercase">No uploads yet.</p>
        </div>
      ) : (
        <MediaGrid files={files} />
      )}
    </div>
  );
}
