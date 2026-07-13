"use client";

import * as React from 'react';

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

function base(props: IconProps) {
  const { size = 24, ...rest } = props;
  return { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, ...rest };
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12a11.94 11.94 0 0 0 1.71 6.16L0 24l6-1.66A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.27-6.27-3.48-8.52zM12 21.82a9.84 9.84 0 0 1-5.02-1.37l-.36-.21-3.56.99 1-3.48-.23-.37A9.86 9.86 0 1 1 21.82 12 9.84 9.84 0 0 1 12 21.82zm5.46-7.36c-.3-.15-1.78-.88-2.05-.98-.27-.1-.47-.15-.67.15-.2.3-.77.98-.94 1.18-.17.2-.34.22-.64.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.79-1.68-2.09-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.06 2.89 1.21 3.09.15.2 2.09 3.19 5.06 4.47.71.31 1.26.49 1.69.62.71.22 1.36.19 1.87.12.57-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.17-1.43-.07-.13-.27-.2-.57-.35z" />
    </svg>
  );
}

export function MessageSquareIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function SnapchatIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 2c3.31 0 6 2.69 6 6v4.5c0 .6.4 1.1 1 1.3.4.13.8.27 1.2.4.27.09.43.4.3.67-.18.36-.6.6-1 .7-.3.07-.6.16-.8.32-.2.17-.3.4-.32.65-.05.6-.4 1.1-.95 1.3-.55.2-1.2.16-1.78.06-.27-.05-.55-.07-.83-.04-.42.05-.8.27-1.16.5-.55.36-1.18.6-1.84.6h-.04c-.66 0-1.29-.24-1.84-.6-.36-.23-.74-.45-1.16-.5-.28-.03-.56-.01-.83.04-.58.1-1.23.14-1.78-.06-.55-.2-.9-.7-.95-1.3-.02-.25-.12-.48-.32-.65-.2-.16-.5-.25-.8-.32-.4-.1-.82-.34-1-.7-.13-.27.03-.58.3-.67.4-.13.8-.27 1.2-.4.6-.2 1-.7 1-1.3V8c0-3.31 2.69-6 6-6z" />
    </svg>
  );
}

export function TikTokIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 4l16 16M20 4L4 20" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
