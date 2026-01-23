import { useState } from 'react';
import type { UserDetails } from '../../../types/users';

interface UserFormProps {
  initialData?: Partial<Omit<UserDetails, 'uid'>>;
  onSubmit: (data: Omit<UserDetails, 'uid'> & { password?: string }) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  isEditMode?: boolean;
}

export default function UserForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  submitLabel = 'Save',
  isEditMode = false
}: UserFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    role: initialData?.role || 'operator' as const,
    password: '',
    confirmPassword: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    // Password validation for new users
    if (!isEditMode) {
      if (!formData.password || formData.password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
    }

    setSubmitting(true);
    try {
      const submitData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        ...(isEditMode ? {} : { password: formData.password })
      };
      await onSubmit(submitData);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 " autoComplete="off">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-cyan-500 mb-1">
          Name *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-cyan-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="off"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-cyan-500 mb-1">
          Email *
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 border border-cyan-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="new-email"
          required
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-cyan-500 mb-1">
          Phone
        </label>
        <input
          type="phone"
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-3 py-2 border border-cyan-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="new-phone"
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-cyan-500 mb-1">
          Role *
        </label>
        <select
          id="role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value as UserDetails['role'] })}
          className="w-full px-3 py-2 border border-cyan-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="owner">Owner</option>
          <option value="manager">Manager</option>
          <option value="operator">Operator</option>
          <option value="driver">Driver</option>
          <option value="developer">Developer</option>
        </select>
      </div>

      {!isEditMode && (
        <>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-cyan-500 mb-1">
              Password *
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-cyan-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              minLength={6}
              autoComplete="new-password"
              required
              placeholder="Minimum 6 characters"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-cyan-500 mb-1">
              Confirm Password *
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-3 py-2 border border-cyan-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              minLength={6}
              autoComplete="new-password"
              required
              placeholder="Re-enter password"
            />
          </div>
        </>
      )}

      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 px-4 py-2 bg-gradient-to-t from-cyan-700 to-cyan-500 text-white rounded hover:from-cyan-600 hover:to-cyan-400 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Saving...' : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="flex-1 px-4 py-2 bg-gradient-to-t from-gray-400 to-gray-200 text-gray-700 rounded hover:from-gray-300 hover:to-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}