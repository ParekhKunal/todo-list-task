import { Button } from '@/components/ui/button';

const TaskCard = ({ task, onEdit, onDelete }) => {
  return (
    <div className="group p-6 border rounded-xl shadow-sm bg-white hover:shadow-md transition-all duration-200 ease-in-out">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
          {task.title}
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center text-sm text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(task.dueDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            task.status?.name === 'Completed' ? 'bg-green-100 text-green-700' :
            task.status?.name === 'In Progress' ? 'bg-blue-100 text-blue-700' :
            'bg-yellow-100 text-yellow-700'
          }`}>
            {task.status?.name || 'Pending'}
          </span>
        </div>
      </div>

      {/* Description Section */}
      <div className="mb-4">
        <p className="text-gray-600 leading-relaxed line-clamp-2">
          {task.description}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <Button 
          variant="outline" 
          onClick={() => onEdit(task)}
          className="flex-1 hover:bg-blue-50 hover:text-blue-600 transition-colors"
        >
          Edit
        </Button>
        <Button 
          variant="destructive" 
          onClick={() => onDelete(task._id)}
          className="flex-1 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default TaskCard; 