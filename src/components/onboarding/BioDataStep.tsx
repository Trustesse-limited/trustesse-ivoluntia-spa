'use client';

import { useOnboardingStore } from '@/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sanitizeName } from '@/lib/sanitize';

export function BioDataStep() {
  const { formData, updateFormData } = useOnboardingStore();

  const handleInputChange = (field: string, value: string | number) => {
    updateFormData({
      bioData: {
        ...formData.bioData,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="block text-sm font-medium mb-2">
              First Name
            </Label>
            <Input
              id="firstName"
              placeholder="John"
              value={formData.bioData?.firstName || ''}
              onChange={(e) => handleInputChange('firstName', sanitizeName(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="lastName" className="block text-sm font-medium mb-2">
              Last Name
            </Label>
            <Input
              id="lastName"
              placeholder="Doe"
              value={formData.bioData?.lastName || ''}
              onChange={(e) => handleInputChange('lastName', sanitizeName(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="gender" className="block text-sm font-medium mb-2">
            Gender
          </Label>
          <select
            id="gender"
            value={formData.bioData?.gender || 0}
            onChange={(e) => handleInputChange('gender', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={0}>Select Gender</option>
            <option value={1}>Male</option>
            <option value={2}>Female</option>
            <option value={3}>Other</option>
            <option value={4}>Prefer not to say</option>
          </select>
        </div>

        <div>
          <Label htmlFor="dateOfBirth" className="block text-sm font-medium mb-2">
            Date of Birth
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.bioData?.dateOfBirth || ''}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
