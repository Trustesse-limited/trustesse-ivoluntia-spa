import React from "react";
import { OrganizationFormProps } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { organizationCategories } from "@/lib/mockData";

const AboutOrgForm: React.FC<OrganizationFormProps> = ({ formData, setFormData }) => {
  return (
    <form className="space-y-6 max-w-6xl pb-8 mx-auto">
      <div className="mx-auto w-fit text-center">
        <h2 className="text-2xl font-normal text-[#161616]">
          About your Organization
        </h2>
        <p className="text-sm font-normal mt-1 text-[#161616]">
          This helps volunteers understand your focus areas, values, and how
          they can contribute to your cause
        </p>
      </div>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="text-[#212121] font-normal text-sm"
          >
            Name of Organization
          </Label>
          <Input
            id="name"
            placeholder="Enter Organization's name"
            className="w-full"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="category"
            className="text-[#212121] font-normal text-sm"
          >
            Category of Organization <span className="text-[#EF5350]">*</span>
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger
              id="category"
              className="w-full border-[#A0A0A0]"
              size="md"
            >
              <SelectValue placeholder="select" />
            </SelectTrigger>
            <SelectContent>
              {organizationCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="website"
            className="text-[#212121] font-normal text-sm"
          >
            Website
          </Label>
          <Input
            id="website"
            className="w-full"
            placeholder="Enter Web address"
            value={formData.website}
            onChange={(e) =>
              setFormData({ ...formData, website: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="mission"
            className="text-[#212121] font-normal text-sm"
          >
            Mission <span className="text-[#EF5350]">*</span>
          </Label>
          <textarea
            id="mission"
            placeholder="mission"
            className="w-full border rounded-md py-3 px-5 placeholder:text-sm border-[#A0A0A0]"
            required
            value={formData.mission}
            onChange={(e) =>
              setFormData({ ...formData, mission: e.target.value })
            }
            rows={4}
          />
        </div>
      </div>
    </form>
  );
};

export default AboutOrgForm;
