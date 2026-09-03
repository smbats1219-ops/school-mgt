"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createTeacher } from "@/lib/api/teacher";
import { teacherKeys } from "@/lib/api/query-keys";
import {
  createTeacherSchema,
  type CreateTeacherSchemaType,
} from "@/lib/validators/teacher";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface CreateTeacherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTeacherDialog({
  open,
  onOpenChange,
}: CreateTeacherDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<CreateTeacherSchemaType>({
    resolver: zodResolver(createTeacherSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: CreateTeacherSchemaType) =>
      createTeacher({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
      }),
    onSuccess: (teacher) => {
      toast.success(`${teacher.firstName} ${teacher.lastName} added`);
      form.reset();
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: teacherKeys.all });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create teacher.",
      );
    },
  });

  function onSubmit(values: CreateTeacherSchemaType) {
    mutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add teacher</DialogTitle>
          <DialogDescription>
            Add a new teacher to the staff.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input placeholder="Sara" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input placeholder="Ali" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="sara.ali@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Adding..." : "Add teacher"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
