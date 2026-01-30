import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { getImagePath } from '@/shared/constants';
import { SupportCard } from '@/components/ui/Card';

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
  const isExternal =
    typeof href === 'string' &&
    (href.startsWith('http://') || href.startsWith('https://'));

  const imageSrc = iconSrc ? getImagePath(iconSrc) : null;

  const renderIcon = () => {
    if (imageSrc || typeof Icon === 'string') {
      return (
        <img
          src={imageSrc || (Icon as string)}
          alt={title}
          className="w-14 h-14 object-contain"
        />
      );
    }
    if (Icon) {
      return <Icon className="h-10 w-10 text-blue-600" />;
    }
    return null;
  };

  const card = (
    <SupportCard
      title={title}
      description={description}
      icon={renderIcon()}
    />
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
