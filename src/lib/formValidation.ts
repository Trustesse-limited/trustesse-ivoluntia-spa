/**
 * Form validation utilities for onboarding
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate volunteer bio data form
 */
export function validateBioDataForm(formData: {
  firstName: string;
  lastName: string;
  sex: string;
  dob: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!formData.firstName.trim()) {
    errors.firstName = "First name is required";
  }

  if (!formData.lastName.trim()) {
    errors.lastName = "Last name is required";
  }

  if (!formData.sex) {
    errors.sex = "Sex is required";
  }

  if (!formData.dob) {
    errors.dob = "Date of birth is required";
  } else {
    const selectedDate = new Date(formData.dob);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if date is in the future
    if (selectedDate > today) {
      errors.dob = "Date of birth cannot be in the future";
    } 
    // Check if date is today
    else if (selectedDate.getTime() === today.getTime()) {
      errors.dob = "Date of birth cannot be today";
    } 
    // Check minimum age requirement (12 years)
    else {
      const minAgeDate = new Date();
      minAgeDate.setFullYear(today.getFullYear() - 12);
      
      if (selectedDate > minAgeDate) {
        errors.dob = "You must be at least 12 years old";
      } else {
        // Check maximum age (120 years)
        const maxAgeDate = new Date();
        maxAgeDate.setFullYear(today.getFullYear() - 120);
        
        if (selectedDate < maxAgeDate) {
          errors.dob = "Please enter a valid date of birth";
        }
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate volunteer location form
 */
export function validateLocationForm(formData: {
  address: string;
  city: string;
  zip: string;
  country: string;
  state: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!formData.address.trim()) {
    errors.address = "Address is required";
  }

  if (!formData.city.trim()) {
    errors.city = "City is required";
  }

  if (!formData.zip.trim()) {
    errors.zip = "ZIP code is required";
  }

  if (!formData.country) {
    errors.country = "Country is required";
  }

  if (!formData.state) {
    errors.state = "State is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate organization about form
 */
export function validateOrgAboutForm(formData: {
  name: string;
  category: string;
  website: string;
  mission: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!formData.name.trim()) {
    errors.name = "Organization name is required";
  }

  if (!formData.category.trim()) {
    errors.category = "Category is required";
  }

  if (!formData.website.trim()) {
    errors.website = "Website is required";
  }

  if (!formData.mission.trim()) {
    errors.mission = "Mission is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}