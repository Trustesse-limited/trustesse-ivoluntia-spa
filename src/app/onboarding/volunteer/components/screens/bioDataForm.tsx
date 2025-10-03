import React from "react";
import { FormProps } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BioDataForm: React.FC<FormProps> = ({ formData, setFormData }) => {
  return (
    <form className="space-y-6 max-w-6xl pb-8 mx-auto">
      <div className="mx-auto w-fit text-center">
        <h2 className="text-2xl font-normal text-[#161616]">Bio Data</h2>
        <p className="text-sm font-normal mt-1 text-[#161616]">
          This information helps us tailor your journey, connect you with the
          right resources, and ensure smooth integration into our community.
        </p>
      </div>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="firstName"
            className="text-[#212121] font-normal text-sm"
          >
            First Name <span className="text-[#EF5350]">*</span>
          </Label>
          <Input
            id="firstName"
            placeholder="First Name"
            className="w-full"
            required
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="lastName"
            className="text-[#212121] font-normal text-sm"
          >
            Last Name <span className="text-[#EF5350]">*</span>
          </Label>
          <Input
            id="lastName"
            className="w-full"
            placeholder="Last Name"
            required
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="otherNames"
            className="text-[#212121] font-normal text-sm"
          >
            Other Names (optional)
          </Label>
          <Input
            id="otherNames"
            className="w-full"
            placeholder="Other Names"
            value={formData.otherNames}
            onChange={(e) =>
              setFormData({ ...formData, otherNames: e.target.value })
            }
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full">
          {/* Sex Field */}
          <div className="flex-1 space-y-2">
            <Label htmlFor="sex" className="text-[#212121] font-normal text-sm">
              Sex <span className="text-[#EF5350]">*</span>
            </Label>
            <Select
              value={formData.sex}
              onValueChange={(value) =>
                setFormData({ ...formData, sex: value })
              }
            >
              <SelectTrigger
                id="sex"
                className="w-full border-[#A0A0A0]"
                size="md"
              >
                <SelectValue placeholder="Select Sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date of Birth Field */}
          <div className="flex-1 space-y-2">
            <Label htmlFor="dob" className="text-[#212121] font-normal text-sm">
              Date of Birth <span className="text-[#EF5350]">*</span>
            </Label>
            <Input
              id="dob"
              type="date"
              value={formData.dob}
              onChange={(e) =>
                setFormData({ ...formData, dob: e.target.value })
              }
              className="w-full placeholder:text-sm"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default BioDataForm;
