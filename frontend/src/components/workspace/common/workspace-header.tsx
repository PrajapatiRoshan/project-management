import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuthContext } from '@/context/auth-provider';
import { Loader } from 'lucide-react';

const WorkspaceHeader = () => {
  const { workspaceLoading, workspace } = useAuthContext();
  return (
    <div className="w-full max-w-3xl mx-auto pb-2">
      {workspaceLoading ? (
        <Loader className="w-8 h-8 animate-spin" />
      ) : (
        <div className="flex items-center gap-4">
          <Avatar className="size-[60px] rounded-lg font-bold ">
            <AvatarFallback className="rounded-lg bg-gradient-to-tl text-[35px]  to-black from-black text-white">
              {workspace?.name?.split(' ')?.[0]?.charAt(0) || 'W'}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left leading-tight">
            <span className="truncate font-semibold text-xl">{workspace?.name}</span>
            <span className="truncate text-sm">Free</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceHeader;

