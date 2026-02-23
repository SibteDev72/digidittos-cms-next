import type { Metadata } from "next";
import CaseStudyForm from "../CaseStudyForm";

export const metadata: Metadata = {
  title: "Create Case Study",
};

export default function CreateCaseStudyPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary">Create Case Study</h1>
        <p className="mt-1 text-sm text-gray-500">
          Write and publish a new case study
        </p>
      </div>
      <CaseStudyForm />
    </div>
  );
}
