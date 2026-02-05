import { useState } from 'react';
import type { AuthUser } from '../../types/user_interface';
import { Theme } from '../../components/ui/Theme';

interface FormProps {
  initialData?: Partial<Omit<AuthUser, 'uid'>>;
  onSubmit: (data: Omit<AuthUser, 'uid'> & { password?: string }) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  isEditMode?: boolean;
}

export default function Form({ 
  initialData, 
  onSubmit, 
  onCancel,
  submitLabel = 'Save',
  isEditMode = false
}: FormProps) {
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
    <form onSubmit={handleSubmit} className={`${Theme.form.layout}`} autoComplete="off">
      <div>
        <label htmlFor="name" className={`${Theme.form.label}`}>
          Name *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`${Theme.form.input} `}
          autoComplete="off"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className={`${Theme.form.label}`}>
          Email *
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`${Theme.form.input}`}
          autoComplete="new-email"
          required
        />
      </div>

      <div>
        <label htmlFor="phone" className={`${Theme.form.label}`}>
          Phone
        </label>
        <input
          type="phone"
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className={`${Theme.form.input}`}
          autoComplete="new-phone"
        />
      </div>

      <div>
        <label htmlFor="role" className={`${Theme.form.label}`}>
          Role *
        </label>
        <select
          id="role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value as AuthUser['role'] })}
          className={`${Theme.form.input}`}
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
            <label htmlFor="password" className={`${Theme.form.label}`}>
              Password *
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`${Theme.form.input}`}
              minLength={6}
              autoComplete="new-password"
              required
              placeholder="Minimum 6 characters"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className={`${Theme.form.label}`}>
              Confirm Password *
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className={`${Theme.form.input}`}
              minLength={6}
              autoComplete="new-password"
              required
              placeholder="Re-enter password"
            />
          </div>
        </>
      )}

      <div className={`${Theme.form.action}`}>
        <button
          type="submit"
          disabled={submitting}
          className={`${Theme.button.solid}`}
        >
          {submitting ? 'Saving...' : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className={`${Theme.button.outline}`}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}