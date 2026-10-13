'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuthActions } from '@/hooks/useAuthActions';
import { SmartImage } from '@/components/SmartImage';
import type { FoundationProfile } from '@/types/api';
import { FiLoader } from 'react-icons/fi';

export default function OrganizationSettings() {
  const { getFoundationProfile } = useAuthActions();
  const [profileData, setProfileData] = useState<FoundationProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    // Prevent infinite loop - only fetch once
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
        <FiLoader className="animate-spin text-2xl" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Organization Profile</h2>
        {profileData ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Foundation Name</label>
              <p className="text-gray-900">{profileData.foundationName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-900">{profileData.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <p className="text-gray-900">{profileData.category}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <p className="text-gray-900">{profileData.website}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mission</label>
              <p className="text-gray-900">{profileData.mission}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <p className="text-gray-900">{profileData.address}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <p className="text-gray-900">{profileData.city}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <p className="text-gray-900">{profileData.foundationCountry}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <p className="text-gray-900">{profileData.foundationState}</p>
            </div>
            {profileData.logo && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                <SmartImage
                  src={profileData.logo}
                  alt="Organization Logo"
                  width={128}
                  height={128}
                  className="w-32 h-32 object-cover rounded"
                  objectFit="cover"
                />
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-600">No profile data available</p>
        )}
      </div>
    </div>
  );
}
