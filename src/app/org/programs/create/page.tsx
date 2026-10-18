"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/onboarding/components/ImageUpload";
import BackButton from "@/components/BackButton";
import DatePicker from "@/components/DatePicker";
import { FormInput } from "@/components/ui/FormInput";
import { FormTextarea } from "@/components/ui/FormTextarea";
import { TagInput } from "@/components/ui/TagInput";
import { createProgramAction } from "@/app/actions/auth";
import { CreateProgramRequest, ProgramGoal } from "@/types/api";
import { useAuthStore } from "@/store";
import { useAuthActions } from "@/hooks/useAuthActions";
import toast from "react-hot-toast";
import logger from "@/lib/logger";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function CreatePage() {
  const router = useRouter();
  const { user, setOrganizationProfile } = useAuthStore();
  const { getFoundationProfile } = useAuthActions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
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

  // Fetch organization profile if not already in store
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.organizationProfile && (user?.accountType === 'Foundation' || user?.accountType === 'Organization')) {
        setIsLoadingProfile(true);
        try {
          const result = await getFoundationProfile();
          if (result.success && result.data) {
            // Create default location from profile address data
            const defaultLocation = {
              address: result.data.address || '',
              city: result.data.city || '',
              state: result.data.foundationState || '',
              country: result.data.foundationCountry || '',
              zipcode: result.data.zipCode || '',
            };

            setOrganizationProfile({
              name: result.data.name,
              email: result.data.email,
              foundationCategory: result.data.foundationCategory,
              website: result.data.website,
              mission: result.data.mission,
              address: result.data.address,
              city: result.data.city,
              zipcode: result.data.zipCode,
              foundationCountry: result.data.foundationCountry,
              foundationState: result.data.foundationState,
              causes: result.data.causes || undefined,
              logoUrl: result.data.logoUrl,
              locations: [defaultLocation],
            });
          }
        } catch (error) {
          logger.error('Failed to fetch organization profile:', error);
        } finally {
          setIsLoadingProfile(false);
        }
      }
    };
    fetchProfile();
  }, [user?.organizationProfile, user?.accountType, getFoundationProfile, setOrganizationProfile]);

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
      if (isDraft) {
        setIsSavingDraft(true);
      } else {
        setIsSubmitting(true);
      }

      // Use the uploaded image URL if present (uploaded via ImageUpload)
      const bannerImage = bannerImageUrl || formData.bannerImage;

      const createRequest: CreateProgramRequest = {
        title: formData.title,
        description: formData.description,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        locationId: formData.locationId || 'default-location-id',
        foundationId: user?.foundationId || 'default-foundation-id',
        creatorEmail: user?.email || '',
        donationTarget: formData.donationTarget,
        bannerImage,
        causeId: formData.category,
        saveAsDraft: isDraft,
        skillIds: formData.skills,
        programGoals: formData.goals,
      };

      logger.log('[Create Program] Request Payload:', createRequest);

      // Programs endpoints must go through server actions: calling the API
      // directly from the browser fails CORS (backend returns a wildcard
      // Access-Control-Allow-Origin, which is invalid with credentialed
      // requests), and the auth token lives in an HTTP-only cookie the
      // browser JS can never attach as an Authorization header.
      const response = await createProgramAction(createRequest);

      logger.log('[Create Program] API Response:', response);

      if (response.success) {
        toast.success(isDraft ? 'Program saved as draft' : 'Program created successfully');
        router.push('/org/programs');
      } else {
        toast.error(response.error || 'Failed to create program');
      }
    } catch (error) {
      console.error('Error creating program:', error);
      toast.error('Failed to create program');
    } finally {
      if (isDraft) {
        setIsSavingDraft(false);
      } else {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {isLoadingProfile ? (
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner />
        </div>
      ) : (
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

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Location
                    </label>
                    <input
                      list="location-options"
                      placeholder="Enter or select program location"
                      value={formData.location}
                      onChange={handleInputChange}
                      name="location"
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base text-foreground focus:border-[#42A5F5] focus:ring-2 focus:ring-[#42A5F5]/20 transition-all duration-200"
                    />
                    <datalist id="location-options">
                      {user?.organizationProfile?.locations?.map((loc, index) => (
                        <option key={index} value={`${loc.city}, ${loc.state}, ${loc.country}`}>
                          {loc.address}, {loc.city}, {loc.state}, {loc.country}
                        </option>
                      ))}
                    </datalist>
                  </div>
                </div>
              </div>

              {/* Category & Target Card */}
              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground mb-6">Category & Target</h2>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Program Category
                    </label>
                    <input
                      list="category-options"
                      placeholder="Enter or select program category"
                      value={formData.category}
                      onChange={handleInputChange}
                      name="category"
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base text-foreground focus:border-[#42A5F5] focus:ring-2 focus:ring-[#42A5F5]/20 transition-all duration-200"
                    />
                    <datalist id="category-options">
                      {user?.organizationProfile?.causes?.map((cause, index) => (
                        <option key={index} value={cause}>
                          {cause}
                        </option>
                      ))}
                    </datalist>
                  </div>

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
              disabled={isSavingDraft || isSubmitting}
              className="px-6 py-3 rounded-xl font-semibold text-foreground bg-[#42A5F5]/20 hover:bg-[#42A5F5]/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSavingDraft ? (
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
              disabled={isSubmitting || isSavingDraft}
              className="px-6 py-3 rounded-xl font-semibold text-white bg-[#0E68DC] hover:bg-[#0b5cc4] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
            >
              {isSubmitting ? (
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
      )}
    </div>
  );
}
