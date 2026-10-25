'use client';

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { SmartImage } from "@/components/SmartImage";
import { ErrorState } from "@/components/ErrorState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import Link from "next/link";
import { AppButton } from "@/components/AppButton";
import { FormInput } from "@/components/ui/FormInput";
import { FormField } from "@/components/ui/FormField";
import { useAuthStore } from "@/store";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useActiveTab } from "@/hooks/useActiveTab";
import { createLocationAction, getCountriesAction, getStatesAction, getQualificationsAction, createQualificationAction, updateQualificationAction, deleteQualificationAction } from "@/app/actions/auth";
import type { FoundationProfile, CreateLocationRequest, Country, State, Qualification, CreateQualificationRequest } from "@/types/api";
import {
  FiBriefcase,
  FiUsers,
  FiCalendar,
  FiHeart,
  FiShield,
  FiBell,
  FiEdit2,
  FiAlertCircle
} from "react-icons/fi";

const SETTINGS_TAB_IDS = ['profile', 'causes', 'locations', 'qualifications', 'settings'] as const;
type SettingsTab = (typeof SETTINGS_TAB_IDS)[number];

const SETTINGS_TABS: { id: SettingsTab; label: string }[] = [
  { id: 'profile', label: 'Profile Information' },
  { id: 'causes', label: 'Causes' },
  { id: 'locations', label: 'Locations' },
  { id: 'qualifications', label: 'Qualifications' },
  { id: 'settings', label: 'Account Settings' },
];

