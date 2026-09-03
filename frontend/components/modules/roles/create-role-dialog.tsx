"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createRole } from "@/lib/api/roles";
import { roleKeys } from "@/lib/api/query-keys";
import { createRoleSchema, type CreateRoleSchemaType } from "@/lib/validators/admin";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface CreateRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateRoleDialog({
  open,
  onOpenChange,
}: CreateRoleDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<CreateRoleSchemaType>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      role_key: "",
      name: "",
      description: "",
      isSystemRole: false,
    },
  });

  const mutation = useMutation({
    mutationFn: (values: CreateRoleSchemaType) =>
      createRole({
        role_key: values.role_key,
        name: values.name,
        description: values.description || undefined,
        isSystemRole: values.isSystemRole,
      }),
    onSuccess: (role) => {
      toast.success(`Role ${role.name} created`);
      form.reset();
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create role.");
    },
  });

  function onSubmit(values: CreateRoleSchemaType) {
    mutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create role</DialogTitle>
          <DialogDescription>
            Define a new permission role for workspace members.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="role_key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role key</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="inventory_clerk"
                        className="font-mono"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display name</FormLabel>
                    <FormControl>
                      <Input placeholder="Inventory Clerk" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What this role is permitted to do."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isSystemRole"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <FormLabel>System role</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      System roles cannot be deleted or modified.
                    </p>
                  </div>
                  <FormControl>
                    <input
                      type="checkbox"
                      className="size-4"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
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
                {mutation.isPending ? "Creating..." : "Create role"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}