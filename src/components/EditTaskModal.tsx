'use client';

import { useState, useEffect, FormEvent } from 'react';
import type { Task } from '@/lib/mockData';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask: (taskId: string, taskData: Omit<Task, 'id' | 'completed'>) => Promise<void>; 
  task: Task | null; // The task being edited
  projectId: string;
  milestoneId: string;
}

export default function EditTaskModal({
  isOpen,
  onClose,
  onUpdateTask,
  task,
  projectId,
  milestoneId,
}: EditTaskModalProps) {
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [comments, setComments] = useState('');
  const [status, setStatus] = useState<'To Do' | 'In Progress' | 'Done' | 'Updated'>('To Do');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill form when task data is available or changes
  useEffect(() => {
    if (task) {
      setDescription(task.description || '');
      setComments(task.comments || '');
      setStatus(task.status || 'To Do');
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    } else {
      // Reset form if task becomes null
      setDescription('');
      setDueDate('');
      setComments('');
      setStatus('To Do');
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!description.trim()) {
      setError('Task description is required.');
      setIsSubmitting(false);
      return;
    }

    const updatedData: Omit<Task, 'id' | 'completed'> = {
      description,
      status,
      comments,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
    };

    try {
      await onUpdateTask(task.id, updatedData);
      onClose(); // Close modal on success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-30 overflow-y-auto bg-gray-500 bg-opacity-75 transition-opacity"> {/* Increased z-index */}
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Edit Task</h3>
              {error && (
                <div className="mb-4 p-2 text-sm text-red-700 bg-red-100 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                 {/* Fields are same as AddTaskModal, just using state */}
                 <div>
                  <label htmlFor="edit-task-description" className="block text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="edit-task-description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="edit-task-due-date" className="block text-sm font-medium text-gray-700">
                    Due Date
                  </label>
                  <input
                    type="date"
                    id="edit-task-due-date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                 <div>
                  <label htmlFor="edit-task-status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="edit-task-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'To Do' | 'In Progress' | 'Done' | 'Updated')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                    <option value="Updated">Updated</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="edit-task-comments" className="block text-sm font-medium text-gray-700">
                    Comments
                  </label>
                  <textarea
                    id="edit-task-comments"
                    rows={2}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 