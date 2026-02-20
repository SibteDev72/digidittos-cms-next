import type { Metadata } from "next";
import TeamForm from "../TeamForm";

export const metadata: Metadata = {
  title: "Add Team Member",
};

export default function CreateTeamPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add Team Member</h1>
        <p className="mt-1 text-sm text-gray-500">
          Add a new member to your team
        </p>
      </div>
      <TeamForm />
    </div>
  );
}
