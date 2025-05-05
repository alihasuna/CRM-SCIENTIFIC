'use client';

import { useState, useRef, useEffect } from 'react';

interface InlineEditFieldProps {
  fieldName: string;
  initialValue: string | undefined | null;
  onSave: (fieldName: string, newValue: string) => Promise<void>;
  // Optional props for customization
  displayAs?: 'p' | 'textarea' | 'input' | 'link';
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>; 
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  label?: string; // Optional label for context
  placeholder?: string;
  emptyText?: string; // Text to display when value is empty
}

export default function InlineEditField({
  fieldName,
  initialValue,
  onSave,
  displayAs = 'p',
  inputProps = {},
  textareaProps = {},
  label,
  placeholder = 'Enter value...',
  emptyText = 'Not set'
}: InlineEditFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update internal state if initialValue changes from parent
  useEffect(() => {
     setValue(initialValue || '');
  }, [initialValue]);

  // Focus the input when entering edit mode
  useEffect(() => {
    if (isEditing) {
      if (displayAs === 'textarea' && textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.select(); // Select text for easy replacement
      } else if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
  }, [isEditing, displayAs]);

  const handleSave = async () => {
    if (value === initialValue) {
        setIsEditing(false);
        return; // No change, just exit edit mode
    }
    setIsLoading(true);
    setError('');
    try {
      await onSave(fieldName, value.trim());
      setIsEditing(false);
    } catch (err) {
      console.error(`Error saving field ${fieldName}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to save');
      // Keep editing mode open on error to allow retry/correction
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setValue(initialValue || ''); // Reset value
    setIsEditing(false);
    setError('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (displayAs === 'input' || (displayAs === 'textarea' && !event.shiftKey))) {
        event.preventDefault(); // Prevent default form submission/newline in textarea
        handleSave();
    } else if (event.key === 'Escape') {
        handleCancel();
    }
  };

  // Determine display value when not editing
  const displayValue = value || <span className="text-gray-500 italic">{emptyText}</span>;

  return (
    <div className="group relative py-1"> {/* Add padding for button positioning */}
      {label && <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>}
      
      {isEditing ? (
        <div className="space-y-2">
          {displayAs === 'textarea' ? (
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:opacity-70 disabled:bg-gray-100"
              placeholder={placeholder}
              rows={textareaProps.rows || 3} // Default rows
              {...textareaProps}
            />
          ) : (
            <input
              ref={inputRef}
              type={inputProps.type || (displayAs === 'link' ? 'url' : 'text')} // Default type
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:opacity-70 disabled:bg-gray-100"
              placeholder={placeholder}
              {...inputProps}
            />
          )}
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-2 py-1 text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="px-2 py-1 text-xs font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          {displayAs === 'link' ? (
            value ? 
              <a href={value.startsWith('http') ? value : `//${value}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline truncate">
                {value}
              </a>
            : displayValue
          ) : displayAs === 'textarea' ? (
             <p className="text-sm text-gray-700 whitespace-pre-wrap">{displayValue}</p>
          ) : (
             <p className="text-sm text-gray-700">{displayValue}</p>
          )}
          
          {/* Edit button appears on hover */}
          <button 
            onClick={() => setIsEditing(true)}
            className="absolute top-0 right-0 p-1 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity rounded-full hover:bg-gray-100"
            aria-label={`Edit ${label || fieldName}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
} 