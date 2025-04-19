import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useGetWorkspaceMembers from '@/hooks/api/use-get-workspace-members';
import useWorkspaceId from '@/hooks/use-workspace-id';
import { getAvatarColor, getAvatarFallbackText } from '@/lib/helper';
import { format } from 'date-fns';
import { Loader } from 'lucide-react';

const RecentMembers = () => {
  const workspaceId = useWorkspaceId();

  const { data, isPending } = useGetWorkspaceMembers(workspaceId);

  const members = data?.members || [];

  // const members = [
  //   {
  //     name: "Alice Johnson",
  //     role: "Member",
  //     joinedDate: "December 20, 2024",
  //     avatar: "/avatars/alice.png",
  //     initials: "AJ",
  //   },
  //   {
  //     name: "Bob Smith",
  //     role: "Admin",
  //     joinedDate: "December 18, 2024",
  //     avatar: "/avatars/bob.png",
  //     initials: "BS",
  //   },
  //   {
  //     name: "Chloe Martinez",
  //     role: "Member",
  //     joinedDate: "December 17, 2024",
  //     avatar: "/avatars/chloe.png",
  //     initials: "CM",
  //   },
  //   {
  //     name: "David Lee",
  //     role: "Owner",
  //     joinedDate: "December 15, 2024",
  //     avatar: "/avatars/david.png",
  //     initials: "DL",
  //   },
  //   {
  //     name: "Eleanor Brown",
  //     role: "Member",
  //     joinedDate: "December 12, 2024",
  //     avatar: "/avatars/eleanor.png",
  //     initials: "EB",
  //   },
  //   {
  //     name: "Frank White",
  //     role: "Member",
  //     joinedDate: "December 10, 2024",
  //     avatar: "/avatars/frank.png",
  //     initials: "FW",
  //   },
  //   {
  //     name: "Grace Green",
  //     role: "Admin",
  //     joinedDate: "December 8, 2024",
  //     avatar: "/avatars/grace.png",
  //     initials: "GG",
  //   },
  // ];

  return (
    <div className="flex flex-col pt-2">
      {isPending && <Loader className="w-8 h-8 animate-spin place-self-center flex" />}
      {members?.length === 0 && (
        <div className="font-semibold text-sm text-muted-foreground text-center py-5">
          No members
        </div>
      )}
      <ul role="list" className="space-y-3">
        {members?.map((member) => {
          const name = member?.userId?.name || '';
          const initials = getAvatarFallbackText(name);
          const avatarColor = getAvatarColor(name);

          return (
            <li
              key={member?._id}
              role="listitem"
              className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                <Avatar className="h-9 w-9 sm:flex">
                  <AvatarImage src={member?.userId?.profilePicture || ''} alt="Avatar" />
                  <AvatarFallback className={avatarColor}>{initials}</AvatarFallback>
                </Avatar>
              </div>

              {/* Member Details */}
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-900">{name}</p>
                <p className="text-sm text-gray-500">{member.role?.name}</p>
              </div>

              {/* Joined Date */}
              <div className="ml-auto text-sm text-gray-500">
                <p>Joined</p>
                <p>{member?.joinedAt ? format(member?.joinedAt, 'PPP') : null}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RecentMembers;

