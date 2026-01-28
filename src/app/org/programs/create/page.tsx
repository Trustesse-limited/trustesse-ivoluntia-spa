"use client";

import ImageUpload from "@/app/org/programs/create/ImageUpload";

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create a Program</h1>
          <p className="text-lg text-gray-600">Program Details</p>
        </div>

        {/* Form */}
        <form className="space-y-8">
          {/* Program Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="program-title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Program Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="program-title"
                  name="program-title"
                  type="text"
                  placeholder="Enter program title"
                  className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Write a short description..."
                  className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
              </div>

              <ImageUpload />
            </div>

            {/* Dates & Category */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="start-date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="start-date"
                    name="start-date"
                    type="date"
                    className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label
                    htmlFor="end-date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="end-date"
                    name="end-date"
                    type="date"
                    className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="Enter location"
                  className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Program Category
                </label>
                <select
                  id="category"
                  name="category"
                  className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                >
                  <option value="">Select Category</option>
                  <option value="education">Education</option>
                  <option value="health">Health</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="donation"
                  className="block text-sm font-medium text-gray-700"
                >
                  Donation Target (optional)
                </label>
                <input
                  id="donation"
                  name="donation"
                  type="number"
                  placeholder="Enter donation target"
                  className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
              </div>
            </div>
          </div>

          {/* Goals & Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label
                htmlFor="goals"
                className="block text-sm font-medium text-gray-700"
              >
                Goals (optional)
              </label>
              <input
                id="goals"
                name="goals"
                type="text"
                placeholder="Enter program goals"
                className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
              <button
                type="button"
                className="mt-3 inline-flex items-center rounded-md bg-blue-500 px-4 py-2 text-white shadow hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
              >
                Add Goal
              </button>
            </div>

            <div>
              <label
                htmlFor="skills"
                className="block text-sm font-medium text-gray-700"
              >
                Skills Required (optional)
              </label>
              <input
                id="skills"
                name="skills"
                type="text"
                placeholder="Enter required skills"
                className="mt-2 w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>
          </div>

          
            {/* Action Buttons */}
            <div className="flex justify-end flex-wrap sm:flex-nowrap gap-4 px-6 mt-10">
              {/* Cancel */}
              <button
                type="button"
                className="text-gray-700 font-medium hover:underline"
              >
                Cancel
              </button>

              {/* Save as Draft */}
              <button
                type="button"
                className="px-5 py-2 rounded-md font-semibold text-black"
                style={{ backgroundColor: "#42A5F566" }}
              >
                Save as Draft
              </button>

              {/* Publish */}
              <button
                type="submit"
                className="px-5 py-2 rounded-md font-semibold text-white"
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
