import { parseAsBoolean, useQueryState } from "nuqs";

const useCreateWorkspaceDialog = () => {
  const [open, setOpen] = useQueryState(
    "new-workspace",
    parseAsBoolean.withDefault(false)
  );

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);
  return {
    open,
    onOpen,
    onClose,
  };
};

export default useCreateWorkspaceDialog;
