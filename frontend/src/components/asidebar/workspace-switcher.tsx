import * as React from 'react';
import { Check, ChevronDown, Loader, Plus } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useNavigate } from 'react-router-dom';
import useWorkspaceId from '@/hooks/use-workspace-id';
import useCreateWorkspaceDialog from '@/hooks/use-create-workspace-dialog';
import { useQuery } from '@tanstack/react-query';
import { getAllWorkspacesUserIsMemberQueryFn } from '@/lib/api';

type WorkspaceType = {
  _id: string;
  name: string;
};

// const workspaces = [
//   {
//     id: "my-wo8483727",
//     name: "Acme Inc",
//     plan: "Free",
//   },
//   {
//     id: "ym28483727",
//     name: "Acme Corp.",
//     plan: "Free",
//   },
//   {
//     id: "cc88483727",
//     name: "Evil Corp.",
//     plan: "Free",
//   },
// ];

export function WorkspaceSwitcher() {
  const navigate = useNavigate();
  const { isMobile } = useSidebar();

  const { onOpen } = useCreateWorkspaceDialog();
  const workspaceId = useWorkspaceId();

  const [activeWorkspace, setActiveWorkspace] = React.useState<WorkspaceType>();

  const { data, isPending } = useQuery({
    queryKey: ['userWorkspaces'],
    queryFn: getAllWorkspacesUserIsMemberQueryFn,
    staleTime: 1,
    refetchOnMount: true,
  });

  const workspaces = data?.workspaces || [];

  React.useEffect(() => {
    if (workspaces?.length) {
      const workspace = workspaceId
        ? workspaces.find((ws) => ws._id === workspaceId)
        : workspaces[0];

      if (workspace) {
        setActiveWorkspace(workspace);
        if (!workspaceId) navigate(`/workspace/${workspace._id}`);
        return;
      }
    }

    // if (workspaces?.length) {
    //   const firstWorkspace = workspaces[0];
    //   setActiveWorkspace(firstWorkspace);
    //   navigate(`/workspace/${firstWorkspace?.id}`);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId, workspaces, navigate]);

  const onSelect = (workspace: WorkspaceType) => {
    setActiveWorkspace(workspace);
    navigate(`/workspace/${workspace._id}`);
  };

  return (
    <>
      <SidebarGroupLabel className="w-full justify-between pr-0">
        <span>Workspaces</span>
        <button
          onClick={onOpen}
          className="flex size-5 items-center justify-center rounded-full border"
        >
          <Plus className="size-3.5" />
        </button>
      </SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground bg-gray-10"
              >
                {activeWorkspace ? (
                  <>
                    <div className="flex aspect-square size-8 items-center font-semibold justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      {activeWorkspace?.name?.split(' ')?.[0]?.charAt(0)}
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {activeWorkspace?.name}
                      </span>
                      <span className="truncate text-xs">
                        {/* {activeWorkspace?.plan} */}
                        Free
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">No Workspace selected</span>
                  </div>
                )}

                <ChevronDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? 'bottom' : 'right'}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Workspaces
              </DropdownMenuLabel>
              {isPending && <Loader className="w-5 h-5 animate-spin" />}
              {workspaces?.map((workspace) => (
                <DropdownMenuItem
                  key={workspace._id}
                  onClick={() => onSelect(workspace)}
                  className="gap-2 p-2 !cursor-pointer"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    {workspace?.name?.split(' ')?.[0]?.charAt(0)}
                  </div>
                  {workspace.name}

                  {workspace?._id === workspaceId && (
                    <DropdownMenuShortcut className="tracking-normal !opacity-100">
                      <Check className="w-4 h-4" />
                    </DropdownMenuShortcut>
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 p-2 !cursor-pointer" onClick={onOpen}>
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">Add workspace</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}

