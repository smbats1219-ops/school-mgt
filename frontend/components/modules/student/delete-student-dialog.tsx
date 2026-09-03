"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteStudent } from "@/lib/api/student";
import { studentKeys } from "@/lib/api/query-keys";
import type { Student } from "@/lib/types/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteStudentDialogProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteStudentDialog({
  student,
  open,
  onOpenChange,
}: DeleteStudentDialogProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteStudent(id),
    onSuccess: () => {
      toast.success("Student deleted");
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete student.",
      );
    },
  });

  if (!student) return null;

  const studentId = student.id;

  function handleDelete() {
    mutation.mutate(studentId);
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete student?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove {student.firstName} {student.lastName}{" "}
            and their records. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={mutation.isPending}
            onClick={handleDelete}
          >
            {mutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
