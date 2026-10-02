// Article Types
export interface Article {
  _id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  excerpt?: string;
  downloadLink?: string;
  isPrivate: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// Appointment Types
export interface Appointment {
  _id: string;
  name: string;
  phone: string;
  carModel: string;
  serviceType: string;
  date: string;
  timeSlot: string;
  description?: string;
  trackingCode: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  createdAt: string;
}

// Contact Types
export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'New' | 'Read' | 'Replied';
  createdAt: string;
}

// Service Types
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}
