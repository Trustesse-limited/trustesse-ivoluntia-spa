"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/onboarding/components/ImageUpload";
import BackButton from "@/components/BackButton";
import DatePicker from "@/components/DatePicker";
import { FormInput } from "@/components/ui/FormInput";
import { FormTextarea } from "@/components/ui/FormTextarea";
import { FormSelect } from "@/components/ui/FormSelect";
import { TagInput } from "@/components/ui/TagInput";
import { api } from "@/lib/api";
import { CreateProgramRequest, ProgramGoal } from "@/types/api";
import { useAuthStore } from "@/store";
import toast from "react-hot-toast";
import logger from "@/lib/logger";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function CreatePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    locationId: '',
    location: '',
    category: '',
    donationTarget: 0,
    bannerImage: '',
    goals: [] as ProgramGoal[],
    skills: [] as string[],
  });
  const [bannerImageUrl, setBannerImageUrl] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'donationTarget' ? (value ? Number(value) : 0) : value,
    }));
  };

  const handleAddGoal = (value: string) => {
    setFormData(prev => ({
      ...prev,
      goals: [...prev.goals, { goal: value }],
    }));
  };

  const handleRemoveGoal = (index: number) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index),
    }));
  };

  const handleAddSkill = (value: string) => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, value],
    }));
  };

  const handleRemoveSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.startDate || !formData.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      
      // Use the uploaded image URL if present (uploaded via ImageUpload)
      const bannerImage = bannerImageUrl || formData.bannerImage;
      
      const createRequest: CreateProgramRequest = {
        title: formData.title,
        description: formData.description,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        locationId: formData.locationId || 'default-location-id',
        foundationId: user?.organizationName || 'default-foundation-id',
        creatorEmail: user?.email || '',
        donationTarget: formData.donationTarget,
        bannerImage,
        skillIds: formData.skills,
        programGoals: formData.goals,
      };

      logger.log('[Create Program] Request Payload:', createRequest);

      const response = await api.programs.create(createRequest);
      
      logger.log('[Create Program] API Response:', response);
      
      if (response.success) {
        toast.success(isDraft ? 'Program saved as draft' : 'Program created successfully');
        router.push('/org/programs');
      } else {
        toast.error('Failed to create program');
      }
    } catch (error) {
      console.error('Error creating program:', error);
      toast.error('Failed to create program');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-start gap-4 mb-4">
            <BackButton />
            <h1 className="text-2xl sm:text-3xl  font-bold text-foreground">Create a Program</h1>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground">Fill in the details to create your program</p>
        </div>

        {/* Form */}
        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8">
          {/* Main Content - Two Column on Desktop, One Column on Tablet/Mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Info Card */}
              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground mb-6">Basic Information</h2>
                
                <div className="space-y-5">
                  <FormInput
                    label="Program Title"
                    required
                    placeholder="Enter program title"
                    value={formData.title}
                    onChange={handleInputChange}
                    name="title"
                  />

                  <FormTextarea
                    label="Description"
                    required
                    rows={5}
                    placeholder="Write a detailed description of your program..."
                    value={formData.description}
                    onChange={handleInputChange}
                    name="description"
                  />

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Program Image
                    </label>
                    <ImageUpload label="" onChange={(url) => setBannerImageUrl(url)} />
                  </div>
                </div>
              </div>

              {/* Goals Card */}
              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground mb-4">Program Goals</h2>
                <TagInput
                  label="Program Goals"
                  placeholder="Enter a program goal"
                  values={formData.goals.map(g => g.goal)}
                  onAdd={handleAddGoal}
                  onRemove={handleRemoveGoal}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Dates & Location Card */}
              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground mb-6">Schedule & Location</h2>
                
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DatePicker
                      label="Start Date"
                      required
                      value={formData.startDate}
                      onChange={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                    />
                    <DatePicker
                      label="End Date"
                      required
                      value={formData.endDate}
                      onChange={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                    />
                  </div>

                  <FormInput
                    label="Location"
                    placeholder="Enter program location"
                    value={formData.location}
                    onChange={handleInputChange}
                    name="location"
                  />
                </div>
              </div>

              {/* Category & Target Card */}
              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground mb-6">Category & Target</h2>
                
                <div className="space-y-5">
                  <FormSelect
                    label="Program Category"
                    placeholder="Select Category"
                    value={formData.category}
                    onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    options={[
                      { value: 'education', label: 'Education' },
                      { value: 'health', label: 'Health' },
                      { value: 'community', label: 'Community Development' },
                      { value: 'environment', label: 'Environment' },
                    ]}
                  />

                  <FormInput
                    label="Donation Target"
                    type="number"
                    placeholder="Enter donation target amount"
                    value={formData.donationTarget || ''}
                    onChange={handleInputChange}
                    name="donationTarget"
                  />
                </div>
              </div>

              {/* Skills Card */}
              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground mb-4">Required Skills</h2>
                <TagInput
                  label="Required Skills"
                  placeholder="Enter required skill"
                  values={formData.skills}
                  onAdd={handleAddSkill}
                  onRemove={handleRemoveSkill}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-6 border-t border-border">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 rounded-xl font-medium text-foreground hover:bg-muted transition-colors duration-200"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isLoading}
              className="px-6 py-3 rounded-xl font-semibold text-foreground bg-[#42A5F5]/20 hover:bg-[#42A5F5]/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  Save as Draft
                  <LoadingSpinner size="sm" opacity={0.9} withSpacing={true} />
                </>
              ) : (
                "Save as Draft"
              )}
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-xl font-semibold text-white bg-[#0E68DC] hover:bg-[#0b5cc4] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
            >
              {isLoading ? (
                <>
                  Publish
                  <LoadingSpinner size="sm" opacity={0.9} withSpacing={true} />
                </>
              ) : (
                "Publish"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
