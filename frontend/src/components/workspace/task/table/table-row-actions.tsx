import { useState } from 'react';
import { Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@/components/resuable/confirm-dialog';
import { TaskType } from '@/types/api.type';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useWorkspaceId from '@/hooks/use-workspace-id';
import { deleteTaskMutationFn } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import EditTaskDialog from '../edit-task-dialog';

interface DataTableRowActionsProps {
  row: Row<TaskType>;
  projectId: string;
}

export function DataTableRowActions({ row, projectId }: DataTableRowActionsProps) {
  const [openDeleteDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteTaskMutationFn,
  });

  const taskId = row.original._id as string;
  const taskCode = row.original.taskcode;
  const projectIdRow = row.original.project?._id as string;

  const handleConfirm = () => {
    mutate(
      {
        workspaceId,
        taskId,
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: ['all-tasks', workspaceId],
          });
          toast({
            title: 'Success',
            description: data.message,
            variant: 'success',
          });
          setTimeout(() => setOpenDialog(false), 100);
        },
        onError: (error) => {
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
          });
        },
      }
    );
  };

  const closeEditDialog = () => {
    setOpenEditDialog(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            disabled={isPending}
            className="cursor-pointer"
            onClick={() => setOpenEditDialog(true)}
          >
            Edit task
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={isPending}
            className={`!text-destructive cursor-pointer ${taskId}`}
            onClick={() => setOpenDialog(true)}
          >
            Delete Task
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        isOpen={openDeleteDialog}
        isLoading={false}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleConfirm}
        title="Delete Task"
        description={`Are you sure you want to delete ${taskCode}`}
        confirmText="Delete"
        cancelText="Cancel"
      />
      <EditTaskDialog
        projectId={projectId || projectIdRow}
        opened={openEditDialog}
        onClose={closeEditDialog}
        taskId={taskId}
        fromAllTask={!projectId}
      />
    </>
  );
}

