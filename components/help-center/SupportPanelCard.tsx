import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

interface SupportPanelCardProps {
  title: string;
  description: string;
  icon?: LucideIcon | string;
  iconSrc?: string;
  href: string;
  iconColor: string;
}

export function SupportPanelCard({
  title,
  description,
  icon: Icon,
  iconSrc,
  href,
  iconColor,
}: SupportPanelCardProps) {
  const isExternal = typeof href === "string" && (href.startsWith("http://") || href.startsWith("https://"));

  const card = (
    <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-blue-400 cursor-pointer group">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div
            className={
              typeof Icon === "string" || iconSrc
                ? `w-20 h-20 rounded-lg bg-transparent overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform duration-200`
                : `p-3 rounded-lg ${iconColor} group-hover:scale-110 transition-transform duration-200`
            }
          >
            {typeof Icon === "string" || iconSrc ? (
              <img
                src={`/images/${(iconSrc ?? Icon) as string}`}
                alt={title}
                className="w-full h-full object-contain"
              />
            ) : (
              Icon && <Icon className="h-10 w-10 text-white" />
            )}
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl mb-2 text-blue-600 group-hover:text-blue-700">
              {title}
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noreferrer">
        {card}
      </a>
    );
  }

  return <Link href={href}>{card}</Link>;
}
