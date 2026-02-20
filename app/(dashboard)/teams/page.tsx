import type { Metadata } from "next";
import TeamsListClient from "./TeamsListClient";

export const metadata: Metadata = {
  title: "Team",
};

export default function TeamsPage() {
  return <TeamsListClient />;
}
