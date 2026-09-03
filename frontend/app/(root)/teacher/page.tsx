"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
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
import { CreateTeacherDialog } from "@/components/modules/teacher/create-teacher-dialog";
import { UpdateTeacherDialog } from "@/components/modules/teacher/update-teacher-dialog";
import { DeleteTeacherDialog } from "@/components/modules/teacher/delete-teacher-dialog";
import { getTeachers } from "@/lib/api/teacher";
import { teacherKeys } from "@/lib/api/query-keys";
import type { Teacher } from "@/lib/types/api";

const PAGE_SIZE = 10;

export default function TeacherPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteTeacherRec, setDeleteTeacherRec] = useState<Teacher | null>(
    null,
  );
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: teacherKeys.list({
      page,
      limit: PAGE_SIZE,
      search: search || undefined,
    }),
    queryFn: () =>
      getTeachers({ page, limit: PAGE_SIZE, search: search || undefined }),
  });

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 400);

  const rows = data?.data ?? [];
  const meta = data?.meta ?? { page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 };
  const totalPages = Math.max(1, meta.totalPages);

  function openEdit(teacher: Teacher) {
    setEditTeacher(teacher);
    setEditOpen(true);
  }

  function openDelete(teacher: Teacher) {
    setDeleteTeacherRec(teacher);
    setDeleteOpen(true);
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Operations
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Teachers
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the teachers at the academy.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>Add teacher</Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email…"
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
                <TableHead>Subjects</TableHead>
                <TableHead>Classes</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="p-4">
                    <Skeleton className="h-12 w-full" />
                  </TableCell>
                </TableRow>
              ) : rows.length ? (
                rows.map((teacher) => (
                  <TableRow key={teacher.id} className="hover:bg-muted/40">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                          {`${teacher.firstName} ${teacher.lastName}`
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">
                            {teacher.firstName} {teacher.lastName}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {teacher.email}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {(() => {
                        const subjects = teacher.subjects ?? [];
                        return subjects.length ? (
                          <span className="text-sm font-medium text-foreground">
                            {subjects.map((s) => s.name).join(", ")}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/60">—</span>
                        );
                      })()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {(() => {
                        const classes = teacher.classes ?? [];
                        return classes.length ? (
                          <span className="text-sm font-medium text-foreground">
                            {classes.map((c) => c.name).join(", ")}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/60">—</span>
                        );
                      })()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(teacher.createdAt).toLocaleDateString()}
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
                          <DropdownMenuItem onClick={() => openEdit(teacher)}>
                            <Pencil className="size-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => openDelete(teacher)}
                          >
                            <Trash2 className="size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No teachers found.
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

      <CreateTeacherDialog open={createOpen} onOpenChange={setCreateOpen} />
      <UpdateTeacherDialog
        teacher={editTeacher}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <DeleteTeacherDialog
        teacher={deleteTeacherRec}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </section>
  );
}
