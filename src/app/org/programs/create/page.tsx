"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/onboarding/components/ImageUpload";
import BackButton from "@/components/BackButton";
import DatePicker from "@/components/DatePicker";
import { FormInput } from "@/components/ui/FormInput";
import { TagInput } from "@/components/ui/TagInput";
import { Combobox } from "@/components/ui/Combobox";
import { Switch } from "@/components/ui/switch";
import { NumberInput } from "@/components/ui/FormInput";
import { TextEditor } from "@/components/ui/TextEditor";
import { createProgramAction } from "@/app/actions/auth";
import { CreateProgramRequest, ProgramGoal } from "@/types/api";
import { useAuthStore } from "@/store";
import { useAuthActions } from "@/hooks/useAuthActions";
import toast from "react-hot-toast";
import logger from "@/lib/logger";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { getCurrencyFromCountry, getCurrencySymbol as getCurrencySymbolFromCode } from "@/constants";

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
    requiresDonation: false,
    donationTarget: 0,
    bannerImage: '',
    goals: [] as ProgramGoal[],
    skills: [] as string[],
  });
  const [bannerImageUrl, setBannerImageUrl] = useState<string | null>(null);

  // Get currency from organization profile
  const currencySymbol = useMemo(() => {
    const country = user?.organizationProfile?.locations?.[0]?.country ||
                   user?.organizationProfile?.foundationCountry;
    if (country) {
      const currencyCode = getCurrencyFromCountry(country);
      return getCurrencySymbolFromCode(currencyCode);
    }
    return "$"; // Default to USD
  }, [user?.organizationProfile?.locations, user?.organizationProfile?.foundationCountry]);

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

      // Strip HTML tags from description (TextEditor returns HTML)
      const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '');

      const createRequest: CreateProgramRequest = {
        title: formData.title,
        description: stripHtml(formData.description),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        locationId: formData.locationId || 'default-location-id',
        foundationId: user?.foundationId || 'default-foundation-id',
        creatorEmail: user?.email || '',
        donationTarget: formData.requiresDonation ? formData.donationTarget : 0,
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
    <div className="bg-background">
      {isLoadingProfile ? (
        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="mx-auto p-4 sm:p-6 lg:p-8 pb-24">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-start gap-4 mb-3">
              <BackButton />
              <h1 className="text-xl font-semibold text-foreground">Create a Program</h1>
            </div>
            <p className="text-sm text-muted-foreground">Fill in the details to create your program</p>
          </div>

        {/* Form */}
        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
          {/* Main Content - Two Column on Desktop, One Column on Tablet/Mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h2 className="text-base font-semibold text-foreground mb-4">Basic Information</h2>

                <div className="space-y-4">
                  <FormInput
                    label="Program Title"
                    required
                    placeholder="Enter program title"
                    value={formData.title}
                    onChange={handleInputChange}
                    name="title"
                  />

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Description
                    </label>
                    <TextEditor
                      value={formData.description}
                      onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Program Image
                    </label>
                    <ImageUpload
                      label=""
                      onChange={(url) => setBannerImageUrl(url)}
                      previewHeight="h-24"
                      previewWidth="max-w-30"
                      padding="p-4"
                      showLabel={false}
                    />
                  </div>
                </div>
              </div>

              {/* Goals */}
              <div>
                <h2 className="text-base font-semibold text-foreground mb-4">Program Goals</h2>
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
              {/* Dates & Location */}
              <div>
                <h2 className="text-base font-semibold text-foreground mb-4">Schedule & Location</h2>

                <div className="space-y-4">
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

                  <Combobox
                    label="Location"
                    placeholder="Enter or select program location"
                    value={formData.location}
                    onChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
                    options={user?.organizationProfile?.locations?.map((loc) => ({
                      value: `${loc.city}, ${loc.state}, ${loc.country}`,
                      label: `${loc.address}, ${loc.city}, ${loc.state}, ${loc.country}`,
                    })) || []}
                  />
                </div>
              </div>

              {/* Category & Target */}
              <div>
                <h2 className="text-base font-semibold text-foreground mb-4">Category & Target</h2>

                <div className="space-y-4">
                  <Combobox
                    label="Program Category"
                    placeholder="Enter or select program category"
                    value={formData.category}
                    onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    options={user?.organizationProfile?.causes?.map((cause) => ({
                      value: cause,
                      label: cause,
                    })) || []}
                  />

                  <div className="flex items-center gap-3 py-2">
                    <label className="text-sm font-medium text-foreground">
                      Does this program require donation?
                    </label>
                    <Switch
                      checked={formData.requiresDonation}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requiresDonation: checked, donationTarget: checked ? prev.donationTarget : 0 }))}
                    />
                  </div>

                  {formData.requiresDonation && (
                    <NumberInput
                      label={`Donation Target (${currencySymbol})`}
                      placeholder={`Enter donation target amount in ${currencySymbol}`}
                      value={formData.donationTarget || ''}
                      onChange={handleInputChange}
                      name="donationTarget"
                    />
                  )}
                </div>
              </div>

              {/* Skills */}
              <div>
                <h2 className="text-base font-semibold text-foreground mb-4">Required Skills</h2>
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
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2.5 cursor-pointer rounded-lg font-medium text-sm text-foreground hover:bg-muted transition-colors duration-200"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isSavingDraft || isSubmitting}
              className="px-5 py-2.5 rounded-lg cursor-pointer font-medium text-sm text-foreground bg-[#42A5F5]/20 hover:bg-[#42A5F5]/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              className="px-5 py-2.5 cursor-pointer rounded-lg font-medium text-sm text-white bg-[#0E68DC] hover:bg-[#0b5cc4] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
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
