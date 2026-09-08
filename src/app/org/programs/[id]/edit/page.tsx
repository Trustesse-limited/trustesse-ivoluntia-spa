"use client";

import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

export default function EditProgramPage() {
  const router = useRouter();

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
        <form className="space-y-12">
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
              className="px-5 py-2 rounded-lg font-semibold text-black"
              style={{ backgroundColor: "#42A5F566" }}
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg font-semibold text-white"
              style={{ backgroundColor: "#0E68DC" }}
            >
              Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
