export type LocationType = 
  | 'yacht'
  | 'villa'
  | 'apartment'
  | 'hotel'
  | 'marina_berth'
  | 'warehouse'
  | 'office'
  | 'other';

export type LocationStatus = 'active' | 'inactive' | 'temporary';

export interface ServiceLocation {
  id: string;
  
  // Basic Information
  clientId: string;
  name: string; // e.g., "Yacht Serenity", "Villa Sunset", "Room 305"
  locationType: LocationType;
  status: LocationStatus;
  
  // Address/Location
  address?: {
    street?: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
  };
  
  // Yacht/Marina Specific
  marinaName?: string;
  berthNumber?: string;
  yachtLength?: number; // in meters
  yachtFlag?: string; // Country of registration
  
  // Coordinates (for delivery routing)
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  
  // Access Information
  accessInstructions?: string;
  gateCode?: string;
  parkingInstructions?: string;
  keyLocation?: string;
  
  // Collection/Delivery Details
  preferredCollectionTime?: string;
  preferredDeliveryTime?: string;
  collectionContactId?: string;
  deliveryContactId?: string;
  
  // Additional Information
  numberOfRooms?: number;
  numberOfCrew?: number;
  specialRequirements?: string;
  notes?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  isDefault: boolean;
  lastServiceDate?: string;
}