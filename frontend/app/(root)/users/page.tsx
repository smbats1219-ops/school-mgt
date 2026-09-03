"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, MoreHorizontal, Search } from "lucide-react";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateUserDialog } from "@/components/modules/users/create-user-dialog";
import { UpdateUserStatusDialog } from "@/components/modules/users/update-user-status-dialog";
import { UserStatusBadge } from "@/components/modules/users/user-status-badge";
import { getUsers } from "@/lib/api/users";
import { userKeys } from "@/lib/api/query-keys";
import type { User } from "@/lib/types/api";

const PAGE_SIZE = 10;

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [statusUser, setStatusUser] = useState<User | null>(null);
  const [statusOpen, setStatusOpen] = useState(false);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: userKeys.list({ page, limit: PAGE_SIZE, search: search || undefined }),
    queryFn: () => getUsers({ page, limit: PAGE_SIZE, search: search || undefined }),
  });

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 400);

  const rows = data?.data ?? [];
  const meta = data?.meta ?? { page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 };
  const totalPages = Math.max(1, meta.totalPages);

  function openStatus(user: User) {
    setStatusUser(user);
    setStatusOpen(true);
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Administration
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Users
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the people with access to InvLedger.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>Add user</Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, username, or email…"
            defaultValue={search}
            onChange={(e) => debouncedSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="p-4">
                    <Skeleton className="h-12 w-full" />
                  </TableCell>
                </TableRow>
              ) : rows.length ? (
                rows.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/40">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                          {user.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">
                            {user.fullName}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            @{user.username}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email ?? <span className="text-muted-foreground/60">—</span>}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.phoneNumber ?? (
                        <span className="text-muted-foreground/60">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <UserStatusBadge status={user.status} />
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const roles = user.userRoles ?? [];
                        return roles.length ? (
                          <span className="text-sm font-medium text-foreground">
                            {roles.map((r) => r.role.name).join(", ")}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/60">
                            No roles
                          </span>
                        );
                      })()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={<Button variant="ghost" size="icon-sm" />}
                        >
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">Open menu</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openStatus(user)}>
                            Update status
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => openStatus(user)}
                          >
                            Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {meta.total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}
            </span>
            {" - "}
            <span className="font-medium text-foreground">
              {Math.min(page * PAGE_SIZE, meta.total)}
            </span>
            {" of "}
            <span className="font-medium text-foreground">{meta.total}</span>{" "}
            records
          </p>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((p) => p - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft />
            </Button>
            <span className="flex min-w-10 items-center justify-center text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{page}</span>
              <span className="mx-1">/</span>
              <span>{totalPages}</span>
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              disabled={page >= totalPages || isFetching}
              onClick={() => setPage((p) => p + 1)}
              aria-label="Next page"
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </div>

      <CreateUserDialog open={createOpen} onOpenChange={setCreateOpen} />
      <UpdateUserStatusDialog
        user={statusUser}
        open={statusOpen}
        onOpenChange={setStatusOpen}
      />
    </section>
  );
}