import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Package, WashingMachine, InfoIcon, CheckCircle } from 'lucide-react';
import type { LaundryJob } from '../../types/job_interface';
import type { Client } from '../../types/client_interface';
import type { DefaultServices } from '../../types/service_interface';
import { CARD, CONTACT, Theme } from '../../components/ui/Theme';
import Form from './Form';
import { jobService } from '../../services/job_service';
import { clientService } from '../../services/client_service';
import { serviceService } from '../../services/service_service';

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [job, setJob] = useState<LaundryJob | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<DefaultServices[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingReceived, setIsEditingReceived] = useState(false);

  useEffect(() => {
    if (id) {
      loadJobData(id);
    }
  }, [id]);

  const loadJobData = async (jobId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch the job
      const fetchedJob = await jobService.getJob(jobId);
      setJob(fetchedJob);

      // Fetch the client for this job
      const fetchedClient = await clientService.getClient(fetchedJob.clientId);
      setClient(fetchedClient);

      // Fetch all clients and services for the edit form
      const [allClients, allServices] = await Promise.all([
        clientService.getAllClients(),
        serviceService.getAllServices(),
      ]);
      setClients(allClients);
      setServices(allServices);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load job';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (jobData: Partial<Omit<LaundryJob, 'id'>>) => {
    if (!id || !job) return;

    try {
      setError(null);
      const updateData: Partial<Omit<LaundryJob, 'id'>> = {
        ...jobData,
      };

      // Preserve creation timestamp
      if (job.timestamp?.createdAt) {
        updateData.timestamp = {
          createdAt: job.timestamp.createdAt,
          updatedAt: new Date().toISOString(),
        };
      } else {
        updateData.timestamp = {
          updatedAt: new Date().toISOString(),
        };
      }

      await jobService.updateJob(id, updateData);
      await loadJobData(id);
      setIsEditing(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update job';
      setError(message);
    }
  };

  const handleReceivedClick = () => {
    //if (!job?.jobOverview.dateReceived) {
      // If not yet received, enter edit mode
      setIsEditingReceived(true);
      setIsEditing(false); // Close main edit if open
    //}
    // If already received, do nothing (just shows the checkmark)
  };

  /*
  const handleReceivedClick = () => {
    if (!job?.jobOverview.dateReceived) {
      // If not yet received, enter edit mode
      setIsEditingReceived(true);
      setIsEditing(false); // Close main edit if open
    }
    // If already received, do nothing (just shows the checkmark)
  };
  */

  const handleReceivedUpdate = async (jobData: Partial<Omit<LaundryJob, 'id'>>) => {
    if (!id || !job) return;

    try {
      setError(null);
      const updateData: Partial<Omit<LaundryJob, 'id'>> = {
        ...jobData,
      };

      // Preserve creation timestamp
      if (job.timestamp?.createdAt) {
        updateData.timestamp = {
          createdAt: job.timestamp.createdAt,
          updatedAt: new Date().toISOString(),
        };
      } else {
        updateData.timestamp = {
          updatedAt: new Date().toISOString(),
        };
      }

      await jobService.updateJob(id, updateData);
      await loadJobData(id);
      setIsEditingReceived(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update job';
      setError(message);
    }
  };

  const getStatusColor = (status: LaundryJob['jobStatus']) => {
    const colors = {
      new: 'bg-gray-500/20 text-gray-400 border-gray-500',
      received: 'bg-blue-500/20 text-blue-400 border-blue-500',
      inspecting: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
      in_progress: 'bg-purple-500/20 text-purple-400 border-purple-500',
      quality_check: 'bg-cyan-500/20 text-cyan-400 border-cyan-500',
      completed: 'bg-green-500/20 text-green-400 border-green-500',
    };
    return colors[status];
  };

  const formatStatusText = (status: LaundryJob['jobStatus']) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getServiceById = (serviceId: string) => {
    return services.find(s => s.id === serviceId);
  };

  if (loading) {
    return (
      <div className="p-4">
        <p className={`${Theme.system.notice}`}>Loading job...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="p-4">
        <p className={`${Theme.system.error}`}>{error || 'Job not found'}</p>
        <button
          onClick={() => navigate('/jobs')}
          className={`${Theme.button.outline} mt-4`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Jobs</span>
        </button>
      </div>
    );
  }

  return (
    
    <div className={`${Theme.view.header}`}>
        <div className={`${Theme.view.title}`}>
            <WashingMachine className="w-6 h-6" />
            <h1>{job.jobReference}</h1>
        </div>

      <div className={`${Theme.view.content}`}>  
        <div className="p-4">
        {/* Top */}
        <div className="mb-6">
            <button
            onClick={() => navigate('/jobs')}
            className={`${Theme.button.outline} mb-4`}
            >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Jobs</span>
            </button>

            <div className={`${CARD.card}`}>
            <div className="flex items-start justify-between">
                <div className={`${CARD.icon_list}`}>
                <div>
                    <div className={`${CONTACT.profile_initial} bg-cyan-500/20 text-cyan-400`}>
                    <Package className="w-5 h-5" />
                    </div>
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-100">{job.jobReference}</h1>
                    <div className="flex gap-2 mt-2">
                    <span className={`${CARD.tags} ${getStatusColor(job.jobStatus)} border`}>
                        {formatStatusText(job.jobStatus)}
                    </span>
                    {client && (
                        <span className={`${CARD.tags} bg-gray-700 text-gray-300`}>
                        {client.name}
                        </span>
                    )}
                    </div>
                </div>
                </div>
            </div>
            {!isEditing && (
                <button
                    onClick={() => setIsEditing(true)}
                    className={`${Theme.button.outline} mt-4`}
                >
                    <Pencil className="w-5 h-5" />
                    <span>Edit</span>
                </button>
                )}
            </div>
        </div>

        {/* Job Content */}
        {isEditing ? (
            <div className={`${CARD.card}`}>
            <h2 className="text-xl font-medium text-cyan-500 mb-4">Edit Job</h2>
            <Form
                initialData={{
                clientId: job.clientId,
                clientJob: job.clientJob,
                jobStatus: job.jobStatus,
                jobOverview: job.jobOverview,
                }}
                onSubmit={handleUpdate}
                onCancel={() => setIsEditing(false)}
                availableClients={clients}
                availableServices={services}
                submitLabel="Update"
            />
            </div>
        ) : (
            <div className="space-y-4">
            {/* Client Details */}
            {client && (
                <div className={`${CARD.card}`}>
                <h2 className="text-lg font-medium text-gray-100 mb-4">Client Details</h2>
                <div className={`${CARD.list_content}`}>
                    <div className="pl-3 border-l-2 border-cyan-500">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-base font-bold text-cyan-500">
                        {client.name}
                        </span>
                        <span className="text-sm font-medium text-cyan-500">
                        {client.clientType}
                        </span>
                    </div>
                    <div className="text-sm text-gray-400 space-y-1">
                        <div>Job: {job.clientJob}</div>
                        <div>{client.email}</div>
                        <div>{client.phone}</div>
                    </div>
                    </div>
                </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className={`${CARD.card}`}>
              <h2 className="text-lg font-medium text-gray-100 mb-4">Job Actions</h2>
              <div className="grid grid-cols-4 gap-3">
                <button
                  onClick={handleReceivedClick}
                  className={`${Theme.button.outline} flex flex-col items-center justify-center text-xs font-bold p-4`}
                  type="button"
                  disabled={isEditingReceived || isEditing}
                >
                  {job.jobOverview.dateReceived ? (
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  ) : (
                    <InfoIcon className="w-8 h-8" />
                  )}
                  <p className="mt-2">Received</p>
                </button>
                <div className={`${Theme.button.outline} flex flex-col items-center justify-center text-xs font-bold p-4`}>
                  <InfoIcon className="w-8 h-8" />
                  <p className="mt-2">Inspection</p>
                </div>
                <div className={`${Theme.button.outline} flex flex-col items-center justify-center text-xs font-bold p-4`}>
                  <InfoIcon className="w-8 h-8" />
                  <p className="mt-2">Progress</p>
                </div>
                <div className={`${Theme.button.outline} flex flex-col items-center justify-center text-xs font-bold p-4`}>
                  <InfoIcon className="w-8 h-8" />
                  <p className="mt-2">Quality</p>
                </div>
              </div>
            </div>

            {/* Received Editing Form */}
            {isEditingReceived && (
              <div className={`${CARD.card}`}>
                <h2 className="text-xl font-medium text-cyan-500 mb-4">Mark as Received</h2>
                <Form
                  initialData={{
                    clientId: job.clientId,
                    clientName: job.clientName,
                    clientJob: job.clientJob,
                    jobReference: job.jobReference,
                    jobStatus: job.jobStatus,
                    jobOverview: job.jobOverview,
                  }}
                  onSubmit={handleReceivedUpdate}
                  onCancel={() => setIsEditingReceived(false)}
                  availableServices={services}
                  isReceivedMode={true}
                  submitLabel="Save & Mark Received"
                />
              </div>
            )}

            {/* Timeline */}
            <div className={`${CARD.card}`}>
                <h2 className="text-lg font-medium text-gray-100 mb-4">Timeline</h2>
                <div className={`${CARD.list_content}`}>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                    <span className="text-gray-400">Received:</span>
                    <span className="text-gray-300">{formatDate(job.jobOverview.dateReceived)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                    <span className="text-gray-400">Required:</span>
                    <span className="text-gray-300 font-medium">{formatDate(job.jobOverview.dateRequired)}</span>
                    </div>
                    {job.jobOverview.dateComplete && (
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Completed:</span>
                        <span className="text-green-400 font-medium">{formatDate(job.jobOverview.dateComplete)}</span>
                    </div>
                    )}
                </div>
                </div>
            </div>

            {/* Quantities */}
            {(job.jobOverview.bagsCount !== undefined || job.jobOverview.itemsCount !== undefined) && (
                <div className={`${CARD.card}`}>
                <h2 className="text-lg font-medium text-gray-100 mb-4">Quantities</h2>
                <div className="grid grid-cols-2 gap-4">
                    {job.jobOverview.bagsCount !== undefined && (
                    <div className="p-4 rounded bg-gray-800/50 border border-gray-700">
                        <div className="text-sm text-gray-400 mb-1">Bags</div>
                        <div className="text-2xl font-bold text-cyan-400">{job.jobOverview.bagsCount}</div>
                    </div>
                    )}
                    {job.jobOverview.itemsCount !== undefined && (
                    <div className="p-4 rounded bg-gray-800/50 border border-gray-700">
                        <div className="text-sm text-gray-400 mb-1">Items</div>
                        <div className="text-2xl font-bold text-cyan-400">{job.jobOverview.itemsCount}</div>
                    </div>
                    )}
                </div>
                </div>
            )}

            {/* Services */}
            {job.jobOverview.services && job.jobOverview.services.length > 0 && (
                <div className={`${CARD.card}`}>
                <h2 className="text-lg font-medium text-gray-100 mb-4">Services</h2>
                <div className={`${CARD.list_content}`}>
                    <div className="space-y-3">
                    {job.jobOverview.services.map((serviceId, index) => {
                        const service = getServiceById(serviceId);
                        if (!service) return null;
                        
                        return (
                        <div key={index} className="pl-3 border-l-2 border-cyan-500">
                            <div className="flex items-center justify-between mb-1">
                            <span className="text-base font-bold text-cyan-500">
                                {service.name}
                            </span>
                            <span className="text-sm font-medium text-cyan-500">
                                {service.service}
                            </span>
                            </div>
                            {service.default_prices && service.default_prices.length > 0 && (
                            <div className="text-sm text-gray-400">
                                {service.default_prices.map((price, idx) => (
                                <span key={idx} className="mr-3">
                                    €{price.price.toFixed(2)} / {price.unit.replace(/_/g, ' ')}
                                </span>
                                ))}
                            </div>
                            )}
                        </div>
                        );
                    })}
                    </div>
                </div>
                </div>
            )}

            {/* Timestamps */}
            <div className={`${CARD.card}`}>
                <h2 className="text-lg font-medium text-gray-100 mb-4">Record Info</h2>
                <div className={`${CARD.list_content}`}>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                    <span className="text-gray-400">Created:</span>
                    <span className="text-gray-300">{formatDate(job.timestamp?.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="text-gray-400">Updated:</span>
                    <span className="text-gray-300">{formatDate(job.timestamp?.updatedAt)}</span>
                    </div>
                </div>
                </div>
            </div>
            </div>
        )}
        </div>
      </div>
    </div>
  );
}