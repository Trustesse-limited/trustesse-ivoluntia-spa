export interface VolunteerFormData {
  firstName: string;
  lastName: string;
  otherNames: string;
  sex: string;
  dob: string;
  country: string;
  state: string;
  city: string;
  zip: string;
  address: string;
  bio?: string;
  photo?: File | null; 
}

export interface FormProps {
  formData: VolunteerFormData;
  setFormData: React.Dispatch<React.SetStateAction<VolunteerFormData>>;
}

export interface OrganizationFormData {
  name: string;
  category: string;
  website: string;
  mission: string;
  country: string;
  state: string;
  city: string;
  zip: string;
  address: string;
  causes: string[];
  logo?: File | null;
  disclaimerAgreed: boolean;
}

export interface OrganizationFormProps {
  formData: OrganizationFormData;
  setFormData: React.Dispatch<React.SetStateAction<OrganizationFormData>>;
}

export interface ProgramItem {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  donationTarget: number;
  raised: number;
  category: string;
  goals: string;
  description: string;
  image?: string;
  volunteers: number;
  status:string;
};
export interface Volunteer {
  name: string;
  location: string;
  email: string;
  phone: string;
  status: string;
};


export type Donor = {
  name: string;
  email: string;
  amount: number;
  date: string; 
  paymentMethod: string;
  status: string;
  comment: string;
  profilePic: string; 
  location: string;
};
export type Donation = {
  name: string;
  email: string;
  amount: number;
  date: string;
  paymentMethod: string;
  status: string;
  comment: string;
  profilePic: string; 
  location: string;
};
