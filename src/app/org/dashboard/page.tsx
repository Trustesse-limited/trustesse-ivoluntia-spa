'use client'
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { organizationProjects } from "@/lib/mockData";


export default function OrgDashboardPage() {
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
    <div>
      {/* Header Section with Date and Greeting */}
      <div className="flex flex-row items-center justify-between bg-white p-4 mb-4 sm:mb-8">
        {/* Greeting Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-[#161616] mb-2">Welcome Trustesse,</h2>
          <p className="text-gray-600 text-sm sm:text-base">See your progress, insights, and recent actions</p>
        </motion.div>
        
        {/* Current Date Display */}
        <div className="text-xs sm:text-base text-[#161616] font-[700]">
          {currentDate}
        </div>
      </div>

       {/* Statistics Section */}
      <div className="grid px-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6 w-full">
      {orgStats.map((stat, index) => (
        <div key={index} className="flex flex-col items-left gap-5.5 p-4 bg-white  shadow-md ">
          <h1 className="text-sm font-semiBold text-[#818181]" >{stat.title}</h1>
          <h1 className="xl:text-4xl text-3xl font-semibold">{stat.value}</h1>
          <div className="flex justify-end w-full">
          <Image src={stat.icon} alt={stat.title} width={60} height={60} />   
          </div>
        </div>
      ))}
      </div>
      <div className=' grid xl:grid-cols-[66%_32%] gap-6  px-4 mb-6  '>
      
        {/*donations list */}
        <div className="bg-white shadow-md max-h-120 overflow-y-scroll w-full scrollbar-hide pt-3.5">
         <ul className="flex justify-between mx-5 gap-6 border-b whitespace-nowrap border-gray-200  ">
   {tabs.map((tab) => (
    <li
      key={tab.key}
      className={`pb-3 text-[14px] cursor-pointer font-medium transition border-b-2 w-fit ${activeTab === tab.key ? "text-[#0E68DC] border-[#42A5F5]"
                      : "text-black border-transparent hover:text-[#0E68DC]"}`}
        onClick={() => setActiveTab(tab.key)}
   >
      {tab.label}
    </li>
  ))} 
</ul>
     {projectsToRender?.length === 0 ? (
  <p className="text-gray-500 text-center py-4 flex justify-center items-center w-full h-full">No Recent Donations.</p>
) : (
  projectsToRender.map((project) => {
    const percentage = project.targetAmount
      ? (project.raisedAmount / project.targetAmount) * 100
      : 0;

    return (
      <div key={project.id} className="py-4 px-11 flex md:flex-row flex-col gap-6 border-gray-200">
        <Image
          src={project.image}
          alt={project.title}
          width={126}
          height={90}
          className="w-full md:w-[126px] h-[180px] md:h-[90px] object-cover rounded-md mb-4"
        />

        <div className="flex flex-col gap-[4px] md:w-[calc(100%-126px)]">
          <h1 className="text-base font-semibold">{project.title}</h1>

          <span className="flex items-center gap-2">
            <Image
              src="/org/devicon.svg"
              alt="icon"
              width={20}
              height={20}
              className="w-5 h-5 object-cover"
            />
            <p className="text-sm">{project.category}</p>
          </span>

          <div className="w-full h-[7px] bg-[#BFD8F7] rounded-full overflow-hidden mt-3 transition-all duration-1000 ease-out">
            <motion.div
              className="h-full bg-[#052C57] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>

          <div className="flex justify-between text-[12px] text-[#161616] mb-2">
            <span className="font-semibold">
              {percentage}% Completed
            </span>

            <span className="font-semibold">
              ₦{project.raisedAmount.toLocaleString()} /
              ₦{project.targetAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  })
)}
        </div>
        <div className="bg-white shadow-md overflow-y-scroll max-h-auto pt-3.5">
         <h1 className='text-2xl font-bold text-[#073B78] text-center'>Donations by Program</h1>

         {/*chart render */}
          <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              outerRadius={120}
              stroke="none"
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

      <div className="flex flex-col gap-4 my-4 px-8">
        {data.length === 0?(
         <p className="text-gray-500 text-center py-4 flex justify-center items-center w-full h-full">No Recent Donations.</p>
) : 
     (      data.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span
                className="w-6.5 h-6.5 rounded-full"
                style={{
                  backgroundColor: COLORS[index],
                }}
              />

              <span>{item.name}</span>
            </div>

                     </div>
        )))}
      </div>
        </div>
      </div>
    </div>
  );
}
