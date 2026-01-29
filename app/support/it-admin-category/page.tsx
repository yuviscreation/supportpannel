'use client';

import { SupportPanelCard } from "@/components/help-center/SupportPanelCard";
import { Plus, FileText } from "lucide-react";

export default function ITAdminCategoryPage() {
  const options = [
    {
      title: "Submit New Request",
      description: "Submit a new IT Admin or Data Correction request.",
      iconSrc: "submit-req.png",
      href: "/support/it-admin",
      iconColor: "bg-orange-500",
    },
    {
      title: "View Request Status",
      description: "Check the status of your submitted requests.",
      iconSrc: "view-request.png",
      href: "https://shipskart1-my.sharepoint.com/:x:/g/personal/abhimanyu_shipskart1_onmicrosoft_com/IQC-NHSFEIlvRJ5vg83sOQX7AXuUTMkjtuRIQgze4c6XHkg?e=iTGboz",
      iconColor: "bg-sky-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            IT Admin / Data Correction Requests
          </h1>
          <p className="text-muted-foreground text-lg">
            Select an option below to proceed with your request.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {options.map((option) => (
            <SupportPanelCard key={option.href} {...option} />
          ))}
        </div>
      </div>
    </div>
  );
}
