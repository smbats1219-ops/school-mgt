"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateUserStatus } from "@/lib/api/users";
import { userKeys } from "@/lib/api/query-keys";
import type { User, UserStatus } from "@/lib/types/api";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_OPTIONS: UserStatus[] = [
  "PENDING",
  "APPROVED",
  "ACTIVE",
  "SUSPENDED",
  "DEACTIVATED",
];

interface UpdateUserStatusDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateUserStatusDialog({
  user,
  open,
  onOpenChange,
}: UpdateUserStatusDialogProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
      updateUserStatus(id, status),
    onSuccess: (updated) => {
      toast.success(`User status updated to ${updated.status}`);
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update status.",
      );
    },
  });

  if (!user) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Update status for {user.fullName}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Approving a user allows them to sign in. Select the new status for
            this account.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-2">
          <Select
            defaultValue={user.status}
            onValueChange={(value) =>
              mutation.mutate({ id: user.id, status: value as UserStatus })
            }
            disabled={mutation.isPending}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => onOpenChange(false)}>
            Done
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}