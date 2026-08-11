'use client';

import { useOnboardingStore } from '@/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { sanitizeText, sanitizeUrl } from '@/lib/sanitize';

export function ProfileStep() {
  const { formData, updateFormData } = useOnboardingStore();

  const handleInputChange = (field: string, value: string) => {
    updateFormData({
      profileAndBioData: {
        ...formData.profileAndBioData,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="bio" className="block text-sm font-medium mb-2">
            Bio
          </Label>
          <Textarea
            id="bio"
            placeholder="Tell us about yourself and why you want to volunteer..."
            value={formData.profileAndBioData?.bio || ''}
            onChange={(e) => handleInputChange('bio', sanitizeText(e.target.value, 500))}
            className="w-full min-h-[120px]"
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.profileAndBioData?.bio?.length || 0}/500 characters
          </p>
        </div>

        <div>
          <Label htmlFor="profileImageurl" className="block text-sm font-medium mb-2">
            Profile Image URL (Optional)
          </Label>
          <Input
            id="profileImageurl"
            type="url"
            placeholder="https://example.com/your-image.jpg"
            value={formData.profileAndBioData?.profileImageurl || ''}
            onChange={(e) => handleInputChange('profileImageurl', sanitizeUrl(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Review Your Information</h3>
        <p className="text-sm text-blue-800">
          Please review all the information you&apos;ve provided before submitting.
          You can go back to previous steps to make changes if needed.
        </p>
      </div>
    </div>
  );
}
