import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  strokeWidth?: number;
}

export function LinktreeIcon({
  size = 24,
  strokeWidth = 2,
  color = "currentColor",
  ...props
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      strokeWidth={0}
      {...props}
    >
      {/* Asterisk symbol */}
      <path d="M11 2L13 2L13 8.17L17.17 4L18.59 5.41L14.41 9.58L14.42 9.59L21 9.59L21 11.59L14.41 11.59L18.59 15.76L17.17 17.17L13 13L13 22L11 22L11 13L6.83 17.17L5.41 15.76L9.59 11.59L3 11.59L3 9.59L9.59 9.59L5.41 5.42L6.83 4.01L11 8.17L11 2Z" />
    </svg>
  );
} 