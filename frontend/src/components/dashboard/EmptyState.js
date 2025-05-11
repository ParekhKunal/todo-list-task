import { Button } from '@/components/ui/button';

const EmptyState = ({ onAddTask }) => {
  return (
    <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
      <p className="text-gray-500 mb-4">Get started by creating your first task</p>
      <Button
        onClick={onAddTask}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Create First Task
      </Button>
    </div>
  );
};

export default EmptyState; 