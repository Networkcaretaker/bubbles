import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import type { LaundryJob } from '../../types/job_interface';
import type { Client } from '../../types/client_interface';
import type { DefaultServices } from '../../types/service_interface';
import { Theme } from '../../components/ui/Theme';

interface FormProps {
  initialData?: Partial<Omit<LaundryJob, 'id'>>;
  onSubmit: (data: Omit<LaundryJob, 'id'>) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  availableClients?: Client[];
  availableServices?: DefaultServices[];
  isNewJobMode?: boolean; // Simplified form for creating new jobs
  isReceivedMode?: boolean; // Simplified form for marking job as received
}

export default function Form({ 
  initialData, 
  onSubmit, 
  onCancel,
  submitLabel = 'Save',
  availableClients = [],
  availableServices = [],
  isNewJobMode = false,
  isReceivedMode = false,
}: FormProps) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    clientId: initialData?.clientId || '',
    clientName: initialData?.clientName || '',
    clientJob: initialData?.clientJob || '',
    jobStatus: initialData?.jobStatus || 'new' as const,
    jobOverview: {
      dateReceived: initialData?.jobOverview?.dateReceived || '',
      dateRequired: initialData?.jobOverview?.dateRequired || '',
      dateComplete: initialData?.jobOverview?.dateComplete || '',
      bagsCount: initialData?.jobOverview?.bagsCount || undefined,
      itemsCount: initialData?.jobOverview?.itemsCount || undefined,
      services: initialData?.jobOverview?.services || [] as string[],
    }
  });
  const [submitting, setSubmitting] = useState(false);

  // Set selected client on initial load if editing
  useEffect(() => {
    if (initialData?.clientId && availableClients.length > 0) {
      const client = availableClients.find(c => c.id === initialData.clientId);
      if (client) {
        setSelectedClient(client);
        // Also set clientName in formData if it wasn't provided in initialData
        if (!initialData?.clientName && client.name) {
          setFormData(prev => ({
            ...prev,
            clientName: client.name
          }));
        }
      }
    }
  }, [initialData?.clientId, initialData?.clientName, availableClients]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Skip client validation in Received mode (job already exists)
    if (!isReceivedMode && (!formData.clientId || !formData.clientName || !formData.clientJob)) {
      alert('Please select a client and job');
      return;
    }

    /*if (!formData.jobOverview.dateRequired) {
      alert('Please provide a required date');
      return;
    }*/

    setSubmitting(true);
    try {
      // Generate job reference (only for new jobs)
      const jobReference = isReceivedMode || initialData?.jobReference 
        ? (initialData?.jobReference || '') 
        : generateJobReference(formData.clientJob);
      
      // Clean up jobOverview to remove undefined values
      const cleanedJobOverview: Partial<typeof formData.jobOverview> = {
        dateReceived: isReceivedMode ? new Date().toISOString() : formData.jobOverview.dateReceived, // Auto-set in Received mode
        dateRequired: formData.jobOverview.dateRequired,
        dateComplete: formData.jobOverview.dateComplete,
        services: formData.jobOverview.services,
      };
      
      // Only add bagsCount and itemsCount if they have values
      if (formData.jobOverview.bagsCount !== undefined) {
        cleanedJobOverview.bagsCount = formData.jobOverview.bagsCount;
      }
      if (formData.jobOverview.itemsCount !== undefined) {
        cleanedJobOverview.itemsCount = formData.jobOverview.itemsCount;
      }
      
      await onSubmit({
        clientId: formData.clientId,
        clientName: formData.clientName,
        clientJob: formData.clientJob,
        jobStatus: isReceivedMode ? 'received' : formData.jobStatus, // Auto-set to 'received' in Received mode
        jobReference,
        jobOverview: cleanedJobOverview as typeof formData.jobOverview,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const generateJobReference = (clientJobName: string): string => {
    // Convert job name to lowercase and replace spaces with dashes
    const jobSlug = clientJobName.toLowerCase().replace(/\s+/g, '-');
    
    // Generate date string as YYMMDD
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const dateId = `${year}${month}${day}`;
    
    return `${jobSlug}-${dateId}`;
  };

  const handleClientChange = (clientId: string) => {
    const client = availableClients.find(c => c.id === clientId);
    setSelectedClient(client || null);
    setFormData(prev => ({
      ...prev,
      clientId,
      clientName: client?.name || '', // Auto-populate client name
      clientJob: '', // Reset job selection when client changes
    }));
  };

  const logDateComplete = () => {
    const now = new Date().toISOString();
    setFormData(prev => ({
      ...prev,
      jobOverview: {
        ...prev.jobOverview,
        dateComplete: now,
      },
      jobStatus: 'completed', // Auto-update status to completed
    }));
  };

  const toggleService = (serviceId: string) => {
    setFormData(prev => {
      const services = prev.jobOverview.services || [];
      const isSelected = services.includes(serviceId);
      
      return {
        ...prev,
        jobOverview: {
          ...prev.jobOverview,
          services: isSelected 
            ? services.filter(id => id !== serviceId)
            : [...services, serviceId]
        }
      };
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /*const getServiceById = (serviceId: string) => {
    return availableServices.find(s => s.id === serviceId);
  };*/

  return (
    <form onSubmit={handleSubmit} className={`${Theme.form.layout}`} autoComplete="off">
      {/* Client Selection - Hidden in Received mode */}
      {!isReceivedMode && (
        <div>
          <label htmlFor="clientId" className={`${Theme.form.label}`}>
            Client *
          </label>
          <select
            id="clientId"
            value={formData.clientId}
            onChange={(e) => handleClientChange(e.target.value)}
            className={`${Theme.form.input}`}
            required
          >
            <option value="">Select a client...</option>
            {availableClients.map(client => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Client Job Selection - Hidden in Received mode */}
      {!isReceivedMode && (
        <div>
        <label htmlFor="clientJob" className={`${Theme.form.label}`}>
          Client Job *
        </label>
        <select
          id="clientJob"
          value={formData.clientJob}
          onChange={(e) => setFormData({ ...formData, clientJob: e.target.value })}
          className={`${Theme.form.input}`}
          disabled={!selectedClient || !selectedClient.clientJobs || selectedClient.clientJobs.length === 0}
          required
        >
          <option value="">
            {!selectedClient 
              ? 'Select a client first...' 
              : (!selectedClient.clientJobs || selectedClient.clientJobs.length === 0)
                ? 'No jobs available for this client'
                : 'Select a job...'}
          </option>
          {selectedClient?.clientJobs?.map((job, index) => (
            <option key={index} value={job.jobName}>
              {job.jobName} ({job.jobType})
            </option>
          ))}
        </select>
      </div>
      )}

      {/* Job Status - Only shown when editing existing jobs */}
      {!isNewJobMode && !isReceivedMode && (
        <div>
          <label htmlFor="jobStatus" className={`${Theme.form.label}`}>
            Job Status *
          </label>
          <select
            id="jobStatus"
            value={formData.jobStatus}
            onChange={(e) => setFormData({ ...formData, jobStatus: e.target.value as LaundryJob['jobStatus'] })}
            className={`${Theme.form.input}`}
            required
          >
            <option value="new">New</option>
            <option value="received">Received</option>
            <option value="inspecting">Inspecting</option>
            <option value="in_progress">In Progress</option>
            <option value="quality_check">Quality Check</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      )}

      {/* Date Required - Shown in Received and Edit modes, hidden in New mode */}
      {!isNewJobMode && (
        <div>
        <label htmlFor="dateRequired" className={`${Theme.form.label}`}>
          Date Required *
        </label>
        <input
          type="datetime-local"
          id="dateRequired"
          value={formData.jobOverview.dateRequired ? new Date(formData.jobOverview.dateRequired).toISOString().slice(0, 16) : ''}
          onChange={(e) => setFormData({
            ...formData,
            jobOverview: {
              ...formData.jobOverview,
              dateRequired: e.target.value ? new Date(e.target.value).toISOString() : '',
            }
          })}
          className={`${Theme.form.input}`}
        />
      </div>
      )}

      {/* Date Complete - Hidden in New and Received modes */}
      {!isNewJobMode && !isReceivedMode && (
        <div>
        <label className={`${Theme.form.label}`}>
          Date Completed
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={formatDate(formData.jobOverview.dateComplete)}
            className={`${Theme.form.input} flex-1`}
            readOnly
          />
          <button
            type="button"
            onClick={logDateComplete}
            className={`${Theme.button.outline} whitespace-nowrap`}
            title="Mark as complete"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Mark Complete</span>
          </button>
        </div>
      </div>
      )}

      {/* Bags Count - Shown in Received and Edit modes, hidden in New mode */}
      {!isNewJobMode && (
        <div>
        <label htmlFor="bagsCount" className={`${Theme.form.label}`}>
          Bags Count
        </label>
        <input
          type="number"
          id="bagsCount"
          min="0"
          value={formData.jobOverview.bagsCount || ''}
          onChange={(e) => setFormData({
            ...formData,
            jobOverview: {
              ...formData.jobOverview,
              bagsCount: e.target.value ? parseInt(e.target.value) : undefined,
            }
          })}
          className={`${Theme.form.input}`}
          placeholder="0"
        />
      </div>
      )}

      {/* Items Count - Shown in Received and Edit modes, hidden in New mode */}
      {!isNewJobMode && (
        <div>
        <label htmlFor="itemsCount" className={`${Theme.form.label}`}>
          Items Count
        </label>
        <input
          type="number"
          id="itemsCount"
          min="0"
          value={formData.jobOverview.itemsCount || ''}
          onChange={(e) => setFormData({
            ...formData,
            jobOverview: {
              ...formData.jobOverview,
              itemsCount: e.target.value ? parseInt(e.target.value) : undefined,
            }
          })}
          className={`${Theme.form.input}`}
          placeholder="0"
        />
      </div>
      )}

      {/* Services - Shown in Received and Edit modes, hidden in New mode */}
      {!isNewJobMode && (
        <div>
        <label className={`${Theme.form.label}`}>
          Services
        </label>
        <div className="space-y-2 max-h-64 overflow-y-auto p-3 rounded-lg bg-gray-800/30 border border-gray-700">
          {availableServices.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              No services available
            </p>
          ) : (
            availableServices.map(service => (
              <label
                key={service.id}
                className="flex items-start gap-3 p-2 rounded hover:bg-gray-700/30 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={formData.jobOverview.services?.includes(service.id) || false}
                  onChange={() => toggleService(service.id)}
                  className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-gray-900"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-200">
                      {service.name}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300">
                      {service.service}
                    </span>
                  </div>
                  {service.default_prices && service.default_prices.length > 0 && (
                    <div className="text-xs text-gray-400 mt-1">
                      {service.default_prices.map((price, idx) => (
                        <span key={idx} className="mr-3">
                          €{price.price.toFixed(2)} {price.unit.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </label>
            ))
          )}
        </div>
        {formData.jobOverview.services && formData.jobOverview.services.length > 0 && (
          <div className="mt-2 text-sm text-gray-400">
            {formData.jobOverview.services.length} service{formData.jobOverview.services.length !== 1 ? 's' : ''} selected
          </div>
        )}
      </div>
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