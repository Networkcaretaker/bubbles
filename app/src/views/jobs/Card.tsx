import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, InfoIcon, CheckCircle } from 'lucide-react';
import type { LaundryJob } from '../../types/job_interface';
import type { DefaultServices } from '../../types/service_interface';
import { CARD, CONTACT, Theme } from '../../components/ui/Theme';
import { serviceService } from '../../services/service_service';


interface CardProps {
  job: LaundryJob;
  isViewing: boolean;
  onView: () => void;
  onCancelView: () => void;
  onUpdate: (data: Partial<Omit<LaundryJob, 'id'>>) => Promise<void>;
}

export default function Card({
  job,
  isViewing,
  onView,
  onCancelView,
  onUpdate,
}: CardProps) {
  const [services, setServices] = useState<DefaultServices[]>([]);
  const [isEditingReceived, setIsEditingReceived] = useState(false);
  const [receivedFormData, setReceivedFormData] = useState({
    bagsCount: undefined as number | undefined,
    itemsCount: undefined as number | undefined,
    dateRequired: '',
    services: [] as string[],
  });

  // Fetch services only when viewing mode is activated
  // Note: We use job.clientName in the card to avoid fetching client data
  useEffect(() => {
    const fetchData = async () => {
      if (isViewing) {
        try {
          // Fetch all services for display
          const allServices = await serviceService.getAllServices();
          setServices(allServices);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, [isViewing, job.clientId]);

  // Initialize received form data when entering edit mode
  useEffect(() => {
    if (isEditingReceived) {
      setReceivedFormData({
        bagsCount: job.jobOverview.bagsCount,
        itemsCount: job.jobOverview.itemsCount,
        dateRequired: job.jobOverview.dateRequired || '',
        services: job.jobOverview.services || [],
      });
    }
  }, [isEditingReceived, job.jobOverview]);

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

  /*const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };*/

  const getServiceById = (serviceId: string) => {
    return services.find(s => s.id === serviceId);
  };

  const toggleServiceInReceived = (serviceId: string) => {
    setReceivedFormData(prev => {
      const services = prev.services || [];
      const isSelected = services.includes(serviceId);
      
      return {
        ...prev,
        services: isSelected 
          ? services.filter(id => id !== serviceId)
          : [...services, serviceId]
      };
    });
  };

  const handleReceivedClick = () => {
    if (!job.jobOverview.dateReceived) {
      // If not yet received, enter edit mode
      setIsEditingReceived(true);
    }
    // If already received, do nothing (just shows the checkmark)
  };

  const handleSaveReceived = async () => {
    try {
      await onUpdate({
        jobStatus: 'received',
        jobOverview: {
          ...job.jobOverview,
          dateReceived: new Date().toISOString(), // Auto-set received date
          dateRequired: receivedFormData.dateRequired,
          bagsCount: receivedFormData.bagsCount,
          itemsCount: receivedFormData.itemsCount,
          services: receivedFormData.services,
        }
      });
      setIsEditingReceived(false);
    } catch (error) {
      console.error('Error saving received data:', error);
    }
  };

  const handleCancelReceived = () => {
    setIsEditingReceived(false);
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
                {job.clientName && (
                  <span className={`${CARD.tags} bg-gray-700 text-gray-300`}>
                    {job.clientName}
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
            <div className={`${CARD.icon_list}`}>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-100 mb-2">Client Details</p>
                <div className="pl-3 border-l-2 border-cyan-500">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-cyan-500">
                      {job.clientName}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 space-y-0.5">
                    <div>Job: {job.clientJob}</div>
                  </div>
                </div>
              </div>
            </div>

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

          <Link to={`/jobs/${job.id}`} className={`${Theme.button.outline}`}>
            View Job Details
          </Link>


          {/* Temp button placement for job timeline and editing */}
          <div className={`${CARD.contact_grid} mt-4`}>
            <button
              onClick={handleReceivedClick}
              className={`${Theme.button.outline} grid gri-cols-1 text-xs font-bold`}
              type="button"
            >
              {job.jobOverview.dateReceived ? (
                <CheckCircle className="w-8 h-8 mx-auto text-green-400" />
              ) : (
                <InfoIcon className="w-8 h-8 mx-auto" />
              )}
              <p>Received</p>
            </button>
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

          {/* Received Editing Form */}
          {isEditingReceived && (
            <div className="mt-4 p-4 rounded-lg border border-cyan-500 bg-gray-800/50">
              <h4 className="text-sm font-medium text-cyan-500 mb-4">Mark as Received</h4>
              
              {/* Date Required */}
              <div className="mb-4">
                <label className={`${Theme.form.label}`}>
                  Date Required
                </label>
                <input
                  type="datetime-local"
                  value={receivedFormData.dateRequired ? new Date(receivedFormData.dateRequired).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setReceivedFormData({
                    ...receivedFormData,
                    dateRequired: e.target.value ? new Date(e.target.value).toISOString() : '',
                  })}
                  className={`${Theme.form.input}`}
                />
              </div>

              {/* Bags Count */}
              <div className="mb-4">
                <label className={`${Theme.form.label}`}>
                  Bags Count
                </label>
                <input
                  type="number"
                  min="0"
                  value={receivedFormData.bagsCount || ''}
                  onChange={(e) => setReceivedFormData({
                    ...receivedFormData,
                    bagsCount: e.target.value ? parseInt(e.target.value) : undefined,
                  })}
                  className={`${Theme.form.input}`}
                  placeholder="0"
                />
              </div>

              {/* Items Count */}
              <div className="mb-4">
                <label className={`${Theme.form.label}`}>
                  Items Count
                </label>
                <input
                  type="number"
                  min="0"
                  value={receivedFormData.itemsCount || ''}
                  onChange={(e) => setReceivedFormData({
                    ...receivedFormData,
                    itemsCount: e.target.value ? parseInt(e.target.value) : undefined,
                  })}
                  className={`${Theme.form.input}`}
                  placeholder="0"
                />
              </div>

              {/* Services */}
              <div className="mb-4">
                <label className={`${Theme.form.label}`}>
                  Services
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto p-3 rounded-lg bg-gray-800/30 border border-gray-700">
                  {services.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">
                      No services available
                    </p>
                  ) : (
                    services.map(service => (
                      <label
                        key={service.id}
                        className="flex items-start gap-3 p-2 rounded hover:bg-gray-700/30 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={receivedFormData.services?.includes(service.id) || false}
                          onChange={() => toggleServiceInReceived(service.id)}
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
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveReceived}
                  className={`${Theme.button.solid}`}
                >
                  Save & Mark Received
                </button>
                <button
                  type="button"
                  onClick={handleCancelReceived}
                  className={`${Theme.button.outline}`}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      }
    </div>
  );
}