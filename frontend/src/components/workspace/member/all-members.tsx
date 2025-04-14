import { ChevronDown, Key, Loader } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getAvatarColor, getAvatarFallbackText } from '@/lib/helper';
import { useAuthContext } from '@/context/auth-provider';
import useWorkspaceId from '@/hooks/use-workspace-id';
import useGetWorkspaceMembers from '@/hooks/api/use-get-workspace-members';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { changeWorkspaceMemberRoleMutationFn } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Permissions } from '@/constant';
const AllMembers = () => {
  const { user, hasPermission } = useAuthContext();
  const canChabgeMemberRole = hasPermission(Permissions.CHANGE_MEMBER_ROLE);
  const workspaceId = useWorkspaceId();
  const queryClient = useQueryClient();
  const { data, isPending } = useGetWorkspaceMembers(workspaceId);
  const members = data?.members || [];
  const roles = data?.roles || [];

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: changeWorkspaceMemberRoleMutationFn,
  });

  const handleSelect = (roleId: string, memberId: string) => {
    if (!roleId || !memberId) return;
    const payLoad = {
      workspaceId,
      data: {
        roleId,
        memberId,
      },
    };
    mutate(payLoad, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['members', workspaceId],
        });
        toast({
          title: 'Success',
          description: 'member Role changed successfully',
          variant: 'success',
        });
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <div className="grid gap-6 pt-2">
      {isPending ? (
        <Loader className="w-8 h-8 animate-spin place-self-center flex" />
      ) : null}
      {members?.map((member) => {
        const name = member.userId?.name;
        const initials = getAvatarFallbackText(name);
        const avatarColor = getAvatarColor(name);
        return (
          <div className="flex items-center justify-between space-x-4" key={member._id}>
            <div className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={member.userId?.profilePicture || ''} alt="Image" />
                <AvatarFallback className={avatarColor}>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{name}</p>
                <p className="text-sm text-muted-foreground">{member.userId?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto min-w-24 capitalize disabled:opacity-95 disabled:pointer-events-none"
                    disabled={
                      isLoading || !canChabgeMemberRole || member.userId._id === user?._id
                    }
                  >
                    {member.role?.name?.toLocaleLowerCase()}
                    {canChabgeMemberRole && member.userId._id !== user?._id && (
                      <ChevronDown className="text-muted-foreground" />
                    )}
                  </Button>
                </PopoverTrigger>
                {canChabgeMemberRole && (
                  <PopoverContent className="p-0" align="end">
                    <Command>
                      <CommandInput
                        placeholder="Select new role..."
                        disabled={isLoading}
                        className="disabled:pointer-events-none"
                      />
                      <CommandList>
                        {isLoading ? (
                          <Loader className="w-8 h-8 animate-spin place-self-center flex my-4" />
                        ) : (
                          <>
                            <CommandEmpty>No roles found.</CommandEmpty>
                            <CommandGroup>
                              {roles?.map(
                                (role) =>
                                  role.name !== 'OWNER' && (
                                    <CommandItem
                                      key={role._id}
                                      disabled={isLoading}
                                      className="disabled:pointer-events-none gap-1 mb-1  flex flex-col items-start px-4 py-2 cursor-pointer"
                                      onSelect={() =>
                                        handleSelect(role._id, member.userId._id)
                                      }
                                    >
                                      <p className="capitalize">
                                        {role.name?.toLocaleLowerCase()}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {role.name === 'ADMIN' &&
                                          'Can view, create, edit tasks, project and manage settings.'}
                                        {role.name === 'MEMBER' &&
                                          'Can view,edit only task created by.'}
                                      </p>
                                    </CommandItem>
                                  )
                              )}
                              {/* <CommandItem className="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                              <p>Owner</p>
                              <p className="text-sm text-muted-foreground">
                                Admin-level access to all resources.
                              </p>
                            </CommandItem>
                            <CommandItem className="disabled:pointer-events-none gap-1 mb-1 flex flex-col items-start px-4 py-1 cursor-pointer">
                              <p>Admin</p>
                              <p className="text-sm text-muted-foreground">
                                Can view, create, edit tasks, project and manage settings.
                              </p>
                            </CommandItem>
                            <CommandItem className="disabled:pointer-events-none gap-1 mb-1 flex flex-col items-start px-4 py-1 cursor-pointer">
                              <p>Member</p>
                              <p className="text-sm text-muted-foreground">
                                Can view,edit only task created by.
                              </p>
                            </CommandItem> */}
                            </CommandGroup>
                          </>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                )}
              </Popover>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AllMembers;

