import { Button } from '@/components/ui/button';

const DashboardHeader = ({ user, onAddTask, onLogout }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-5 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
        <div className="space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Todo List
          </h2>
          <div className="flex items-center gap-2 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">{user?.email}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            onClick={onAddTask}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 w-full sm:w-auto shadow-sm transition-all duration-200 ease-in-out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Task
          </Button>
          <Button 
            variant="ghost"
            onClick={onLogout}
            className="text-gray-500 hover:text-red-600 hover:bg-red-50/50 px-3 py-2 rounded-lg transition-all duration-200 ease-in-out"
            title="Logout"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4" 
              viewBox="0 0 20 20" 
              fill="red"
            
            >
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 4.158a.75.75 0 11-1.06 1.06l-5.5-5.5a.75.75 0 010-1.06l5.5-5.5a.75.75 0 111.06 1.06L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader; 