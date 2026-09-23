"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/onboarding/components/ImageUpload";
import BackButton from "@/components/BackButton";
import { api } from "@/lib/api";
import { CreateProgramRequest, ProgramGoal } from "@/types/api";
import { useAuthStore } from "@/store";
import toast from "react-hot-toast";

export default function CreatePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    locationId: '',
    location: '',
    category: '',
    donationTarget: 0,
    bannerImage: '',
    goals: [] as ProgramGoal[],
    skills: [] as string[],
  });
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const [goalInput, setGoalInput] = useState('');
  const [skillInput, setSkillInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'donationTarget' ? (value ? Number(value) : 0) : value,
    }));
  };

  const handleAddGoal = () => {
    if (goalInput.trim()) {
      setFormData(prev => ({
        ...prev,
        goals: [...prev.goals, { goal: goalInput.trim() }],
      }));
      setGoalInput('');
    }
  };

  const handleRemoveGoal = (index: number) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index),
    }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput('');
    }
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
      setIsLoading(true);
      
      // Convert file to base64 if present
      let bannerImage = formData.bannerImage;
      if (bannerFile) {
        bannerImage = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(bannerFile);
        });
      }
      
      const createRequest: CreateProgramRequest = {
        title: formData.title,
        description: formData.description,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        locationId: formData.locationId || 'default-location-id',
        foundationId: user?.organizationName || 'default-foundation-id',
        creatorEmail: user?.email || '',
        donationTarget: formData.donationTarget,
        bannerImage: bannerImage as string,
        skillIds: formData.skills,
        programGoals: formData.goals,
      };

      console.log('[Create Program] Request Payload:', createRequest);

      const response = await api.programs.create(createRequest);
      
      console.log('[Create Program] API Response:', response);
      
      if (response.success) {
        toast.success(isDraft ? 'Program saved as draft' : 'Program created successfully');
        router.push('/org/programs');
      } else {
        toast.error('Failed to create program');
      }
    } catch (error) {
      console.error('Error creating program:', error);
      toast.error('Failed to create program');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-start gap-4 mb-4">
            <BackButton />
            <h1 className="text-2xl font-bold text-gray-900">Create a Program</h1>
          </div>
          <p className="text-lg text-black">Program Details</p>
        </div>

        {/* Form */}
        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8">
          {/* Program Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-black"
                >
                  Program Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Enter program title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-black"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Write a short description..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 placeholder:text-gray-400"
                />
              </div>

              <ImageUpload label="Program Image" onChange={(file) => setBannerFile(file)} />
            </div>

            {/* Dates & Category */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-black"
                  >
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-md border text-gray-600 border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-black"
                  >
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-md border text-gray-600 border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-black"
                >
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="Enter location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-black"
                >
                  Program Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-md text-gray-600 border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                >
                  <option value="">Select Category</option>
                  <option value="education">Education</option>
                  <option value="health">Health</option>
                  <option value="community">Community Development</option>
                  <option value="environment">Environment</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="donationTarget"
                  className="block text-sm font-medium text-black"
                >
                  Donation Target (optional)
                </label>
                <input
                  id="donationTarget"
                  name="donationTarget"
                  type="number"
                  placeholder="Enter donation target"
                  value={formData.donationTarget || ''}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Goals & Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label
                htmlFor="goals"
                className="block text-sm font-medium text-black"
              >
                Goals (optional)
              </label>
              <div className="flex gap-2 mt-2">
                <input
                  id="goals"
                  name="goals"
                  type="text"
                  placeholder="Enter program goals"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGoal())}
                  className="flex-1 rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={handleAddGoal}
                  className="mt-3 inline-flex items-center rounded-md bg-blue-500 px-4 py-2 text-white shadow hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
                >
                  Add Goal
                </button>
              </div>
              {formData.goals.length > 0 && (
                <div className="mt-3 space-y-2">
                  {formData.goals.map((goal, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                      <span className="text-sm">{goal.goal}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveGoal(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="skills"
                className="block text-sm font-medium text-black"
              >
                Skills Required (optional)
              </label>
              <div className="flex gap-2 mt-2">
                <input
                  id="skills"
                  name="skills"
                  type="text"
                  placeholder="Enter required skills"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  className="flex-1 rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="mt-3 inline-flex items-center rounded-md bg-blue-500 px-4 py-2 text-white shadow hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
                >
                  Add Skill
                </button>
              </div>
              {formData.skills.length > 0 && (
                <div className="mt-3 space-y-2">
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                      <span className="text-sm">{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end flex-wrap sm:flex-nowrap gap-4 px-6 mt-10">
            {/* Cancel */}
            <button
              type="button"
              onClick={() => router.back()}
              className="text-black font-medium hover:underline"
            >
              Cancel
            </button>

            {/* Save as Draft */}
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isLoading}
              className="px-5 py-2 rounded-md font-semibold text-black"
              style={{ backgroundColor: "#42A5F566" }}
            >
              {isLoading ? 'Saving...' : 'Save as Draft'}
            </button>

            {/* Publish */}
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 rounded-md font-semibold text-white"
              style={{ backgroundColor: "#0E68DC" }}
            >
              {isLoading ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
