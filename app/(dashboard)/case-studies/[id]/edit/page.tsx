import type { Metadata } from "next";
import CaseStudyForm from "../../CaseStudyForm";

export const metadata: Metadata = {
  title: "Edit Case Study",
};

export default async function EditCaseStudyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Case Study</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update your case study
        </p>
      </div>
      <CaseStudyForm caseStudyId={id} />
    </div>
  );
}
