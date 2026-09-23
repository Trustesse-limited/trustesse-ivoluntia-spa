"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import BackButton from "@/components/BackButton";
import { api } from "@/lib/api";
import { ProgramItem } from "@/types";
import { ProgramApiResponse, UpdateProgramRequest } from "@/types/api";
import toast from "react-hot-toast";

export default function EditProgramPage() {
  const router = useRouter();
  const { id } = useParams();
  const [program, setProgram] = useState<ProgramItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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
    goals: '',
    skills: '',
  });

  useEffect(() => {
    const fetchProgram = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const response = await api.programs.getById(Array.isArray(id) ? id[0] : id);
        
        if (response.success && response.data) {
          const programData = response.data as ProgramApiResponse;
          const mappedProgram: ProgramItem = {
            id: programData.id || (Array.isArray(id) ? id[0] : id),
            title: programData.title || programData.name || '',
            startDate: programData.startDate || '',
            endDate: programData.endDate || '',
            location: programData.location || programData.city || '',
            donationTarget: programData.donationTarget || programData.targetAmount || 0,
            raised: programData.raised || programData.raisedAmount || 0,
            category: programData.category || programData.foundationCategory || '',
            goals: programData.goals || '',
            description: programData.description || programData.mission || '',
            image: programData.image || programData.logo || '',
            volunteers: programData.volunteers || 0,
            status: programData.status || 'Active',
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
            donationTarget: mappedProgram.donationTarget,
            bannerImage: mappedProgram.image || '',
            goals: mappedProgram.goals,
            skills: '',
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

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.startDate || !formData.endDate) {
      toast.error('Please fill in all required fields');
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
        bannerImage: formData.bannerImage,
      };

      const response = await api.programs.update(updateRequest);
      
      if (response.success) {
        toast.success(isDraft ? 'Program saved as draft' : 'Program updated successfully');
        router.push(`/org/programs/${id}`);
      } else {
        toast.error('Failed to update program');
      }
    } catch (error) {
      console.error('Error updating program:', error);
      toast.error('Failed to update program');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-gray-400 text-lg">Loading program details...</div>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Program Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The program you&apos;re looking for doesn&apos;t exist.
          </p>
          <BackButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center justify-start gap-4 mb-4">
            <BackButton />
            <h1 className="text-2xl font-bold text-gray-900">Edit Program</h1>
          </div>
          <p className="text-lg text-black mt-1">Program Details</p>
        </header>

        {/* Form */}
        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-12">
          {/* Section 1: Title, Description, Banner */}
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
                  placeholder="Community Tree Planting Drive 2025"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
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
                  rows={5}
                  placeholder="Join us in planting 1,000 trees..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Banner Image
                </label>
                <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                  <p>Image upload component</p>
                </div>
              </div>
            </div>

            {/* Section 2: Dates, Location, Category */}
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
                    className="mt-2 w-full rounded-lg border text-gray-600 border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="mt-2 w-full text-gray-600 rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs  text-gray-600 mt-1">
                    Dates cannot be changed for Active, Completed or Forfeited
                    programs.
                  </p>
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
                  placeholder="Garki, Abuja, Nigeria"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
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
                  className="mt-2 w-full rounded-lg border text-gray-600 border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  <option value="community">Community Development</option>
                  <option value="education">Education</option>
                  <option value="health">Health</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="donationTarget"
                  className="block text-sm font-medium text-black"
                >
                  Donation Target (Optional)
                </label>
                <input
                  id="donationTarget"
                  name="donationTarget"
                  type="number"
                  placeholder="2,000,000.00"
                  value={formData.donationTarget || ''}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Goals & Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label
                htmlFor="goals"
                className="block text-sm font-medium text-black"
              >
                Goals (Optional)
              </label>
              <textarea
                id="goals"
                name="goals"
                rows={4}
                placeholder="- Plant 1,000 Trees..."
                value={formData.goals}
                onChange={handleInputChange}
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
              />
            </div>

            <div>
              <label
                htmlFor="skills"
                className="block text-sm font-medium text-black"
              >
                Skills Required (Optional)
              </label>
              <input
                id="skills"
                name="skills"
                type="text"
                placeholder="Tree planting, workshop facilitation..."
                value={formData.skills}
                onChange={handleInputChange}
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Section 4: Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="text-black font-medium hover:underline"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isSaving}
              className="px-5 py-2 rounded-lg font-semibold text-black"
              style={{ backgroundColor: "#42A5F566" }}
            >
              {isSaving ? 'Saving...' : 'Save as Draft'}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-lg font-semibold text-white"
              style={{ backgroundColor: "#0E68DC" }}
            >
              {isSaving ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
