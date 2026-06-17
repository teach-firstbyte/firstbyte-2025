"use client";

import { useEffect, useState } from "react";
import teamData from "@/data/team.json";

export interface TeamMember {
  name: string;
  role: string;
  image?: string | null;
  circularImage?: string | null;
  bio?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  website?: string;
  years?: string[]; // List of years with FirstByte (e.g. ["2022", "2023", "2024"])
  previousRoles?: { role: string; year: string }[]; // Previous roles with years
}

export interface PastBoard {
  year: string;
  title: string;
  members: TeamMember[];
}

// Get all team members from the JSON data
export const allTeamMembers: TeamMember[] = teamData.allTeamMembers;
// Get team photos if available
const teamPhotos = teamData.teamPhotos || [];

// Helper function to get the correct role for a specific year
export const getRoleForYear = (member: TeamMember, year: string): string => {
  // If we're looking for the current year (2026) role
  if (year === "Fall 2026") {
    return member.role;
  }

  // If we're looking for a historical role
  const historicalRole = member.previousRoles?.find(
    (role) => role.year === year,
  );
  return historicalRole ? historicalRole.role : member.role;
};

// Get team photo for a specific year if available
export const getTeamPhotoForYear = (
  year: string,
): { image: string; description: string } | null => {
  const photo = teamPhotos.find((p) => p.year === year);
  return photo || null;
};

// Hook to detect mobile devices
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check if the device is mobile based on screen width
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for resize
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};
