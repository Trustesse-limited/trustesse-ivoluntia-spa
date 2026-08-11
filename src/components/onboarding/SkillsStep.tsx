'use client';

import { useState } from 'react';
import { useOnboardingStore } from '@/store';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { sanitizeName } from '@/lib/sanitize';

const COMMON_SKILLS = [
  'Teaching',
  'Mentoring',
  'Event Planning',
  'Fundraising',
  'Social Media',
  'Writing',
  'Graphic Design',
  'Web Development',
  'First Aid',
  'Language Translation',
  'Project Management',
  'Public Speaking',
];

export function SkillsStep() {
  const { formData, updateFormData } = useOnboardingStore();
  const [customSkill, setCustomSkill] = useState('');

  const skills = formData.skill?.names || [];

  const addSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      updateFormData({
        skill: {
          ...formData.skill,
          names: [...skills, skill],
        },
      });
    }
  };

  const removeSkill = (skill: string) => {
    updateFormData({
      skill: {
        ...formData.skill,
        names: skills.filter((s: string) => s !== skill),
      },
    });
  };

  const handleAddCustomSkill = () => {
    if (customSkill.trim()) {
      addSkill(customSkill.trim());
      setCustomSkill('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="block text-sm font-medium mb-3">
          Select Your Skills
        </Label>
        <div className="flex flex-wrap gap-2">
          {COMMON_SKILLS.map((skill) => (
            <Button
              key={skill}
              type="button"
              variant={skills.includes(skill) ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                if (skills.includes(skill)) {
                  removeSkill(skill);
                } else {
                  addSkill(skill);
                }
              }}
              className={
                skills.includes(skill)
                  ? 'bg-[#0E68DC] text-white'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }
            >
              {skill}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="customSkill" className="block text-sm font-medium mb-2">
          Add Custom Skill
        </Label>
        <div className="flex gap-2">
          <Input
            id="customSkill"
            placeholder="Type and press Enter or click Add"
            value={customSkill}
            onChange={(e) => setCustomSkill(sanitizeName(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustomSkill();
              }
            }}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleAddCustomSkill}
            className="bg-[#0E68DC] hover:bg-[#0E68DC]/90"
          >
            Add
          </Button>
        </div>
      </div>

      {skills.length > 0 && (
        <div>
          <Label className="block text-sm font-medium mb-2">
            Selected Skills ({skills.length})
          </Label>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: string) => (
              <div
                key={skill}
                className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-1 hover:text-green-600"
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
