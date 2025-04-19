import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useWorkspaceId from '@/hooks/use-workspace-id';
import useGetProjectsInWorkspaceQuery from '@/hooks/api/use-get-projects';
import { Loader } from 'lucide-react';
import { getAvatarColor, getAvatarFallbackText } from '@/lib/helper';
import { format } from 'date-fns';

const RecentProjects = () => {
  const workspaceId = useWorkspaceId();

  const { data, isPending } = useGetProjectsInWorkspaceQuery({
    workspaceId,
    pageNumber: 1,
    pageSize: 10,
  });

  // Projects data
  const projects = data?.projects || [];

  // const projects = [
  //   {
  //     emoji: '🚀',
  //     name: 'Space Exploration Initiative',
  //     date: 'December 28, 2024',
  //     createdBy: 'AB',
  //   },
  //   {
  //     emoji: '🛒',
  //     name: 'E-Commerce Platform Revamp',
  //     date: 'December 27, 2024',
  //     createdBy: 'JD',
  //   },
  //   {
  //     emoji: '🌱',
  //     name: 'Sustainability Research',
  //     date: 'December 26, 2024',
  //     createdBy: 'MJ',
  //   },
  //   {
  //     emoji: '📚',
  //     name: 'Educational Content Development',
  //     date: 'December 25, 2024',
  //     createdBy: 'SS',
  //   },
  //   {
  //     emoji: '🏗️',
  //     name: 'Urban Infrastructure Design',
  //     date: 'December 24, 2024',
  //     createdBy: 'RT',
  //   },
  //   {
  //     emoji: '🎨',
  //     name: 'Creative Branding Campaign',
  //     date: 'December 23, 2024',
  //     createdBy: 'KL',
  //   },
  //   {
  //     emoji: '⚙️',
  //     name: 'Automation Workflow Setup',
  //     date: 'December 22, 2024',
  //     createdBy: 'AK',
  //   },
  //   {
  //     emoji: '💼',
  //     name: 'Corporate Strategy Alignment',
  //     date: 'December 21, 2024',
  //     createdBy: 'CN',
  //   },
  //   {
  //     emoji: '🧬',
  //     name: 'Genomics Research Project',
  //     date: 'December 20, 2024',
  //     createdBy: 'LH',
  //   },
  //   {
  //     emoji: '🌍',
  //     name: 'Global Outreach Program',
  //     date: 'December 19, 2024',
  //     createdBy: 'ZW',
  //   },
  // ];

  return (
    <div className="flex flex-col pt-2">
      {isPending && <Loader className="w-8 h-8 animate-spin place-self-center flex" />}
      {projects?.length === 0 && (
        <div className="font-semibold text-sm text-muted-foreground text-center py-5">
          No project created yet
        </div>
      )}
      <ul role="list" className="space-y-2">
        {projects?.map((project) => {
          const name = project?.createdBy?.name || 'Unknown';
          const initials = getAvatarFallbackText(name);
          const avatarColor = getAvatarColor(name);

          return (
            <li
              key={project._id}
              role="listitem"
              className="shadow-none cursor-pointer border-0 py-2 hover:bg-gray-50 transition-colors ease-in-out "
            >
              <Link
                to={`/workspace/${workspaceId}/project/${project._id}`}
                className="grid gap-8 p-0"
              >
                <div className="flex items-start gap-2">
                  <div className="text-xl !leading-[1.4rem]">{project.emoji}</div>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">{project.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {project.createdAt ? format(project.createdAt, 'PPP') : null}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-4">
                    <span className="text-sm text-gray-500">Created by</span>
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage
                        src={project?.createdBy?.profilePicture || ''}
                        alt="Avatar"
                      />
                      <AvatarFallback className={avatarColor}>{initials}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RecentProjects;

