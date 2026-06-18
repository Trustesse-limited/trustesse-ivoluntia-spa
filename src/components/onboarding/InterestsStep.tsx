'use client';

import { useState } from 'react';
import { useOnboardingStore } from '@/store';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const COMMON_INTERESTS = [
  'Environment',
  'Education',
  'Healthcare',
  'Animal Welfare',
  'Community Development',
  'Arts & Culture',
  'Sports',
  'Technology',
  'Elderly Care',
  'Youth Development',
  'Disaster Relief',
  'Human Rights',
];

export function InterestsStep() {
  const { formData, updateFormData } = useOnboardingStore();
  const [customInterest, setCustomInterest] = useState('');

  const interests = formData.interest?.names || [];

  const addInterest = (interest: string) => {
    if (interest && !interests.includes(interest)) {
      updateFormData({
        interest: {
          ...formData.interest,
          names: [...interests, interest],
        },
      });
    }
  };

  const removeInterest = (interest: string) => {
    updateFormData({
      interest: {
        ...formData.interest,
        names: interests.filter((i) => i !== interest),
      },
    });
  };

  const handleAddCustomInterest = () => {
    if (customInterest.trim()) {
      addInterest(customInterest.trim());
      setCustomInterest('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="block text-sm font-medium mb-3">
          Select Your Interests
        </Label>
        <div className="flex flex-wrap gap-2">
          {COMMON_INTERESTS.map((interest) => (
            <Button
              key={interest}
              type="button"
              variant={interests.includes(interest) ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                if (interests.includes(interest)) {
                  removeInterest(interest);
                } else {
                  addInterest(interest);
                }
              }}
              className={
                interests.includes(interest)
                  ? 'bg-[#0E68DC] text-white'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }
            >
              {interest}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="customInterest" className="block text-sm font-medium mb-2">
          Add Custom Interest
        </Label>
        <div className="flex gap-2">
          <Input
            id="customInterest"
            placeholder="Type and press Enter or click Add"
            value={customInterest}
            onChange={(e) => setCustomInterest(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustomInterest();
              }
            }}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleAddCustomInterest}
            className="bg-[#0E68DC] hover:bg-[#0E68DC]/90"
          >
            Add
          </Button>
        </div>
      </div>

      {interests.length > 0 && (
        <div>
          <Label className="block text-sm font-medium mb-2">
            Selected Interests ({interests.length})
          </Label>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <div
                key={interest}
                className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {interest}
                <button
                  type="button"
                  onClick={() => removeInterest(interest)}
                  className="ml-1 hover:text-blue-600"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
