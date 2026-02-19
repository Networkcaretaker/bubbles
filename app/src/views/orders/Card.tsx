import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import type { LaundryJob } from '../../types/job_interface';
import type { DefaultServices } from '../../types/service_interface';
import { CARD, CONTACT, Theme } from '../../components/ui/Theme';
import { serviceService } from '../../services/service_service';


interface CardProps {
  job: LaundryJob;
  isViewing: boolean;
  onView: () => void;
  onCancelView: () => void;
}

export default function Card({
  job,
  isViewing,
  onView,
  onCancelView,
}: CardProps) {
  const [services, setServices] = useState<DefaultServices[]>([]);

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
                    <span className="text-xs font-medium text-gray-400">
                      Client: <span className="text-sm text-cyan-500 font-bold">{job.clientName}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-400">
                      Job: <span className="text-sm text-cyan-500 font-bold">{job.clientJob}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-400">
                      Order: <span className="text-sm text-cyan-500 font-bold">{job.jobReference}</span>
                    </span>
                  </div>
                  {job.jobOverview.dateRequired && (
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-400">
                        Date Required: <span className="text-sm text-cyan-500 font-bold">{formatDate(job.jobOverview.dateRequired)}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Counts */}
            {(job.jobOverview.bagsCount !== undefined || job.jobOverview.itemsCount !== undefined) && (
              <div className={`${CARD.icon_list}`}>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-100 mb-2">Quantities</p>
                  {job.jobOverview.bagsCount !== undefined && (
                  <div className="pl-3 border-l-2 border-cyan-500">
                    <span className="text-xs font-medium text-gray-400">
                      Bags: <span className="text-sm text-cyan-500 font-bold">{job.jobOverview.bagsCount}</span>
                    </span>
                  </div>
                  )}
                  {job.jobOverview.itemsCount !== undefined && (
                  <div className="pl-3 border-l-2 border-cyan-500">
                    <span className="text-xs font-medium text-gray-400">
                      Items: <span className=" text-sm text-cyan-500 font-bold">{job.jobOverview.itemsCount}</span>
                    </span>
                  </div>
                  )}
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
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link to={`/jobs/${job.id}`} className={`${Theme.button.outline}`}>
            View Job Details
          </Link>

        </div>
      }
    </div>
  );
}