import { Dialog, DialogContent } from '@/components/ui/dialog';
import EditTaskForm from './edit-task-form';

const EditTaskDialog = (props: {
  projectId: string;
  taskId: string;
  opened?: boolean;
  fromAllTask: boolean;
  onClose: () => void;
}) => {
  return (
    <Dialog open={props?.opened} onOpenChange={props?.onClose}>
      <DialogContent className="sm:max-w-lg max-h-auto my-5 border-0">
        <EditTaskForm
          key={props.taskId.toString()}
          projectId={props.projectId}
          onClose={props.onClose}
          taskId={props.taskId}
          fromAllTask={props.fromAllTask}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskDialog;

