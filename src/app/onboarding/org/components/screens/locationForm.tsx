import React, { useState, useEffect } from "react";
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
import { getCountriesAction, getStatesAction } from "@/app/actions/auth";
import { Country, State } from "@/types/api";

const LocationForm: React.FC<OrganizationFormProps> = ({
  formData,
  setFormData,
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingStates, setIsLoadingStates] = useState(false);

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoadingCountries(true);
      try {
        const result = await getCountriesAction();
        if (result.success && result.data) {
          setCountries(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      } finally {
        setIsLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    const fetchStates = async () => {
      if (!formData.country) {
        setStates([]);
        return;
      }
      
      setIsLoadingStates(true);
      try {
        const result = await getStatesAction(formData.country);
        if (result.success && result.data) {
          setStates(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch states:", error);
      } finally {
        setIsLoadingStates(false);
      }
    };
    fetchStates();
  }, [formData.country]);

  return (
    <form className="space-y-6 pb-16 sm:px-6 md:px-8 max-w-6xl mx-auto">
      <div className="mx-auto w-full text-center">
        <h2 className="text-2xl font-normal text-[#161616]">Location</h2>
        <p className="text-sm font-normal mt-1 text-[#161616]">
          Let us know where your organization is located
        </p>
      </div>

      <div className="max-w-3xl w-full mx-auto space-y-6">
        {/* Country + State */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
          <div className="space-y-2">
            <Label
              htmlFor="country"
              className="text-[#212121] font-normal text-sm"
            >
              Country <span className="text-[#EF5350]">*</span>
            </Label>
            <Select
              value={formData.country}
              onValueChange={(value) =>
                setFormData({ ...formData, country: value, state: "" })
              }
              disabled={isLoadingCountries}
            >
              <SelectTrigger
                id="country"
                className="w-full border-[#A0A0A0]"
                size="md"
              >
                <SelectValue placeholder={isLoadingCountries ? "Loading..." : "Select Country"} />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.id} value={country.id}>
                    <span>{country.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="state"
              className="text-[#212121] font-normal text-sm"
            >
              State <span className="text-[#EF5350]">*</span>
            </Label>
            <Select
              value={formData.state}
              onValueChange={(value) =>
                setFormData({ ...formData, state: value })
              }
              disabled={isLoadingStates || !formData.country}
            >
              <SelectTrigger
                id="state"
                className="w-full border-[#A0A0A0]"
                size="md"
              >
                <SelectValue placeholder={isLoadingStates ? "Loading..." : "Select State"} />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.id} value={state.id}>
                    <span>{state.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* City + Zip Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
          <div className="space-y-2">
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

          <div className="space-y-2">
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