import { ConfirmDialog } from "@/components/resuable/confirm-dialog";
import { Button } from "@/components/ui/button";
import useConfirmDialog from "@/hooks/use-confirm-dialog";

const DeleteWorkspaceCard = () => {
  const { open, onOpenDialog, onCloseDialog } = useConfirmDialog();

  const isPending = false;

  const handleConfirm = () => {};
  return (
    <>
      <div className="w-full">
        <div className="mb-5 border-b">
          <h1
            className="text-[17px] tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1.5
           text-center sm:text-left"
          >
            Delete Workspace
          </h1>
        </div>

        <div className="flex flex-col items-start justify-between py-0">
          <div className="flex-1 mb-2">
            <p>
              Deleting a workspace is a permanent action and cannot be undone.
              Once you delete a workspace, all its associated data, including
              projects, tasks, and member roles, will be permanently removed.
              Please proceed with caution and ensure this action is intentional.
            </p>
          </div>
          <Button
            className="shrink-0 flex place-self-end h-[40px]"
            variant="destructive"
            onClick={onOpenDialog}
          >
            Delete Workspace
          </Button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={open}
        isLoading={isPending}
        onClose={onCloseDialog}
        onConfirm={handleConfirm}
        title={`Delete  Test co Workspace`}
        description={`Are you sure you want to delete? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

export default DeleteWorkspaceCard;
