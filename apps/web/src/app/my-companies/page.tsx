import { MyCompanies } from "@/components/my-companies";
import type { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "My Companies",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MyCompaniesPage() {
  return <MyCompanies />;
}
