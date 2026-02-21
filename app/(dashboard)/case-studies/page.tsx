import type { Metadata } from "next";
import CaseStudiesListClient from "./CaseStudiesListClient";

export const metadata: Metadata = {
  title: "Case Studies",
};

export default function CaseStudiesPage() {
  return <CaseStudiesListClient />;
}