export default function OrganizationSettings() {
  const { user, setOrganizationProfile } = useAuthStore();
  const { getFoundationProfile } = useAuthActions();
  // Active tab is persisted in the URL (?tab=...) so it survives refresh
  const [activeTab, setActiveTab] = useActiveTab<SettingsTab>('profile', SETTINGS_TAB_IDS);
  const [profileData, setProfileData] = useState<FoundationProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const [accountSettings, setAccountSettings] = useState({
    twoFactorAuth: true,
    emailNotifications: true,
    pushNotifications: false,
  });

  const [showAddLocation, setShowAddLocation] = useState(false);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [locations, setLocations] = useState<CreateLocationRequest[]>([]);
  const [newLocation, setNewLocation] = useState<CreateLocationRequest>({
    address: '',
    city: '',
    state: '',
    country: '',
    zipcode: '',
  });
  const [selectedCountryId, setSelectedCountryId] = useState('');
  const [selectedStateId, setSelectedStateId] = useState('');
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingStates, setIsLoadingStates] = useState(false);

  // Qualifications state
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [isLoadingQualifications, setIsLoadingQualifications] = useState(false);
  const [showAddQualification, setShowAddQualification] = useState(false);
  const [isAddingQualification, setIsAddingQualification] = useState(false);
  const [editingQualification, setEditingQualification] = useState<Qualification | null>(null);
  const [newQualification, setNewQualification] = useState<CreateQualificationRequest>({
    title: '',
    supportingDocumentFormat: '',
    supportingDocumentMaxSize: 0,
    supportingDocumentFileSizeUnit: '',
  });

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoadingCountries(true);
      try {
        const result = await getCountriesAction();
        if (result.success && result.data) {
          setCountries(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch countries:', error);
      } finally {
        setIsLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  // Fetch states when the selected country changes
  useEffect(() => {
    const fetchStates = async () => {
      if (!selectedCountryId) {
        setStates([]);
        return;
      }

      setIsLoadingStates(true);
      try {
        // The API expects the country ID (get-country-states-by-countryid),
        // not the country name
        const result = await getStatesAction(selectedCountryId);
        if (result.success && result.data) {
          setStates(result.data);
        } else {
          setStates([]);
        }
      } catch (error) {
        console.error('Failed to fetch states:', error);
        setStates([]);
      } finally {
        setIsLoadingStates(false);
      }
    };
    fetchStates();
  }, [selectedCountryId]);

  // Fetch qualifications on component mount
  useEffect(() => {
    const fetchQualifications = async () => {
      setIsLoadingQualifications(true);
      try {
        const result = await getQualificationsAction();
        if (result.success && result.data) {
          setQualifications(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch qualifications:', error);
      } finally {
        setIsLoadingQualifications(false);
      }
    };
    fetchQualifications();
  }, []);

  // Initialize default location from profile data
  useEffect(() => {
    if (profileData) {
      const defaultLocation: CreateLocationRequest = {
        address: profileData.address || profileData.foundationAddress || '',
        city: profileData.city || profileData.foundationCity || '',
        state: profileData.foundationState || profileData.stateName || '',
        country: profileData.foundationCountry || profileData.countryName || '',
        zipcode: profileData.zipCode || '',
      };
      setLocations([defaultLocation]);
    }
  }, [profileData]);

  // Match country by name when countries are loaded (for default location)
  useEffect(() => {
    if (locations.length > 0 && countries.length > 0 && locations[0].country) {
      const matchedCountry = countries.find(c => c.name === locations[0].country);
      if (matchedCountry) {
        setSelectedCountryId(matchedCountry.id);
      }
    }
  }, [countries, locations]);

  const handleAddLocation = async () => {
    if (!newLocation.address || !newLocation.city || !newLocation.state || !newLocation.country) {
      alert('Please fill in all required fields');
      return;
    }

    setIsAddingLocation(true);
    try {
      const result = await createLocationAction(newLocation);
      if (result.success) {
        const updatedLocations = [...locations, newLocation];
        setLocations(updatedLocations);
        // Update store with new locations
        setOrganizationProfile({
          ...user?.organizationProfile,
          locations: updatedLocations,
        });
        setNewLocation({
          address: '',
          city: '',
          state: '',
          country: '',
          zipcode: '',
        });
        setSelectedCountryId('');
        setSelectedStateId('');
        setShowAddLocation(false);
      } else {
        alert(result.error || 'Failed to add location');
      }
    } catch (error) {
      console.error('Error adding location:', error);
      alert('Failed to add location');
    } finally {
      setIsAddingLocation(false);
    }
  };

  const handleDeleteLocation = (index: number) => {
    const updatedLocations = locations.filter((_, i) => i !== index);
    setLocations(updatedLocations);
    // Update store with updated locations
    setOrganizationProfile({
      ...user?.organizationProfile,
      locations: updatedLocations,
    });
  };

  const handleAddQualification = async () => {
    if (!newQualification.title || !newQualification.supportingDocumentFormat) {
      alert('Please fill in all required fields');
      return;
    }

    setIsAddingQualification(true);
    try {
      const result = await createQualificationAction(newQualification);
      if (result.success && result.data) {
        setQualifications([...qualifications, result.data]);
        setNewQualification({
          title: '',
          supportingDocumentFormat: '',
          supportingDocumentMaxSize: 0,
          supportingDocumentFileSizeUnit: '',
        });
        setShowAddQualification(false);
      } else {
        alert(result.error || 'Failed to add qualification');
      }
    } catch (error) {
      console.error('Error adding qualification:', error);
      alert('Failed to add qualification');
    } finally {
      setIsAddingQualification(false);
    }
  };

  const handleUpdateQualification = async () => {
    if (!editingQualification || !newQualification.title || !newQualification.supportingDocumentFormat) {
      alert('Please fill in all required fields');
      return;
    }

    setIsAddingQualification(true);
    try {
      const result = await updateQualificationAction(editingQualification.id, newQualification);
      if (result.success && result.data) {
        setQualifications(qualifications.map(q => q.id === editingQualification.id ? result.data! : q));
        setEditingQualification(null);
        setNewQualification({
          title: '',
          supportingDocumentFormat: '',
          supportingDocumentMaxSize: 0,
          supportingDocumentFileSizeUnit: '',
        });
        setShowAddQualification(false);
      } else {
        alert(result.error || 'Failed to update qualification');
      }
    } catch (error) {
      console.error('Error updating qualification:', error);
      alert('Failed to update qualification');
    } finally {
      setIsAddingQualification(false);
    }
  };

  const handleDeleteQualification = async (qualificationId: string) => {
    if (!confirm('Are you sure you want to delete this qualification?')) {
      return;
    }

    try {
      const result = await deleteQualificationAction(qualificationId);
      if (result.success) {
        setQualifications(qualifications.filter(q => q.id !== qualificationId));
      } else {
        alert(result.error || 'Failed to delete qualification');
      }
    } catch (error) {
      console.error('Error deleting qualification:', error);
      alert('Failed to delete qualification');
    }
  };

  const handleEditQualification = (qualification: Qualification) => {
    setEditingQualification(qualification);
    setNewQualification({
      title: qualification.title,
      supportingDocumentFormat: qualification.supportingDocumentFormat,
      supportingDocumentMaxSize: qualification.supportingDocumentMaxSize,
      supportingDocumentFileSizeUnit: qualification.supportingDocumentFileSizeUnit,
    });
    setShowAddQualification(true);
  };

  useEffect(() => {
    if (hasFetched.current) {
      return;
    }

    const fetchProfile = async () => {
      hasFetched.current = true;
      setIsLoading(true);
      setError(null);
      try {
        const result = await getFoundationProfile();
        if (result.success && result.data) {
          setProfileData(result.data);
        } else {
          setError(result.error || 'Failed to fetch profile');
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error('Failed to fetch foundation profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [getFoundationProfile]);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <ErrorState
          message={error}
          onRetry={() => {
            hasFetched.current = false;
            setError(null);
            const fetchProfile = async () => {
              hasFetched.current = true;
              setIsLoading(true);
              setError(null);
              try {
                const result = await getFoundationProfile();
                if (result.success && result.data) {
                  setProfileData(result.data);
                } else {
                  setError(result.error || 'Failed to fetch profile');
                }
              } catch (err) {
                setError('An unexpected error occurred');
                console.error('Failed to fetch foundation profile:', err);
              } finally {
                setIsLoading(false);
              }
            };
            fetchProfile();
          }}
          icon={<FiAlertCircle className="text-4xl" />}
        />
      </div>
    );
  }

  const profile = {
    name: profileData?.name || profileData?.foundationName || user?.organizationName || 'Organization',
    email: profileData?.email || user?.email || '',
    location: profileData?.city && profileData?.foundationState
      ? `${profileData.city}, ${profileData.foundationState}`
      : user?.location || 'Not specified',
    memberSince: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'January 2024',
    mission: profileData?.mission || 'No mission provided',
    category: profileData?.category || profileData?.foundationCategory || 'Not specified',
    website: profileData?.website || 'Not specified',
    address: profileData?.foundationAddress || profileData?.address || 'Not specified',
    causes: profileData?.causes || profileData?.causeNames || [],
    logo: profileData?.logoUrl || profileData?.logo || user?.logo || '',
  };

  const stats = [
    { label: "Programs Created", value: 8, icon: FiCalendar },
    { label: "Volunteers Joined", value: 156, icon: FiUsers },
    { label: "Total Hours", value: "1,245h", icon: FiHeart },
    { label: "Active Causes", value: profile.causes.length, icon: FiBriefcase }
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8"
    >
      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-black">Settings</h1>
        <Link href="/org/settings/edit" className="flex items-center gap-2 px-4 py-2 bg-white border border-[#D9D9D9] rounded-lg text-[#0C59BB] hover:bg-gray-50 transition">
          <FiEdit2 className="text-lg" />
          <span className="font-medium text-black">Edit Profile</span>
        </Link>
      </div>

      {/* Profile Header Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-(--buttonPrimary) rounded-2xl p-6 sm:p-8 text-white"
      >
        <div className="flex flex-col lg:flex-row items-center lg:items-center gap-6">
          {/* Profile Image */}
          <div className="relative">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-200 overflow-hidden border-4 border-white/20">
              {profile.logo ? (
                <SmartImage
                  src={profile.logo}
                  alt="Organization Logo"
                  fill
                  sizes="128px"
                  objectFit="cover"
                  fallbackSrc="/illustrations/profile-illustration.svg"
                />
              ) : (
                <Image
                  src="/illustrations/profile-illustration.svg"
                  alt="Organization Logo"
                  width={128}
                  height={128}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-black">{profile.name}</h1>
            <p className="text-black text-sm sm:text-base max-w-2xl">{profile.mission}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="text-black text-sm sm:text-base mb-3">{stat.label}</div>
            <div className="flex items-center gap-3">
              <stat.icon className="text-2xl text-[#0E68DC]" />
              <div className="text-black font-bold text-2xl sm:text-3xl">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Tabs Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        {/* Tab Headers */}
        <div className="border-b border-gray-200">
          <div className="flex flex-wrap">
            {SETTINGS_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 sm:px-6 py-4 text-sm sm:text-base font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-[#0E68DC] border-b-2 border-[#0E68DC]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8">
          {/* Profile Information Tab */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FiBriefcase className="text-gray-400" />
                    <span className="text-black">{profile.name}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FiEdit2 className="text-gray-400" />
                    <span className="text-black">{profile.email}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FiBriefcase className="text-gray-400" />
                    <span className="text-black">{profile.category}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FiEdit2 className="text-gray-400" />
                    <span className="text-black">{profile.website}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FiUsers className="text-gray-400" />
                    <span className="text-black">{profile.location}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FiCalendar className="text-gray-400" />
                    <span className="text-black">{profile.memberSince}</span>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FiBriefcase className="text-gray-400" />
                    <span className="text-black">{profile.address}</span>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mission</label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-black">{profile.mission}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Causes Tab */}
          {activeTab === 'causes' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex flex-wrap gap-3">
                {profile.causes.map((cause: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full"
                  >
                    <span className="text-black">{cause}</span>
                  </div>
                ))}
                {profile.causes.length === 0 && (
                  <p className="text-gray-600">No causes added yet</p>
                )}
              </div>
            </motion.div>
          )}

          {/* Locations Tab */}
          {activeTab === 'locations' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Organization Locations</h3>
                <AppButton
                  text="Add Location"
                  onClick={() => setShowAddLocation(true)}
                  className="py-2! px-4! text-sm!"
                />
              </div>

              {showAddLocation && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border border-blue-100 shadow-sm"
                >
                  <h4 className="text-lg font-semibold text-gray-900 mb-6">Add New Location</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <FormInput
                      label="Address"
                      value={newLocation.address}
                      onChange={(e) => setNewLocation(prev => ({...prev, address: e.target.value}))}
                      placeholder="Enter address"
                    />
                    <FormInput
                      label="City"
                      value={newLocation.city}
                      onChange={(e) => setNewLocation(prev => ({...prev, city: e.target.value}))}
                      placeholder="Enter city"
                    />
                    <FormField label="Country">
                      <div className="relative">
                        <select
                          value={newLocation.country}
                          onChange={(e) => {
                            const value = e.target.value;
                            setNewLocation(prev => ({...prev, country: value, state: ''}));
                            setSelectedStateId('');
                          }}
                          disabled={isLoadingCountries}
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 focus:ring-2 focus:ring-[#42A5F5]/20 focus:border-[#42A5F5] transition-all duration-200 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">{isLoadingCountries ? 'Loading countries...' : 'Select country'}</option>
                          {countries.map((country) => (
                            <option key={country.name} value={country.name}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </FormField>
                    <FormField label="State">
                      <div className="relative">
                        <select
                          value={selectedStateId}
                          onChange={(e) => {
                            const value = e.target.value;
                            setSelectedStateId(value);
                            const state = states.find(s => s.name === value);
                            setNewLocation(prev => ({...prev, state: state?.name || ''}));
                          }}
                          disabled={isLoadingStates || !selectedCountryId}
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 focus:ring-2 focus:ring-[#42A5F5]/20 focus:border-[#42A5F5] transition-all duration-200 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">{isLoadingStates ? 'Loading states...' : !selectedCountryId ? 'Select country first' : states.length === 0 ? 'No states available' : 'Select state'}</option>
                          {states.map((state) => (
                            <option key={state.name} value={state.name}>
                              {state.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </FormField>
                    <FormInput
                      label="Zip Code"
                      value={newLocation.zipcode}
                      onChange={(e) => setNewLocation(prev => ({...prev, zipcode: e.target.value}))}
                      placeholder="Enter zip code"
                    />
                  </div>
                  <div className="flex gap-3 justify-end pt-6">
                    <AppButton
                      text="Cancel"
                      onClick={() => setShowAddLocation(false)}
                      variant="custom"
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2! px-6! text-sm! rounded-2xl!"
                    />
                    <AppButton
                      text={isAddingLocation ? 'Adding...' : 'Add Location'}
                      onClick={handleAddLocation}
                      isLoading={isAddingLocation}
                      className="py-2! px-6! text-sm!"
                    />
                  </div>
                </motion.div>
              )}

              <div className="space-y-4">
                {locations.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="text-gray-400 text-lg mb-2">No locations added yet</div>
                    <div className="text-gray-500 text-sm">Click Add Location to create one</div>
                  </div>
                ) : (
                  locations.map((location, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 sm:p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">{location.address}</div>
                        <div className="text-sm text-gray-600">
                          {location.city}, {location.state}, {location.country} {location.zipcode}
                        </div>
                      </div>
                      {index !== 0 && (
                        <AppButton
                          text="Delete"
                          onClick={() => handleDeleteLocation(index)}
                          variant="custom"
                          className="bg-red-50 hover:bg-red-100 text-red-600 py-2! px-4! text-sm! rounded-2xl!"
                        />
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* Qualifications Tab */}
          {activeTab === 'qualifications' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Qualification Types</h3>
                <AppButton
                  text="Add Qualification"
                  onClick={() => {
                    setEditingQualification(null);
                    setNewQualification({
                      title: '',
                      supportingDocumentFormat: '',
                      supportingDocumentMaxSize: 0,
                      supportingDocumentFileSizeUnit: '',
                    });
                    setShowAddQualification(true);
                  }}
                  className="py-2! px-4! text-sm!"
                />
              </div>

              {showAddQualification && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border border-blue-100 shadow-sm"
                >
                  <h4 className="text-lg font-semibold text-gray-900 mb-6">
                    {editingQualification ? 'Edit Qualification' : 'Add New Qualification'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <FormInput
                      label="Title"
                      value={newQualification.title}
                      onChange={(e) => setNewQualification(prev => ({...prev, title: e.target.value}))}
                      placeholder="Enter qualification title"
                    />
                    <FormInput
                      label="Document Format"
                      value={newQualification.supportingDocumentFormat}
                      onChange={(e) => setNewQualification(prev => ({...prev, supportingDocumentFormat: e.target.value}))}
                      placeholder="e.g., PDF, JPG, PNG"
                    />
                    <FormInput
                      label="Max File Size"
                      type="number"
                      value={newQualification.supportingDocumentMaxSize || ''}
                      onChange={(e) => setNewQualification(prev => ({...prev, supportingDocumentMaxSize: Number(e.target.value)}))}
                      placeholder="Enter max file size"
                    />
                    <FormInput
                      label="File Size Unit"
                      value={newQualification.supportingDocumentFileSizeUnit}
                      onChange={(e) => setNewQualification(prev => ({...prev, supportingDocumentFileSizeUnit: e.target.value}))}
                      placeholder="e.g., MB, KB"
                    />
                  </div>
                  <div className="flex gap-3 justify-end pt-6">
                    <AppButton
                      text="Cancel"
                      onClick={() => {
                        setShowAddQualification(false);
                        setEditingQualification(null);
                        setNewQualification({
                          title: '',
                          supportingDocumentFormat: '',
                          supportingDocumentMaxSize: 0,
                          supportingDocumentFileSizeUnit: '',
                        });
                      }}
                      variant="custom"
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2! px-6! text-sm! rounded-2xl!"
                    />
                    <AppButton
                      text={isAddingQualification ? (editingQualification ? 'Updating...' : 'Adding...') : (editingQualification ? 'Update' : 'Add Qualification')}
                      onClick={editingQualification ? handleUpdateQualification : handleAddQualification}
                      isLoading={isAddingQualification}
                      className="py-2! px-6! text-sm!"
                    />
                  </div>
                </motion.div>
              )}

              <div className="space-y-4">
                {isLoadingQualifications ? (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl">
                    <LoadingSpinner size="md" />
                  </div>
                ) : qualifications.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="text-gray-400 text-lg mb-2">No qualifications added yet</div>
                    <div className="text-gray-500 text-sm">Click Add Qualification to create one</div>
                  </div>
                ) : (
                  qualifications.map((qualification) => (
                    <motion.div
                      key={qualification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 sm:p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">{qualification.title}</div>
                        <div className="text-sm text-gray-600">
                          Format: {qualification.supportingDocumentFormat} | Max Size: {qualification.supportingDocumentMaxSize} {qualification.supportingDocumentFileSizeUnit}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <AppButton
                          text="Edit"
                          onClick={() => handleEditQualification(qualification)}
                          variant="custom"
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 py-2! px-4! text-sm! rounded-2xl!"
                        />
                        <AppButton
                          text="Delete"
                          onClick={() => handleDeleteQualification(qualification.id)}
                          variant="custom"
                          className="bg-red-50 hover:bg-red-100 text-red-600 py-2! px-4! text-sm! rounded-2xl!"
                        />
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* Account Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Security Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiShield className="text-[#0E68DC]" />
                  Security
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Two-Factor Authentication</div>
                      <div className="text-sm text-gray-600">Add an extra layer of security</div>
                    </div>
                    <button
                      onClick={() => setAccountSettings(prev => ({...prev, twoFactorAuth: !prev.twoFactorAuth}))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        accountSettings.twoFactorAuth ? 'bg-(--buttonPrimary)' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          accountSettings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Notification Preferences */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiBell className="text-[#0E68DC]" />
                  Notification Preferences
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Email Notifications</div>
                      <div className="text-sm text-gray-600">Receive updates via email</div>
                    </div>
                    <button
                      onClick={() => setAccountSettings(prev => ({...prev, emailNotifications: !prev.emailNotifications}))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        accountSettings.emailNotifications ? 'bg-[#0E68DC]' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          accountSettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Push Notifications</div>
                      <div className="text-sm text-gray-600">Receive push notifications</div>
                    </div>
                    <button
                      onClick={() => setAccountSettings(prev => ({...prev, pushNotifications: !prev.pushNotifications}))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        accountSettings.pushNotifications ? 'bg-[#0E68DC]' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          accountSettings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.section>
  );
}
