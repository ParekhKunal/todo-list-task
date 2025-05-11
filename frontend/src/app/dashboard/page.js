'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { getApiUrl } from '@/config/api';
import Cookies from 'js-cookie';

// Import components
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import TaskCard from '@/components/dashboard/TaskCard';
import TaskModal from '@/components/dashboard/TaskModal';
import EmptyState from '@/components/dashboard/EmptyState';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [todos, setTodos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentTodo, setCurrentTodo] = useState({
    id: null,
    title: '',
    description: '',
    dueDate: '',
    status: ''
  });

  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await axios.get(getApiUrl('/tasks'), {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.status === 'success') {
          console.log('API Response:', response.data.data);
          const formattedTasks = response.data.data.map(task => ({
            ...task,
            dueDate: new Date(task.dueDate).toISOString().split('T')[0],
            status: task.status || { name: 'Pending' },
            createdBy: task.createdBy || { email: 'Unknown' }
          }));
          console.log('Formatted Tasks:', formattedTasks);
          setTodos(formattedTasks);
          
          if (formattedTasks.length === 0) {
            toast.info('No tasks found. Create your first task!');
          }
        }
      } catch (error) {
        if (error.response?.status === 401) {
          Cookies.remove('token');
          toast.error('Session expired. Please login again.');
          router.push('/login');
        } else {
          toast.error('Failed to fetch tasks');
          console.error('Error fetching tasks:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [user, router]);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const token = Cookies.get('token');
        const response = await axios.get(getApiUrl('/task-status'), {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data.status === 'success') {
          setStatuses(response.data.data);
          const pendingStatus = response.data.data.find(status => status.statusCode === 'PEND');
          if (pendingStatus) {
            setCurrentTodo(prev => ({
              ...prev,
              status: pendingStatus._id
            }));
          }
        }
      } catch (error) {
        toast.error('Failed to fetch statuses');
        console.error('Error fetching statuses:', error);
      }
    };

    if (user) {
      fetchStatuses();
    }
  }, [user]);

  const resetTodo = () => {
    const pendingStatus = statuses.find(status => status.statusCode === 'PEND');
    return {
      id: null,
      title: '',
      description: '',
      dueDate: '',
      status: pendingStatus ? pendingStatus._id : ''
    };
  };

  const handleAdd = async () => {
    if (!validateTodo()) return;
    
    try {
      const token = Cookies.get('token');
      const taskData = {
        ...currentTodo,
        dueDate: new Date(currentTodo.dueDate).toISOString().split('T')[0]
      };
      
      const response = await axios.post(getApiUrl('/tasks'), taskData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.status === 'success') {
        const newTask = {
          ...response.data.data,
          dueDate: new Date(response.data.data.dueDate).toISOString().split('T')[0]
        };
        setTodos(prev => [...prev, newTask]);
        toast.success('Task added successfully!');
        setCurrentTodo(resetTodo());
        setModalOpen(false);
      }
    } catch (error) {
      toast.error('Failed to add task');
      console.error('Error adding task:', error);
    }
  };

  const handleUpdate = async () => {
    if (!validateTodo()) return;
    
    try {
      const token = Cookies.get('token');
      const taskData = {
        ...currentTodo,
        dueDate: new Date(currentTodo.dueDate).toISOString().split('T')[0]
      };
      
      const response = await axios.put(getApiUrl(`/tasks/${currentTodo.id}`), taskData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.status === 'success') {
        const updatedTask = {
          ...response.data.data,
          dueDate: new Date(response.data.data.dueDate).toISOString().split('T')[0]
        };
        setTodos(prev =>
          prev.map(todo =>
            todo._id === currentTodo.id ? updatedTask : todo
          )
        );
        toast.success('Task updated successfully!');
        setCurrentTodo(resetTodo());
        setEditMode(false);
        setModalOpen(false);
      }
    } catch (error) {
      toast.error('Failed to update task');
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        const token = Cookies.get('token');
        const response = await axios.delete(getApiUrl(`/tasks/${id}`), {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.status === 'success') {
          setTodos(prev => prev.filter(todo => todo._id !== id));
          toast.success('Task deleted successfully!');
        }
      } catch (error) {
        toast.error('Failed to delete task');
        console.error('Error deleting task:', error);
      }
    }
  };

  const openEditModal = todo => {
    setEditMode(true);
    setCurrentTodo({
      id: todo._id,
      title: todo.title,
      description: todo.description,
      dueDate: todo.dueDate,
      status: todo.status._id
    });
    setModalOpen(true);
  };

  const validateTodo = () => {
    if (currentTodo.title.length < 2) {
      toast.error('Title must be at least 2 characters long');
      return false;
    }

    if (currentTodo.description.length < 10) {
      toast.error('Description must be at least 10 characters long');
      return false;
    }

    if (!currentTodo.dueDate) {
      toast.error('Due date is required');
      return false;
    }

    const selectedDate = new Date(currentTodo.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast.error('Due date must be a future date');
      return false;
    }

    return true;
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4">
      <DashboardHeader 
        user={user}
        onAddTask={() => {
          setEditMode(false);
          setCurrentTodo(resetTodo());
          setModalOpen(true);
        }}
        onLogout={logout}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-500 text-sm">Loading your tasks...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {todos.length === 0 && !loading && (
            <EmptyState 
              onAddTask={() => {
                setEditMode(false);
                setCurrentTodo(resetTodo());
                setModalOpen(true);
              }}
            />
          )}
          {todos.map(todo => (
            <TaskCard
              key={todo._id}
              task={todo}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        isEditMode={editMode}
        currentTodo={currentTodo}
        setCurrentTodo={setCurrentTodo}
        statuses={statuses}
        onSubmit={editMode ? handleUpdate : handleAdd}
      />
    </div>
  );
};

export default Dashboard;
