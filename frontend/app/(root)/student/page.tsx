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
import { CreateStudentDialog } from "@/components/modules/student/create-student-dialog";
import { UpdateStudentDialog } from "@/components/modules/student/update-student-dialog";
import { DeleteStudentDialog } from "@/components/modules/student/delete-student-dialog";
import { getStudents } from "@/lib/api/student";
import { studentKeys } from "@/lib/api/query-keys";
import type { Student } from "@/lib/types/api";

const PAGE_SIZE = 10;

export default function StudentPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteStudentRec, setDeleteStudentRec] = useState<Student | null>(
    null,
  );
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: studentKeys.list({
      page,
      limit: PAGE_SIZE,
      search: search || undefined,
    }),
    queryFn: () =>
      getStudents({ page, limit: PAGE_SIZE, search: search || undefined }),
  });

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 400);

  const rows = data?.data ?? [];
  const meta = data?.meta ?? { page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 };
  const totalPages = Math.max(1, meta.totalPages);

  function openEdit(student: Student) {
    setEditStudent(student);
    setEditOpen(true);
  }

  function openDelete(student: Student) {
    setDeleteStudentRec(student);
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
            Students
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the students enrolled in the academy.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>Add student</Button>
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
                <TableHead>Date of birth</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Enrolled</TableHead>
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
                rows.map((student) => (
                  <TableRow key={student.id} className="hover:bg-muted/40">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                          {`${student.firstName} ${student.lastName}`
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">
                            {student.firstName} {student.lastName}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {student.email}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(student.dateOfBirth).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {(() => {
                        const enrollments = student.enrollments ?? [];
                        const active = enrollments.find(
                          (e) => e.status === "ACTIVE",
                        );
                        return active?.class?.name ?? (
                          <span className="text-muted-foreground/60">—</span>
                        );
                      })()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(student.createdAt).toLocaleDateString()}
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
                          <DropdownMenuItem onClick={() => openEdit(student)}>
                            <Pencil className="size-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => openDelete(student)}
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
                    No students found.
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

      <CreateStudentDialog open={createOpen} onOpenChange={setCreateOpen} />
      <UpdateStudentDialog
        student={editStudent}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <DeleteStudentDialog
        student={deleteStudentRec}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </section>
  );
}
