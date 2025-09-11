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
