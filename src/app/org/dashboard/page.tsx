'use client'
import Image from "next/image";
import { SmartImage } from "@/components/SmartImage";
import { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { organizationProjects } from "@/lib/mockData";
import { useAuthStore } from "@/store";
import { useOnboardingStore } from "@/store";


export default function OrgDashboardPage() {
  const { user } = useAuthStore();
  const { organizationData } = useOnboardingStore();

  // Get organization name from onboarding store first, then auth store
  const organizationName = organizationData?.formData?.orgData?.name || user?.organizationName || user?.firstName || 'Organization';

   {/* Mock data for statistics and pie chart */}
  const orgStats = [
  { title: "Total Donations", value: '₦ 10,234,567', icon:"/org/donation.svg" },
  { title: "Total Programs", value: "20", icon:"/org/funds.svg" },
  { title: "Total Volunteers", value: "2,500", icon:"/org/people.svg" },
];

{/* Get the current date in a readable format */}
const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  {/* Mock data for pie chart */}
  const data = [
  { name: "EDUCATION", value: 70, color: "#3B82F6" }, // Blue
  { name: "MEDICAL OUTREACH", value: 15, color: "#22C55E" },   // Green
  { name: "FREE FOOD", value: 15, color: "#EAB308" }, // Yellow
];

const COLORS = ["#3B82F6", "#22C55E", "#EAB308"];

{/* State for active tab */}
  const [activeTab, setActiveTab] = useState("donations");
   
  const  tabs =[
    {"label":"Recent donations", key: "donations" }, 
    {"label":"see all", key: "see-all" }
  ];

  const isViewingAll = activeTab === "see-all";

const projectsToRender = isViewingAll
  ? organizationProjects
  : organizationProjects?.slice(0, 3); // Show only the first 3 projects when not viewing all

  return (
    <div className="px-4 sm:px-6 py-4">
      {/* Header Section with Date and Greeting */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-3 sm:p-4 mb-4 rounded-lg">
        {/* Greeting Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-lg sm:text-xl font-bold text-[#161616] mb-1">Welcome {organizationName},</h2>
          <p className="text-gray-600 text-xs sm:text-sm">See your progress, insights, and recent actions</p>
        </motion.div>

        {/* Current Date Display */}
        <div className="text-xs sm:text-sm text-[#161616] font-semibold mt-2 sm:mt-0">
          {currentDate}
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
        {orgStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-start gap-2 p-2.5 sm:p-3 bg-white shadow-sm rounded-lg"
          >
            <h3 className="text-xs sm:text-sm font-medium text-[#818181]">{stat.title}</h3>
            <h1 className="text-xl sm:text-2xl font-semibold text-[#161616]">{stat.value}</h1>
            <div className="flex justify-end w-full">
              <Image src={stat.icon} alt={stat.title} width={32} height={32} className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[66%_32%] gap-4 mb-4">
        {/* Donations List */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden xl:order-1 order-2 relative">
          <ul className="flex justify-between px-4 sm:px-5 pt-3 sm:pt-4 gap-4 sm:gap-6 border-b border-gray-200">
            {tabs.map((tab) => (
              <li
                key={tab.key}
                className={`pb-3 text-xs sm:text-sm cursor-pointer font-medium transition border-b-2 w-fit ${activeTab === tab.key ? "text-[#0E68DC] border-[#42A5F5]"
                  : "text-black border-transparent hover:text-[#0E68DC]"}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </li>
            ))}
          </ul>

          {projectsToRender?.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No Recent Donations.</p>
          ) : (
            <div className="xl:max-h-96 xl:overflow-y-auto">
              {projectsToRender.map((project, index) => {
                const percentage = project.targetAmount
                  ? (project.raisedAmount / project.targetAmount) * 100
                  : 0;
                const isLast = index === projectsToRender.length - 1;

                return (
                  <div key={project.id} className={`py-3 px-4 sm:px-5 flex flex-col sm:flex-row gap-3 sm:gap-4 ${isLast ? '' : 'border-b border-gray-100'}`}>
                    <SmartImage
                      src={project.image}
                      alt={project.title}
                      width={100}
                      height={70}
                      className="w-full sm:w-25 h-35 sm:h-17.5 rounded-md object-cover"
                      objectFit="cover"
                      fallbackSrc="/placeholder.svg"
                    />

                    <div className="flex flex-col gap-2 flex-1">
                      <h3 className="text-sm sm:text-base font-semibold text-[#161616]">{project.title}</h3>

                      <span className="flex items-center gap-2">
                        <Image
                          src="/org/devicon.svg"
                          alt="icon"
                          width={16}
                          height={16}
                          className="w-4 h-4 object-cover"
                        />
                        <p className="text-xs sm:text-sm text-gray-600">{project.category}</p>
                      </span>

                      <div className="w-full h-1.5 bg-[var(--primary)]/30 rounded-full overflow-hidden mt-1">
                        <motion.div
                          className="h-full bg-[var(--buttonPrimary)] rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                        />
                      </div>

                      <div className="flex justify-between text-xs text-[#161616]">
                        <span className="font-medium">
                          {percentage.toFixed(0)}% Completed
                        </span>

                        <span className="font-medium">
                          ₦{project.raisedAmount.toLocaleString()} /
                          ₦{project.targetAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {/* Scroll indicator shadow for desktop - fixed at bottom */}
          <div className="hidden xl:block absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-white via-white/90 to-transparent pointer-events-none z-10" />
        </div>

        {/* Pie Chart Section */}
        <div className="bg-white shadow-sm rounded-lg p-4 xl:order-2 order-1">
          <h2 className='text-lg sm:text-xl font-bold text-[#073B78] text-center mb-4'>Donations by Program</h2>

          {/* Chart render */}
          <div className="h-48 sm:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  outerRadius={80}
                  innerRadius={40}
                  stroke="none"
                  label={(entry) => entry.name}
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            {data.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No Recent Donations.</p>
            ) : (
              data.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
                      style={{
                        backgroundColor: COLORS[index],
                      }}
                    />
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-900">{item.value}%</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
