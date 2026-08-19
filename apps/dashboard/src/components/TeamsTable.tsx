"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Team } from "@/types/dashboard";
import { TableEmptyState } from "./ui/TableEmptyState";
import { useDetailRow } from "@/hooks/useDetailRow";
import { TeamDetailSheet } from "./TeamDetailSheet";
import { OfficerStar } from "./OfficerBadge";
import { isOfficerRole } from "@/lib/auth/roles";

interface TeamsTableProps {
  teams: Team[];
}

export function TeamsTable({ teams }: TeamsTableProps) {
  const detail = useDetailRow<Team>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teams</CardTitle>
        <CardDescription>All teams and their members</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Members</TableHead>
              <TableHead className="hidden md:table-cell">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.length === 0 ? (
              <TableEmptyState
                colSpan={5}
                message="No teams established yet."
              />
            ) : (
              teams.map((team) => (
                <TableRow key={team.id} {...detail.getRowProps(team)}>
                  <TableCell>{team.name}</TableCell>
                  <TableCell>{team.description || "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant={team.isActive ? "default" : "secondary"}>
                      {team.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {team.members.map((member, index) => (
                        <Badge key={index} variant="outline">
                          {/* Icon-only: the chip already carries a name and a
                              team role, so a second worded badge would crowd
                              rows on teams with more than a few members. */}
                          {isOfficerRole(member.user.role) && <OfficerStar />}
                          {member.user.name || member.user.email} ({member.role}
                          )
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(team.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TeamDetailSheet
          team={detail.selected}
          onOpenChange={detail.onOpenChange}
          onCloseAutoFocus={detail.onCloseAutoFocus}
        />
      </CardContent>
    </Card>
  );
}
