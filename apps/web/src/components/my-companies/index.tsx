"use client";

import { Title } from "../Title";
import { OwnedCompanies } from "./OwnedCompanies";

export const MyCompanies = () => {
  return (
    <div className="container mx-auto max-w-3xl p-6">
      <div className="mb-6">
        <Title
          title="My Companies"
          description="Manage the companies connected to your account."
        />
      </div>
      <OwnedCompanies />
    </div>
  );
};
