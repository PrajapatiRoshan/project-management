import useWorkspaceId from '@/hooks/use-workspace-id';
import AnalyticsCard from './common/analytics-card';
import { useQuery } from '@tanstack/react-query';
import { getWorkspaceAnalyticsQueryFn } from '@/lib/api';

const WorkspaceAnalytics = () => {
  const workspaceId = useWorkspaceId();
  const { data, isPending } = useQuery({
    queryKey: ['workspace-analytics', workspaceId],
    queryFn: () => getWorkspaceAnalyticsQueryFn(workspaceId),
    staleTime: 0,
    enabled: !!workspaceId,
  });

  const analytics = data?.analytics;

  // const workspaceList = [
  //   {
  //     id: 'total-task',
  //     title: 'Total Task',
  //     value: 20,
  //   },
  //   {
  //     id: 'overdue-task',
  //     title: 'Overdue Task',
  //     value: 0,
  //   },
  //   {
  //     id: 'completed-task',
  //     title: 'Completed Task',
  //     value: 4,
  //   },
  // ];

  return (
    <div className="grid gap-4 md:gap-5 lg:grid-cols-2 xl:grid-cols-3">
      <AnalyticsCard
        isLoading={isPending}
        title={'Total Task'}
        value={analytics?.totalTasks || 0}
      />
      <AnalyticsCard
        isLoading={isPending}
        title={'Overdue Task'}
        value={analytics?.overdueTask || 0}
      />
      <AnalyticsCard
        isLoading={isPending}
        title={'Completed Task'}
        value={analytics?.completedTasks || 0}
      />
    </div>
  );
};

export default WorkspaceAnalytics;

