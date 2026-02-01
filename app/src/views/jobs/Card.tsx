import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Package, InfoIcon, CheckCircle } from 'lucide-react';
import type { LaundryJob } from '../../types/job_interface';
import type { Client } from '../../types/client_interface';
import type { DefaultServices } from '../../types/service_interface';
import { CARD, CONTACT, Theme } from '../../components/ui/Theme';
import Form from './Form';
import { clientService } from '../../services/client_service';
import { serviceService } from '../../services/service_service';


interface CardProps {
  job: LaundryJob;
  isViewing: boolean;
  onView: () => void;
  onCancelView: () => void;
  isEditing: boolean;
  onEdit: () => void;
  onUpdate: (data: Partial<Omit<LaundryJob, 'id'>>) => Promise<void>;
  onCancelEdit: () => void;
}

export default function Card({
  job,
  isViewing,
  onView,
  onCancelView,
  isEditing,
  onEdit,
  onUpdate,
  onCancelEdit,
}: CardProps) {
  const [client, setClient] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<DefaultServices[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Fetch client info when viewing or editing mode is activated
  useEffect(() => {
    const fetchData = async () => {
      if (isViewing || isEditing) {
        try {
          setLoadingData(true);
          
          // Fetch the specific client for this job
          const fetchedClient = await clientService.getClient(job.clientId);
          setClient(fetchedClient);
          
          // Fetch all clients for the form dropdown
          const allClients = await clientService.getAllClients();
          setClients(allClients);
          
          // Fetch all services for the form
          const allServices = await serviceService.getAllServices();
          setServices(allServices);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoadingData(false);
        }
      }
    };

    fetchData();
  }, [isViewing, isEditing, job.clientId]);

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

  return (
    <div className={`${CARD.card}`}>
      <div className={`${CARD.header}`}>
        <div className={`${CARD.title}`}>
          <div className={`${CARD.icon_list}`}>
            <div>
              <div className={`${CONTACT.profile_initial} bg-cyan-500/20 text-cyan-400`}>
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div>
              {isViewing 
                ? <h3 className={`${CARD.selected_name}`}>{job.jobReference}</h3>
                : <h3 className={`${CARD.name}`}>{job.jobReference}</h3>
              }
              <div className="flex gap-2 mt-1">
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
        {isViewing 
          ? <div className={`${CARD.selection}`} onClick={onCancelView}></div> 
          : <div className={`${CARD.selection}`} onClick={onView}></div>
        }
      </div>

      {isViewing &&
        <div>
          <div className={`${CARD.list_content}`}>
            {/* Client Info */}
            {client && (
              <div className={`${CARD.icon_list}`}>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-100 mb-2">Client Details</p>
                  <div className="pl-3 border-l-2 border-cyan-500">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-cyan-500">
                        {client.name}
                      </span>
                      <span className="text-xs font-medium text-cyan-500">
                        {client.clientType}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 space-y-0.5">
                      <div>Job: {job.clientJob}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Services */}
            {job.jobOverview.services && job.jobOverview.services.length > 0 && (
              <div className={`${CARD.icon_list}`}>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-100 mb-2">Services</p>
                  <div className="space-y-2">
                    {job.jobOverview.services.map((serviceId, index) => {
                      const service = getServiceById(serviceId);
                      if (!service) return null;
                      
                      return (
                        <div key={index} className="pl-3 border-l-2 border-cyan-500">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-bold text-cyan-500">
                              {service.name}
                            </span>
                            <span className="text-xs font-medium text-cyan-500">
                              {service.service}
                            </span>
                          </div>
                          {service.default_prices && service.default_prices.length > 0 && (
                            <div className="text-xs text-gray-400">
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
            {/* Counts */}
            {(job.jobOverview.bagsCount !== undefined || job.jobOverview.itemsCount !== undefined) && (
              <div className={`${CARD.icon_list}`}>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-100 mb-2">Quantities</p>
                  <div className="grid grid-cols-2 gap-3">
                    {job.jobOverview.bagsCount !== undefined && (
                      <div className="p-2 rounded bg-gray-800/50 border border-gray-700">
                        <div className="text-xs text-gray-400">Bags</div>
                        <div className="text-lg font-bold text-cyan-400">{job.jobOverview.bagsCount}</div>
                      </div>
                    )}
                    {job.jobOverview.itemsCount !== undefined && (
                      <div className="p-2 rounded bg-gray-800/50 border border-gray-700">
                        <div className="text-xs text-gray-400">Items</div>
                        <div className="text-lg font-bold text-cyan-400">{job.jobOverview.itemsCount}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={`${Theme.button.outline}`}>
            <Link to={`/jobs/${job.id}`} >
              View Job Details
            </Link>
          </div>

          {/* Temp button placement for job timeline and editing */}
          <div className={`${CARD.contact_grid} mt-4`}>
            <div className={`${Theme.button.outline} grid gri-cols-1 text-xs font-bold`}>
              <CheckCircle className="w-8 h-8 mx-auto" />
              <p>Received</p>
            </div>
            <div className={`${Theme.button.outline} grid gri-cols-1 text-xs font-bold`}>
              <InfoIcon className="w-8 h-8 mx-auto" />
              <p>Inspection</p>
            </div>
            <div className={`${Theme.button.outline} grid gri-cols-1 text-xs font-bold`}>
              <InfoIcon className="w-8 h-8 mx-auto" />
              <p>Progress</p>
            </div>
            <div className={`${Theme.button.outline} grid gri-cols-1 text-xs font-bold`}>
              <InfoIcon className="w-8 h-8 mx-auto" />
              <p>Quality</p>
            </div>
          </div>

          <div className="flex gap-2 sm:flex-col sm:w-auto mt-4">
            {!isEditing &&
              <button
                onClick={onEdit}
                className={`${Theme.button.solid}`}
                title="Edit Job"
              >
                <Pencil className="w-5 h-5" />
                <span>Edit Job</span>
              </button>
            }
          </div>

          {isEditing &&
            <div>
              {loadingData ? (
                <div className="text-center py-4 text-gray-400">Loading data...</div>
              ) : (
                <Form
                  initialData={{
                    clientId: job.clientId,
                    clientJob: job.clientJob,
                    jobStatus: job.jobStatus,
                    jobOverview: job.jobOverview,
                  }}
                  onSubmit={onUpdate}
                  onCancel={onCancelEdit}
                  availableClients={clients}
                  availableServices={services}
                  submitLabel="Update"
                />
              )}
            </div>
          }

          {/* Timestamps */}
          <div className={`${CARD.icon_list} pt-4`}>
            <div className="flex-1">
              <div className="space-y-1 text-xs">
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
      }
    </div>
  );
}