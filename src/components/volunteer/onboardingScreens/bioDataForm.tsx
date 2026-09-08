import React, { useState, useEffect } from "react";
import { FormProps } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BioDataForm: React.FC<FormProps> = ({ formData, setFormData }) => {
  const [dobError, setDobError] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (formData.dob) {
      const selectedDate = new Date(formData.dob);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Clear error if date is valid
      if (selectedDate < today) {
        setDobError("");
      }
    }
  }, [formData.dob]);

  // Export validation function
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.sex) {
      newErrors.sex = "Sex is required";
    }

    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    } else {
      const selectedDate = new Date(formData.dob);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if date is in the future
      if (selectedDate > today) {
        newErrors.dob = "Date of birth cannot be in the future";
      } 
      // Check if date is today
      else if (selectedDate.getTime() === today.getTime()) {
        newErrors.dob = "Date of birth cannot be today";
      } 
      // Check minimum age requirement (12 years)
      else {
        const minAgeDate = new Date();
        minAgeDate.setFullYear(today.getFullYear() - 12);
        
        if (selectedDate > minAgeDate) {
          newErrors.dob = "You must be at least 12 years old";
        } else {
          // Check maximum age (120 years)
          const maxAgeDate = new Date();
          maxAgeDate.setFullYear(today.getFullYear() - 120);
          
          if (selectedDate < maxAgeDate) {
            newErrors.dob = "Please enter a valid date of birth";
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Expose validate function to parent
  React.useEffect(() => {
    (window as unknown as Record<string, unknown>).validateBioDataForm = validate;
  }, [formData]);

  const validateDOB = (dateString: string): boolean => {
    if (!dateString) {
      setDobError("Date of birth is required");
      return false;
    }

    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if date is in the future
    if (selectedDate > today) {
      setDobError("Date of birth cannot be in the future");
      return false;
    }

    // Check if date is today
    if (selectedDate.getTime() === today.getTime()) {
      setDobError("Date of birth cannot be today");
      return false;
    }

    // Check if user is at least 12 years old
    const minAgeDate = new Date();
    minAgeDate.setFullYear(today.getFullYear() - 12);
    
    if (selectedDate > minAgeDate) {
      setDobError("You must be at least 12 years old");
      return false;
    }

    // Check if user is not older than 120 years (reasonable maximum)
    const maxAgeDate = new Date();
    maxAgeDate.setFullYear(today.getFullYear() - 120);
    
    if (selectedDate < maxAgeDate) {
      setDobError("Please enter a valid date of birth");
      return false;
    }

    setDobError("");
    return true;
  };

  const handleDOBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, dob: value });
    if (value) {
      validateDOB(value);
    }
  };

  return (
    <form className="space-y-6 max-w-6xl pb-8 mx-auto">
      <div className="mx-auto w-fit text-center">
        <h2 className="text-2xl font-normal text-[#161616]">Bio Data</h2>
        <p className="text-sm font-normal mt-1 text-[#161616]">
          This information helps us tailor your journey, connect you with the
          right resources, and ensure smooth integration into our community.
        </p>
      </div>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="firstName"
            className="text-[#212121] font-normal text-sm"
          >
            First Name <span className="text-[#EF5350]">*</span>
          </Label>
          <Input
            id="firstName"
            placeholder="First Name"
            className={`w-full ${errors.firstName ? 'border-red-500' : ''}`}
            required
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="lastName"
            className="text-[#212121] font-normal text-sm"
          >
            Last Name <span className="text-[#EF5350]">*</span>
          </Label>
          <Input
            id="lastName"
            className={`w-full ${errors.lastName ? 'border-red-500' : ''}`}
            required
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="otherNames"
            className="text-[#212121] font-normal text-sm"
          >
            Other Names (optional)
          </Label>
          <Input
            id="otherNames"
            className="w-full"
            placeholder="Other Names"
            value={formData.otherNames}
            onChange={(e) =>
              setFormData({ ...formData, otherNames: e.target.value })
            }
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full">
          {/* Sex Field */}
          <div className="flex-1 space-y-2">
            <Label htmlFor="sex" className="text-[#212121] font-normal text-sm">
              Sex <span className="text-[#EF5350]">*</span>
            </Label>
            <Select
              value={formData.sex}
              onValueChange={(value) =>
                setFormData({ ...formData, sex: value })
              }
            >
              <SelectTrigger
                id="sex"
                className={`w-full border-[#A0A0A0] ${errors.sex ? 'border-red-500' : ''}`}
                size="md"
              >
                <SelectValue placeholder="Select Sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
            {errors.sex && (
              <p className="text-red-500 text-xs mt-1">{errors.sex}</p>
            )}
          </div>

          {/* Date of Birth Field */}
          <div className="flex-1 space-y-2">
            <Label htmlFor="dob" className="text-[#212121] font-normal text-sm">
              Date of Birth <span className="text-[#EF5350]">*</span>
            </Label>
            <Input
              id="dob"
              type="date"
              value={formData.dob}
              onChange={handleDOBChange}
              className={`w-full placeholder:text-sm ${dobError ? 'border-red-500' : ''}`}
            />
            {dobError && (
              <p className="text-red-500 text-xs mt-1">{dobError}</p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default BioDataForm;
