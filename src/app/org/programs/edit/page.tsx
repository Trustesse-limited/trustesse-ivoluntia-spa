"use client";

import { useState } from "react";
import ImageUpload from "@/app/org/programs/create/ImageUpload";

export default function EditProgramPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Edit Program</h1>
          <p className="text-lg text-gray-600 mt-1">Program Details</p>
        </header>

        {/* Form */}
        <form className="space-y-12">
          {/* Section 1: Title, Description, Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Program Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Community Tree Planting Drive 2025"
                  className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  rows={5}
                  placeholder="Join us in planting 1,000 trees..."
                  className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image
                </label>
                <ImageUpload />
              </div>
            </div>

            {/* Section 2: Dates, Location, Category */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Dates cannot be changed for Active, Completed or Forfeited
                    programs.
                  </p>
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
                  placeholder="Garki, Abuja, Nigeria"
                  className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="block text-sm font-medium text-gray-700"
                >
                  Donation Target (Optional)
                </label>
                <input
                  id="donationTarget"
                  name="donationTarget"
                  type="number"
                  placeholder="2,000,000.00"
                  className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Goals & Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label
                htmlFor="goals"
                className="block text-sm font-medium text-gray-700"
              >
                Goals (Optional)
              </label>
              <textarea
                id="goals"
                name="goals"
                rows={4}
                placeholder="- Plant 1,000 Trees..."
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="skills"
                className="block text-sm font-medium text-gray-700"
              >
                Skills Required (Optional)
              </label>
              <input
                id="skills"
                name="skills"
                type="text"
                placeholder="Tree planting, workshop facilitation..."
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Section 4: Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-8">
            <button
              type="button"
              className="text-gray-700 font-medium hover:underline"
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
