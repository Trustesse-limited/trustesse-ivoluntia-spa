import React from "react";
import { FormProps } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LocationForm: React.FC<FormProps> = ({ formData, setFormData }) => {
  return (
    <form className="space-y-6 max-w-6xl mx-auto">
      <div className="mx-auto w-fit text-center">
        <h2 className="text-2xl font-normal text-[#161616]">Location</h2>
        <p className="text-sm font-normal mt-1 text-[#161616]">
          Let us know where you are so we can connect you with meaningful
          volunteer opportunities in your area.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Country + State */}
        <div className="flex flex-col md:flex-row gap-10 w-full">
          <div className="flex-1 space-y-2">
            <Label
              htmlFor="country"
              className="text-[#212121] font-normal text-sm"
            >
              Country <span className="text-[#EF5350]">*</span>
            </Label>
            <Select
              value={formData.country}
              onValueChange={(value) =>
                setFormData({ ...formData, country: value })
              }
            >
              <SelectTrigger
                id="country"
                className="w-full border-[#A0A0A0]"
                size="md"
              >
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nigeria">Nigeria</SelectItem>
                <SelectItem value="ghana">Ghana</SelectItem>
                <SelectItem value="kenya">Kenya</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 space-y-2">
            <Label
              htmlFor="state"
              className="text-[#212121] font-normal text-sm"
            >
              State <span className="text-[#EF5350]">*</span>
            </Label>
            <Input
              id="state"
              placeholder="State"
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
              className="w-full"
            />
          </div>
        </div>

        {/* City + Zip Code */}
        <div className="flex flex-col md:flex-row gap-10 w-full">
          <div className="flex-1 space-y-2">
            <Label
              htmlFor="city"
              className="text-[#212121] font-normal text-sm"
            >
              City <span className="text-[#EF5350]">*</span>
            </Label>
            <Input
              id="city"
              placeholder="City"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className="w-full"
            />
          </div>

          <div className="flex-1 space-y-2">
            <Label htmlFor="zip" className="text-[#212121] font-normal text-sm">
              Zip Code <span className="text-[#EF5350]">*</span>
            </Label>
            <Input
              id="zip"
              placeholder="Zip Code"
              value={formData.zip}
              onChange={(e) =>
                setFormData({ ...formData, zip: e.target.value })
              }
              className="w-full"
            />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label
            htmlFor="address"
            className="text-[#212121] font-normal text-sm"
          >
            Address (optional)
          </Label>
          <Input
            id="address"
            placeholder="Street Address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className="w-full"
          />
        </div>
      </div>
    </form>
  );
};

export default LocationForm;
