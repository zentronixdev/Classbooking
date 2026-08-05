export interface Registration {
  id: string;
  full_name: string;
  phone_number: string;
  whatsapp_number: string;
  email: string;
  institution_type: string;
  institution_name: string;
  programming_experience: string;
  laptop_available: string;
  workshop_fee: number;
  transaction_id: string;
  payment_screenshot: string;
  payment_status: 'Paid' | 'Pending' | 'Verified' | 'Rejected';
  registration_status: string;
  created_at: string;
}

export interface WorkshopDetails {
  title: string;
  date: string;
  time: string;
  lunchBreak: string;
  fee: number;
  contactNumber: string;
  email: string;
  upiId: string;
  topics: {
    title: string;
    description: string;
    icon: string;
  }[];
}
