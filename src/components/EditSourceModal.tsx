'use client';

import { useState, useEffect, FormEvent } from 'react';
import type { TheoreticalSource } from '@/lib/mockData';

interface EditSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateSource: (sourceId: string, sourceData: Omit<TheoreticalSource, 'id'>) => Promise<void>; 
  source: TheoreticalSource | null; // The source being edited
  projectId: string;
}

export default function EditSourceModal({
  isOpen,
  onClose,
  onUpdateSource,
  source,
  projectId,
}: EditSourceModalProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'paper' | 'book'>('paper');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill form when source data is available or changes
  useEffect(() => {
    if (source) {
      setTitle(source.title || '');
      setType(source.type || 'paper');
      setUrl(source.url || '');
      setNotes(source.notes || '');
    } else {
      // Reset form if source becomes null
      setTitle('');
      setType('paper');
      setUrl('');
      setNotes('');
    }
  }, [source]);

  if (!isOpen || !source) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!title.trim()) {
      setError('Source title is required.');
      setIsSubmitting(false);
      return;
    }

    const updatedData: Omit<TheoreticalSource, 'id'> = {
      title,
      type,
      url: url.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    try {
      await onUpdateSource(source.id, updatedData);
      onClose(); // Close modal on success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update source');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-30 overflow-y-auto bg-gray-500 bg-opacity-75 transition-opacity"> {/* Ensure high z-index */}
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Edit Theoretical Source</h3>
              {error && (
                <div className="mb-4 p-2 text-sm text-red-700 bg-red-100 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                {/* Fields are same as AddSourceModal */}
                 <div>
                  <label htmlFor="edit-source-title" className="block text-sm font-medium text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="edit-source-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                 <div>
                  <label htmlFor="edit-source-type" className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <select
                    id="edit-source-type"
                    value={type}
                    onChange={(e) => setType(e.target.value as 'paper' | 'book')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="paper">Paper</option>
                    <option value="book">Book</option>
                  </select>
                </div>
                 <div>
                  <label htmlFor="edit-source-url" className="block text-sm font-medium text-gray-700">
                    URL (Optional)
                  </label>
                  <input
                    type="url"
                    id="edit-source-url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="edit-source-notes" className="block text-sm font-medium text-gray-700">
                    Notes (Optional)
                  </label>
                  <textarea
                    id="edit-source-notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
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