"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateRoleDialog } from "@/components/modules/roles/create-role-dialog";
import { assignRoleToUser, getRoles } from "@/lib/api/roles";
import { getUsers } from "@/lib/api/users";
import { roleKeys, userKeys } from "@/lib/api/query-keys";
import type { Role } from "@/lib/types/api";

export default function RolesPage() {
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [assignRole, setAssignRole] = useState<Role | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("");

  const queryClient = useQueryClient();

  const { data: roles, isLoading } = useQuery({
    queryKey: roleKeys.all,
    queryFn: getRoles,
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: userKeys.list({ page: 1, limit: 100 }),
    queryFn: () => getUsers({ page: 1, limit: 100 }),
    enabled: assignOpen,
  });

  const assignMutation = useMutation({
    mutationFn: ({ roleId, userId }: { roleId: string; userId: string }) =>
      assignRoleToUser({ roleId, userId }),
    onSuccess: () => {
      toast.success(`Role assigned`);
      setAssignOpen(false);
      setAssignRole(null);
      setSelectedUser("");
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to assign role.",
      );
    },
  });

  const filtered = useMemo(() => {
    if (!roles) return [];
    if (!search.trim()) return roles;
    const q = search.toLowerCase();
    return roles.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.role_key.toLowerCase().includes(q) ||
        (r.description ?? "").toLowerCase().includes(q),
    );
  }, [roles, search]);

  function handleAssign() {
    if (!assignRole || !selectedUser) return;
    assignMutation.mutate({ roleId: assignRole.id, userId: selectedUser });
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Administration
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Roles
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Permission roles that can be assigned to workspace members.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>Create role</Button>
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Search roles…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="p-4">
                  <Skeleton className="h-10 w-full" />
                </TableCell>
              </TableRow>
            ) : filtered.length ? (
              filtered.map((role) => (
                <TableRow key={role.id} className="hover:bg-muted/40">
                  <TableCell className="font-medium text-foreground">
                    {role.name}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {role.role_key}
                  </TableCell>
                  <TableCell className="max-w-xs text-muted-foreground">
                    {role.description ?? (
                      <span className="text-muted-foreground/60">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      {role.isSystemRole ? "System" : "Custom"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAssignRole(role);
                        setSelectedUser("");
                        setAssignOpen(true);
                      }}
                    >
                      <UserPlus className="size-4" />
                      Assign
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No roles found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <CreateRoleDialog open={createOpen} onOpenChange={setCreateOpen} />

      <AlertDialog open={assignOpen} onOpenChange={setAssignOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ShieldCheck className="size-4" />
              Assign {assignRole?.name ?? "role"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Pick a user to assign the <strong>{assignRole?.name}</strong> role
              to.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-2">
            <Select
              value={selectedUser}
              onValueChange={(value) => value !== null && setSelectedUser(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {usersLoading ? (
                  <SelectItem value="__loading__" disabled>
                    Loading users…
                  </SelectItem>
                ) : (users?.data ?? []).length ? (
                  (users!.data!).map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.fullName} (@{user.username})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="__none__" disabled>
                    No users available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              onClick={handleAssign}
              disabled={!selectedUser || assignMutation.isPending}
            >
              {assignMutation.isPending ? "Assigning..." : "Assign role"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}