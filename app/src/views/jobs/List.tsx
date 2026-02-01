import { useState, useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import { jobService } from '../../services/job_service';
import { clientService } from '../../services/client_service';
import { serviceService } from '../../services/service_service';
import type { LaundryJob } from '../../types/job_interface';
import type { Client } from '../../types/client_interface';
import type { DefaultServices } from '../../types/service_interface';
import Card from './Card';
import Form from './Form';
import { Theme } from '../../components/ui/Theme';

export default function List() {
  const [jobs, setJobs] = useState<LaundryJob[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<DefaultServices[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingJob, setViewingJob] = useState<LaundryJob | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load all required data
      const [fetchedJobs, fetchedClients, fetchedServices] = await Promise.all([
        jobService.getAllJobs(),
        clientService.getAllClients(),
        serviceService.getAllServices(),
      ]);
      
      setJobs(fetchedJobs);
      setClients(fetchedClients);
      setServices(fetchedServices);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load data';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = async (jobData: Omit<LaundryJob, 'id'>) => {
    try {
      setError(null);
      await jobService.addJob(jobData);
      await loadData();
      setShowAddForm(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add job';
      setError(message);
    }
  };

  const handleUpdateJob = async (id: string, jobData: Partial<Omit<LaundryJob, 'id'>>) => {
    try {
      setError(null);
      const currentJob = jobs.find(j => j.id === id);
      const updateData: Partial<Omit<LaundryJob, 'id'>> = {
        ...jobData,
      };
      
      // Only add timestamp if we have a createdAt to preserve
      if (currentJob?.timestamp?.createdAt) {
        updateData.timestamp = {
          createdAt: currentJob.timestamp.createdAt,
          updatedAt: new Date().toISOString(),
        };
      } else {
        updateData.timestamp = {
          updatedAt: new Date().toISOString(),
        };
      }

      await jobService.updateJob(id, updateData);
      await loadData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update job';
      setError(message);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <p className={`${Theme.system.notice}`}>Loading jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className={`${Theme.system.error}`}>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {!showAddForm &&
        <div className="flex mb-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`${Theme.button.outline}`}
          >
            <Briefcase className="w-5 h-5" />
            <span>Add Job</span> 
          </button>
        </div>
      }

      {showAddForm && (
        <div className="mb-6 p-4 rounded-lg border border-cyan-500 bg-gradient-to-r from-blue-900/80 to-blue-500/90">
          <div className="flex gap-2 items-center mb-4">
            <div className="rounded-full h-12 w-12 flex items-center justify-center bg-cyan-200 text-cyan-600">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-medium text-cyan-500">New Job</h3>
            </div>
          </div>
          <Form
            onSubmit={handleAddJob}
            onCancel={() => setShowAddForm(false)}
            availableClients={clients}
            availableServices={services}
            isNewJobMode={true}
          />
        </div>
      )}

      {jobs.length === 0 ? (
        <p className={`${Theme.system.notice}`}>No jobs found. Add your first job to get started.</p>
      ) : (
        <div className="space-y-2">
          {jobs.map((job) => (
            <Card
              key={job.id}
              job={job}
              isViewing={viewingJob?.id === job.id}
              onView={() => setViewingJob(job)}
              onCancelView={() => setViewingJob(null)}
              onUpdate={(jobData) => handleUpdateJob(job.id, jobData)}
            />
          ))}
        </div>
      )}
    </div>
  );
}