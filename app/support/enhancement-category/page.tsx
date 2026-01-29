'use client';

import { SupportPanelCard } from "@/components/help-center/SupportPanelCard";
import { Plus, Bug } from "lucide-react";

export default function EnhancementCategoryPage() {
  const options = [
    {
      title: "New Feature Request / System Changes or Enhancement",
      description:
        "Request for something that doesn't exist yet or suggest modifications to existing features.",
      iconSrc: "develop.png",
      href: "https://docs.google.com/forms/d/e/1FAIpQLScJMtQh8XlU68V6nJJA2qcB7x2C7-cQpdLF2BRr5r8QSxs0bg/viewform?usp=dialog",
      iconColor: "bg-green-500",
    },
    {
      title: "Bug Report",
      description: "Something that was working before is now broken or misbehaving.",
      iconSrc: "bug-report.png",
      href: "https://docs.google.com/forms/d/e/1FAIpQLScJMtQh8XlU68V6nJJA2qcB7x2C7-cQpdLF2BRr5r8QSxs0bg/viewform?usp=dialog",
      iconColor: "bg-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Change / Enhancement Request
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
