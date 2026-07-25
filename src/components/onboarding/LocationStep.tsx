'use client';

import { useOnboardingStore } from '@/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LocationStep() {
  const { formData, updateFormData } = useOnboardingStore();

  const handleInputChange = (field: string, value: string) => {
    updateFormData({
      locationDto: {
        ...formData.locationDto,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="address" className="block text-sm font-medium mb-2">
            Street Address
          </Label>
          <Input
            id="address"
            placeholder="123 Main Street"
            value={formData.locationDto?.address || ''}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="city" className="block text-sm font-medium mb-2">
            City
          </Label>
          <Input
            id="city"
            placeholder="New York"
            value={formData.locationDto?.city || ''}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="stateId" className="block text-sm font-medium mb-2">
              State
            </Label>
            <Input
              id="stateId"
              placeholder="NY"
              value={formData.locationDto?.stateId || ''}
              onChange={(e) => handleInputChange('stateId', e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="zipCode" className="block text-sm font-medium mb-2">
              ZIP Code
            </Label>
            <Input
              id="zipCode"
              placeholder="10001"
              value={formData.locationDto?.zipCode || ''}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="countryId" className="block text-sm font-medium mb-2">
            Country
          </Label>
          <Input
            id="countryId"
            placeholder="United States"
            value={formData.locationDto?.countryId || ''}
            onChange={(e) => handleInputChange('countryId', e.target.value)}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
