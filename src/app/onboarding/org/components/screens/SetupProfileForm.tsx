import React from "react";
import ImageUpload from "../../../components/ImageUpload";
import { OrganizationFormData } from "@/types"; 

interface LogoFormProps {
  formData: OrganizationFormData;
  setFormData: React.Dispatch<React.SetStateAction<OrganizationFormData>>;
}

const SetupProfileForm: React.FC<LogoFormProps> = ({
  formData,
  setFormData,
}) => {
  return (
    <form className="space-y-6 max-w-6xl mx-auto pb-20">
      <div className="mx-auto w-fit text-center">
        <h2 className="text-2xl font-normal text-[#161616]">
          {`Upload Organization's logo`}{" "}
          <span className="font-normal text-[#818181] text-base">(optional)</span>
        </h2>
        <p className="text-sm font-normal mt-1 text-[#161616]">
          This helps potential volunteers find you based on shared interests and values, making every collaboration more impactful.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <ImageUpload
          label="Organization Logo"
          onChange={(file) => setFormData({ ...formData, logo: file })}
        />
      </div>
    </form>
  );
};

export default SetupProfileForm;
