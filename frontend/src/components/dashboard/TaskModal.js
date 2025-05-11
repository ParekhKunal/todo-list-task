import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const TaskModal = ({ 
  isOpen, 
  onClose, 
  isEditMode, 
  currentTodo, 
  setCurrentTodo, 
  statuses, 
  onSubmit 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            value={currentTodo.title}
            onChange={e => setCurrentTodo({ ...currentTodo, title: e.target.value })}
            placeholder="Title"
          />
          <Input
            value={currentTodo.description}
            onChange={e => setCurrentTodo({ ...currentTodo, description: e.target.value })}
            placeholder="Description"
          />
          <Input
            type="date"
            value={currentTodo.dueDate}
            onChange={e => setCurrentTodo({ ...currentTodo, dueDate: e.target.value })}
            placeholder="Due Date"
          />
          <select
            className="w-full border rounded-md p-2"
            value={currentTodo.status}
            onChange={e => setCurrentTodo({ ...currentTodo, status: e.target.value })}
          >
            {statuses.map(status => (
              <option key={status._id} value={status._id}>
                {status.name}
              </option>
            ))}
          </select>
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={onSubmit}>
            {isEditMode ? 'Update' : 'Add'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal; 