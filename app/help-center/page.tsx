import { HelpCenterBanner } from "@/components/help-center/HelpCenterBanner";
import { SupportPanelCard } from "@/components/help-center/SupportPanelCard";
import { Settings, TrendingUp } from "lucide-react";

export default function HelpCenterPage() {
  const supportPanels = [
    {
      title: "IT Admin / Data Correction Requests",
      description:
        "Small backend tasks like renaming vessels, updating / correcting data, permissions, changing requisition dates, new hardware request etc.",
      iconSrc: "tech-req.png",
      href: "/support/it-admin-category",
      iconColor: "bg-orange-500",
    },
    {
      title: "Change / Enhancement Request",
      description:
        "Modify an existing feature (e.g., better filters, UI change, more data visibility).",
      iconSrc: "development.png",
      href: "/support/enhancement-category",
      iconColor: "bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <HelpCenterBanner />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <p className="text-muted-foreground text-lg">
            Welcome! You can raise a request for Support using the options provided.
          </p>
          <h2 className="text-3xl font-bold text-foreground mt-2 mb-8">
            What can we help you with?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {supportPanels.map((panel) => (
            <SupportPanelCard key={panel.href} {...panel} />
          ))}
        </div>
      </div>
    </div>
  );
}
