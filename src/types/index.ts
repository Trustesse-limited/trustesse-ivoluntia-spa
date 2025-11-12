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
};
