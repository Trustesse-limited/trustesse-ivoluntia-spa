"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import ImageUpload from "@/components/onboarding/components/ImageUpload";
import BackButton from "@/components/BackButton";
import DatePicker from "@/components/DatePicker";
import { FormInput } from "@/components/ui/FormInput";
import { Combobox } from "@/components/ui/Combobox";
import { Switch } from "@/components/ui/switch";
import { NumberInput } from "@/components/ui/FormInput";
import { TextEditor } from "@/components/ui/TextEditor";
import { getProgramByIdAction, updateProgramAction, getCausesAction, getSkillsAction, getQualificationsAction } from "@/app/actions/auth";
import { ProgramItem } from "@/types";
import { ProgramApiResponse, UpdateProgramRequest, Cause, Skill, Qualification, MeetupSchedule } from "@/types/api";
import { useAuthStore } from "@/store";
import { useAuthActions } from "@/hooks/useAuthActions";
import toast from "react-hot-toast";
import logger from "@/lib/logger";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { formatProgramLocation, normalizeProgramStatus } from "@/lib/utils";
import { getCurrencyFromCountry, getCurrencySymbol as getCurrencySymbolFromCode } from "@/constants";

export default function EditProgramPage() {
  const router = useRouter();
  const { id } = useParams();
  const { user, setOrganizationProfile } = useAuthStore();
  const { getFoundationProfile } = useAuthActions();
  const [program, setProgram] = useState<ProgramItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [causes, setCauses] = useState<Cause[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [isLoadingCauses, setIsLoadingCauses] = useState(true);
  const [isLoadingSkills, setIsLoadingSkills] = useState(true);
  const [isLoadingQualifications, setIsLoadingQualifications] = useState(true);
  const [bannerImageUrl, setBannerImageUrl] = useState<string | null>(null);
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
    goals: [] as string[],
    skills: [] as string[],
    requiresMeetup: false,
    meetupSchedules: [] as MeetupSchedule[],
    requiresQualification: false,
    qualificationIds: [] as string[],
  });
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [selectedQualification, setSelectedQualification] = useState('');
  const [meetupDate, setMeetupDate] = useState('');
  const [meetupTime, setMeetupTime] = useState('');

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

  // Fetch causes, skills, and qualifications from the APIs
  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const causesResult = await getCausesAction();
        if (causesResult.success && causesResult.data) {
          setCauses(causesResult.data);
        }
      } catch (error) {
        logger.error('Failed to fetch causes:', error);
      }
      try {
        const skillsResult = await getSkillsAction();
        if (skillsResult.success && skillsResult.data) {
          setSkills(skillsResult.data);
        }
      } catch (error) {
        logger.error('Failed to fetch skills:', error);
      }
      try {
        const qualificationsResult = await getQualificationsAction();
        if (qualificationsResult.success && qualificationsResult.data) {
          setQualifications(qualificationsResult.data);
        }
      } catch (error) {
        logger.error('Failed to fetch qualifications:', error);
      } finally {
        setIsLoadingCauses(false);
        setIsLoadingSkills(false);
        setIsLoadingQualifications(false);
      }
    };
    fetchReferenceData();
  }, []);

  useEffect(() => {
    const fetchProgram = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const response = await getProgramByIdAction(Array.isArray(id) ? id[0] : id);

        if (response.success && response.data) {
          const programData = response.data as ProgramApiResponse;
          const mappedProgram: ProgramItem = {
            id: programData.id || (Array.isArray(id) ? id[0] : id),
            title: programData.title || programData.name || '',
            startDate: programData.startDate || '',
            endDate: programData.endDate || '',
            location: formatProgramLocation(programData.location || programData.city),
            donationTarget: programData.donationTarget || programData.targetAmount || 0,
            raised: programData.raised || programData.raisedAmount || 0,
            category: programData.category || programData.foundationCategory || '',
            goals: programData.goals || '',
            description: programData.description || programData.mission || '',
            image: programData.image || programData.logo || '',
            volunteers: programData.volunteers || 0,
            status: normalizeProgramStatus(programData.status),
            organization: programData.organization || programData.organizationName || '',
            isFavourited: false,
            duration: programData.duration || '',
            targetVolunteers: programData.targetVolunteers || 0,
          };
          setProgram(mappedProgram);
          setFormData({
            title: mappedProgram.title,
            description: mappedProgram.description,
            startDate: mappedProgram.startDate,
            endDate: mappedProgram.endDate,
            locationId: programData.locationId || '',
            location: mappedProgram.location,
            category: mappedProgram.category,
            requiresDonation: mappedProgram.donationTarget > 0,
            donationTarget: mappedProgram.donationTarget,
            bannerImage: mappedProgram.image || '',
            goals: programData.programGoals ? programData.programGoals.map(g => g.goal) : [],
            skills: [] as string[],
            requiresMeetup: programData.requiresMeetup || false,
            meetupSchedules: programData.meetupSchedules || [],
            requiresQualification: programData.requiresQualification || false,
            qualificationIds: programData.qualificationIds || [],
          });
        } else {
          setProgram(null);
        }
      } catch (err) {
        console.error('Error fetching program:', err);
        setProgram(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgram();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'donationTarget' ? (value ? Number(value) : 0) : value,
    }));
  };

  const handleAddSkill = () => {
    if (selectedSkill && !formData.skills.includes(selectedSkill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, selectedSkill],
      }));
      setSelectedSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove),
    }));
  };

  const handleAddGoal = () => {
    if (selectedGoal && !formData.goals.includes(selectedGoal)) {
      setFormData(prev => ({
        ...prev,
        goals: [...prev.goals, selectedGoal],
      }));
      setSelectedGoal('');
    }
  };

  const handleRemoveGoal = (goalToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g !== goalToRemove),
    }));
  };

  const handleAddQualification = () => {
    if (selectedQualification && !formData.qualificationIds.includes(selectedQualification)) {
      setFormData(prev => ({
        ...prev,
        qualificationIds: [...prev.qualificationIds, selectedQualification],
      }));
      setSelectedQualification('');
    }
  };

  const handleRemoveQualification = (qualificationIdToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      qualificationIds: prev.qualificationIds.filter(q => q !== qualificationIdToRemove),
    }));
  };

  const handleAddMeetupSchedule = () => {
    if (meetupDate && meetupTime) {
      setFormData(prev => ({
        ...prev,
        meetupSchedules: [...prev.meetupSchedules, { date: meetupDate, time: meetupTime }],
      }));
      setMeetupDate('');
      setMeetupTime('');
    }
  };

  const handleRemoveMeetupSchedule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      meetupSchedules: prev.meetupSchedules.filter((_, i) => i !== index),
    }));
  };

  // Map selected cause name to cause ID using the causes data from the API
  const getCauseIdByName = (causeName: string): string | null => {
    const cause = causes.find((c) => c.name === causeName);
    return cause?.id || null;
  };

  // Map selected skill names to skill IDs using the skills data from the API
  const getSkillIdsByNames = (skillNames: string[]): string[] => {
    return skillNames
      .map((name) => {
        const skill = skills.find((s) => s.name === name);
        return skill?.id || null;
      })
      .filter((id): id is string => id !== null);
  };

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.startDate || !formData.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Map cause name to cause ID and skill names to skill IDs
    const causeId = getCauseIdByName(formData.category);
    const skillIds = getSkillIdsByNames(formData.skills);

    // Validate required category
    if (!formData.category) {
      toast.error('Please select a program category from the list');
      return;
    }

    try {
      setIsSaving(true);

      const updateRequest: UpdateProgramRequest = {
        id: program?.id || '',
        title: formData.title,
        description: formData.description,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        locationId: formData.locationId || 'default-location-id',
        donationTarget: formData.donationTarget,
        bannerImage: bannerImageUrl || formData.bannerImage,
        requiresMeetup: formData.requiresMeetup,
        meetupSchedules: formData.meetupSchedules,
        requiresQualification: formData.requiresQualification,
        qualificationIds: formData.qualificationIds,
      };

      logger.log('[Edit Program] Request Payload:', updateRequest);

      const response = await updateProgramAction(updateRequest);

      logger.log('[Edit Program] API Response:', response);

      if (response.success) {
        toast.success(isDraft ? 'Program saved as draft' : 'Program updated successfully');
        router.push(`/org/programs/${id}`);
      } else {
        toast.error(response.error || 'Failed to update program');
      }
    } catch (error) {
      console.error('Error updating program:', error);
      toast.error('Failed to update program');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || isLoadingProfile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Program Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The program you&apos;re looking for doesn&apos;t exist.
          </p>
          <BackButton to="/org/programs" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="mx-auto p-4 sm:p-6 lg:p-8 pb-24">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-start gap-4 mb-3">
            <BackButton />
            <h1 className="text-xl font-semibold text-foreground">Edit a Program</h1>
          </div>
          <p className="text-sm text-muted-foreground">Fill in the details to edit your program</p>
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
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Program Goals
                  </label>
                  <div className="flex gap-2">
                    <FormInput
                      placeholder="Enter a program goal"
                      value={selectedGoal}
                      onChange={(e) => setSelectedGoal(e.target.value)}
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleAddGoal}
                      disabled={!selectedGoal}
                      className="px-4 py-2.5 bg-[#0E68DC] text-white rounded-xl text-sm font-medium hover:bg-[#0a55b0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                  </div>
                  {formData.goals.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.goals.map((goal) => (
                        <span
                          key={goal}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#0E68DC]/10 border border-[#0E68DC]/20 text-[#0E68DC] text-xs font-medium"
                        >
                          {goal}
                          <button
                            type="button"
                            onClick={() => handleRemoveGoal(goal)}
                            className="p-1 text-[#0E68DC] hover:bg-[#0E68DC]/20 rounded-full transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
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
                    placeholder="Select program category"
                    value={formData.category}
                    onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    options={causes.map((cause) => ({
                      value: cause.name,
                      label: cause.name,
                    })) || []}
                    disabled={isLoadingCauses}
                    required
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
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Required Skills
                  </label>
                  <div className="flex gap-2">
                    <Combobox
                      placeholder="Select required skill"
                      value={selectedSkill}
                      onChange={setSelectedSkill}
                      options={skills
                        .filter((skill) => !formData.skills.includes(skill.name))
                        .map((skill) => ({
                          value: skill.name,
                          label: skill.name,
                        })) || []}
                      disabled={isLoadingSkills}
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      disabled={!selectedSkill || isLoadingSkills}
                      className="px-4 py-2.5 bg-[#0E68DC] text-white rounded-xl text-sm font-medium hover:bg-[#0a55b0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                  </div>
                  {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#0E68DC]/10 border border-[#0E68DC]/20 text-[#0E68DC] text-xs font-medium"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="p-1 text-[#0E68DC] hover:bg-[#0E68DC]/20 rounded-full transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Meetup & Qualification */}
              <div>
                <h2 className="text-base font-semibold text-foreground mb-4">Meetup & Qualification</h2>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 py-2">
                    <label className="text-sm font-medium text-foreground">
                      Does this program require meetup?
                    </label>
                    <Switch
                      checked={formData.requiresMeetup}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requiresMeetup: checked, meetupSchedules: checked ? prev.meetupSchedules : [] }))}
                    />
                  </div>

                  {formData.requiresMeetup && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Meetup Schedules
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={meetupDate}
                          onChange={(e) => setMeetupDate(e.target.value)}
                          className="flex-1 rounded-lg border border-input p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E68DC]"
                        />
                        <input
                          type="time"
                          value={meetupTime}
                          onChange={(e) => setMeetupTime(e.target.value)}
                          className="flex-1 rounded-lg border border-input p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E68DC]"
                        />
                        <button
                          type="button"
                          onClick={handleAddMeetupSchedule}
                          disabled={!meetupDate || !meetupTime}
                          className="px-4 py-2.5 bg-[#0E68DC] text-white rounded-xl text-sm font-medium hover:bg-[#0a55b0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add
                        </button>
                      </div>
                      {formData.meetupSchedules.length > 0 && (
                        <div className="space-y-2 mt-2">
                          {formData.meetupSchedules.map((schedule, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#0E68DC]/10 border border-[#0E68DC]/20 text-sm"
                            >
                              <span>{schedule.date} at {schedule.time}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveMeetupSchedule(index)}
                                className="text-[#0E68DC] hover:bg-[#0E68DC]/20 rounded-full transition-colors p-1"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-3 py-2">
                    <label className="text-sm font-medium text-foreground">
                      Does this program require qualification?
                    </label>
                    <Switch
                      checked={formData.requiresQualification}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requiresQualification: checked, qualificationIds: checked ? prev.qualificationIds : [] }))}
                    />
                  </div>

                  {formData.requiresQualification && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Required Qualifications
                      </label>
                      <div className="flex gap-2">
                        <Combobox
                          placeholder="Select qualification"
                          value={selectedQualification}
                          onChange={setSelectedQualification}
                          options={qualifications
                            .filter((q) => !formData.qualificationIds.includes(q.id))
                            .map((q) => ({
                              value: q.id,
                              label: q.title,
                            })) || []}
                          disabled={isLoadingQualifications}
                          className="flex-1"
                        />
                        <button
                          type="button"
                          onClick={handleAddQualification}
                          disabled={!selectedQualification || isLoadingQualifications}
                          className="px-4 py-2.5 bg-[#0E68DC] text-white rounded-xl text-sm font-medium hover:bg-[#0a55b0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add
                        </button>
                      </div>
                      {formData.qualificationIds.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.qualificationIds.map((qId) => {
                            const qual = qualifications.find(q => q.id === qId);
                            return (
                              <span
                                key={qId}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#0E68DC]/10 border border-[#0E68DC]/20 text-[#0E68DC] text-xs font-medium"
                              >
                                {qual?.title || qId}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveQualification(qId)}
                                  className="p-1 text-[#0E68DC] hover:bg-[#0E68DC]/20 rounded-full transition-colors"
                                >
                                  ×
                                </button>
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2.5 rounded-lg font-medium text-sm text-foreground hover:bg-muted transition-colors duration-200"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isSaving || isSaving}
              className="px-5 py-2.5 rounded-lg font-medium text-sm text-foreground bg-[#42A5F5]/20 hover:bg-[#42A5F5]/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
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
              disabled={isSaving || isSaving}
              className="px-5 py-2.5 rounded-lg font-medium text-sm text-white bg-[#0E68DC] hover:bg-[#0b5cc4] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
            >
              {isSaving ? (
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
