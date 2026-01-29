'use client';

/**
 * Footer Component - Simplified without heavy animations
 */

import Link from 'next/link';
import { X, Linkedin, Mail, Instagram } from 'lucide-react';
import { IMAGES } from '@/shared/constants';

const FOOTER = {
  columns: [],
  social: [
    { icon: 'X', href: '#', target: '_blank', label: 'X' },
    { icon: 'Instagram', href: '#', target: '_blank', label: 'Instagram' },
    { icon: 'Linkedin', href: '#', target: '_blank', label: 'LinkedIn' },
    {
      icon: 'Mail',
      href: 'mailto:contact@example.com',
      target: '_self',
      label: 'Email',
    },
  ],
};

const Footer = () => {
  const footer = FOOTER;
  const socialLinks = footer.social;
  const ICON_MAP: Record<string, any> = { X, Instagram, Linkedin, Mail };

  return (
    <footer className="bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-6 border-b border-border/50">
        <div className="flex flex-col lg:flex-row justify-between items-start">
          <div className="lg:w-1/3 mb-12 lg:mb-0">
            <div className="flex items-center mb-3">
              <Link href="/">
                <img
                  src={IMAGES.LOGO}
                  alt="Shipskart"
                  className="h-10 w-auto"
                />
              </Link>
            </div>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Transform your business with our powerful SaaS platform. Scale
              faster, work smarter, grow bigger.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social: any, index: number) => {
                const Icon = ICON_MAP[social.icon] ?? X;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target={social.target}
                    className="h-9 w-9 border border-border/60 text-muted-foreground rounded-md flex items-center justify-center hover:text-foreground hover:scale-110 transition-all"
                    aria-label={social.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Columns removed per request - footer simplified */}
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 Shipskart SaaS. All rights reserved.
          </p>
          <div className="text-sm text-muted-foreground">
            contacts@shipskart.com
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
