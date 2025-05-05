'use client';

import { useState, useEffect, FormEvent } from 'react';
import type { Milestone } from '@/lib/mockData';

interface EditMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateMilestone: (milestoneId: string, data: Omit<Milestone, 'id' | 'tasks'>) => Promise<void>; 
  milestone: Milestone | null; // The milestone being edited
}

export default function EditMilestoneModal({
  isOpen,
  onClose,
  onUpdateMilestone,
  milestone,
}: EditMilestoneModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<'Not Started' | 'In Progress' | 'Completed'>('Not Started');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill form when milestone data is available or changes
  useEffect(() => {
    if (milestone) {
      setTitle(milestone.title || '');
      setDescription(milestone.description || '');
      setStatus(milestone.status || 'Not Started');
      // Format ISO date string to yyyy-mm-dd for the date input
      setDueDate(milestone.dueDate ? new Date(milestone.dueDate).toISOString().split('T')[0] : '');
    } else {
      // Reset form if milestone becomes null (e.g., modal closes and reopens quickly)
      setTitle('');
      setDescription('');
      setDueDate('');
      setStatus('Not Started');
    }
  }, [milestone]);

  if (!isOpen || !milestone) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!title.trim()) {
      setError('Title is required.');
      setIsSubmitting(false);
      return;
    }

    const updatedData: Omit<Milestone, 'id' | 'tasks'> = {
      title,
      description,
      status,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
    };

    try {
      await onUpdateMilestone(milestone.id, updatedData);
      onClose(); // Close modal on success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update milestone');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-20 overflow-y-auto bg-gray-500 bg-opacity-75 transition-opacity">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Edit Milestone</h3>
              {error && (
                <div className="mb-4 p-2 text-sm text-red-700 bg-red-100 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                {/* Form fields are the same as AddMilestoneModal, but use state variables */}
                <div>
                  <label htmlFor="edit-milestone-title" className="block text-sm font-medium text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="edit-milestone-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="edit-milestone-description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="edit-milestone-description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="edit-milestone-due-date" className="block text-sm font-medium text-gray-700">
                    Due Date
                  </label>
                  <input
                    type="date"
                    id="edit-milestone-due-date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="edit-milestone-status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="edit-milestone-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'Not Started' | 'In Progress' | 'Completed')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
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