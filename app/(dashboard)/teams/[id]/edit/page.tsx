import type { Metadata } from "next";
import TeamForm from "../../TeamForm";

export const metadata: Metadata = {
  title: "Edit Team Member",
};

export default async function EditTeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary">Edit Team Member</h1>
        <p className="mt-1 text-sm text-gray-500">Update team member details</p>
      </div>
      <TeamForm memberId={id} />
    </div>
  );
}
