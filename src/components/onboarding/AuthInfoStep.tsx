'use client';

import { useOnboardingStore } from '@/store';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export function AuthInfoStep() {
  const { formData, updateFormData } = useOnboardingStore();

  const handleInputChange = (field: string, value: string | boolean) => {
    updateFormData({
      authInfo: {
        ...formData.authInfo,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="email" className="block text-sm font-medium mb-2">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={formData.authInfo?.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="password" className="block text-sm font-medium mb-2">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={formData.authInfo?.password || ''}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={formData.authInfo?.confirmPassword || ''}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="toc"
            checked={formData.authInfo?.hasAcceptedTOC || false}
            onCheckedChange={(checked) => handleInputChange('hasAcceptedTOC', checked as boolean)}
          />
          <Label htmlFor="toc" className="text-sm cursor-pointer">
            I accept the Terms and Conditions
          </Label>
        </div>
      </div>
    </div>
  );
}
