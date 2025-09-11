import React from "react";
import { Label } from "@/components/ui/label";
import ImageUpload from "../../../components/ImageUpload";
import { VolunteerFormData } from "@/types"; // adjust path as needed

interface ProfileFormProps {
  formData: VolunteerFormData;
  setFormData: React.Dispatch<React.SetStateAction<VolunteerFormData>>;
}


const SetupProfileForm: React.FC<ProfileFormProps> = ({
  formData,
  setFormData,
}) => {
  return (
    <form className="space-y-6 max-w-6xl mx-auto pb-20">
      <div className="mx-auto w-fit text-center">
        <h2 className="text-2xl font-semibold text-[#161616">
          Setup your profile{" "}
          <span className="font-bold text-[#818181] text-base">(Optional)</span>
        </h2>
        <p className="text-sm font-normal mt-1 text-[#161616]">
          Upload a photo and write a short bio so we can introduce you to causes
          and opportunities that fit your personality and passion.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <ImageUpload
          onChange={(file) => setFormData({ ...formData, photo: file })}
        />

        <div className="space-y-2">
          <Label htmlFor="bio" className="text-[#424242] font-medium text-sm">
            Bio
          </Label>
          <textarea
            id="bio"
            placeholder="Not more than 100 words"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full border rounded-md py-3 px-5 placeholder:text-sm"
            rows={4}
            maxLength={800}
          />
        </div>
      </div>
    </form>
  );
};

export default SetupProfileForm;
