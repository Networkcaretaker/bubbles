import { db } from './firebase/config';
import { 
  collection, 
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
  query, 
  orderBy
} from '@firebase/firestore';
import type { LaundryJob } from '../types/job_interface';

export const jobService = {
  async getAllJobs(): Promise<LaundryJob[]> {
    try {
      console.log('Fetching all jobs...');
      
      const q = query(
        collection(db, 'jobs'),
        orderBy('id')
      );
  
      const snapshot = await getDocs(q);
      
      const jobs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LaundryJob[];
  
      return jobs;
      
    } catch (error) {
      console.error('Firebase error fetching all jobs:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch all jobs: ${message}`);
    }
  },

  async getJob(id: string): Promise<LaundryJob> {
    try {
      console.log(`Fetching job with id: ${id}`);
      
      const jobDoc = await getDoc(doc(db, 'jobs', id));
      
      if (!jobDoc.exists()) {
        throw new Error(`Job with id ${id} not found`);
      }
      
      return {
        id: jobDoc.id,
        ...jobDoc.data()
      } as LaundryJob;
      
    } catch (error) {
      console.error(`Firebase error fetching job ${id}:`, error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch job: ${message}`);
    }
  },

  async addJob(jobData: Omit<LaundryJob, 'id'>): Promise<LaundryJob> {
    try {
      //console.log('Creating new job:', jobData.name);
      
      const jobRef = doc(collection(db, 'jobs'));
      const now = new Date().toISOString();

      const jobModel: LaundryJob = {
        id: jobRef.id,
        clientId: jobData.clientId,
        clientJob: jobData.clientJob,
        jobStatus: jobData.jobStatus,
        jobReference: jobData.jobReference,
        jobOverview: jobData.jobOverview,
        timestamp: {
          createdAt: now,
          updatedAt: now
        }
      };
      
      await setDoc(jobRef, jobModel);
      
      console.log('Job created successfully with id:', jobRef.id);
      
      return jobModel;
      
    } catch (error) {
      console.error('Firebase error adding job:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to add job: ${message}`);
    }
  },

  async updateJob(id: string, jobData: Partial<Omit<LaundryJob, 'id'>>): Promise<LaundryJob> {
    try {
      console.log(`Updating job ${id}:`, jobData);
      
      const jobRef = doc(db, 'jobs', id);
      
      const jobDoc = await getDoc(jobRef);
      if (!jobDoc.exists()) {
        throw new Error(`Job with id ${id} not found`);
      }
      
      await updateDoc(jobRef, jobData);
      
      const updatedDoc = await getDoc(jobRef);
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      } as LaundryJob;
      
    } catch (error) {
      console.error(`Firebase error updating job ${id}:`, error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to update job: ${message}`);
    }
  },

  async deleteJob(id: string): Promise<void> {
    try {
      console.log(`Deleting job with id: ${id}`);
      
      const jobRef = doc(db, 'jobs', id);
      
      const jobDoc = await getDoc(jobRef);
      if (!jobDoc.exists()) {
        throw new Error(`Job with id ${id} not found`);
      }
      
      await deleteDoc(jobRef);
      
      console.log(`Job ${id} deleted successfully`);
      
    } catch (error) {
      console.error(`Firebase error deleting job ${id}:`, error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to delete job: ${message}`);
    }
  }
};