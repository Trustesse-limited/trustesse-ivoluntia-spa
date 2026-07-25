import React from "react";
import { OrganizationFormProps } from "@/types";
import { Label } from "@/components/ui/label";

const Disclaimer: React.FC<OrganizationFormProps> = ({ formData, setFormData }) => {
  return (
    <form className="space-y-6 max-w-6xl pb-20 mx-auto">
      <div className="mx-auto w-fit text-center">
        <h2 className="text-2xl font-normal text-[#161616]">Disclaimer</h2>
        <p className="text-sm font-normal mt-1 text-[#161616]">
          {`We encourage you to take time to review this disclaimer. By registering, your organization agrees to;`}
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <ul className="space-y-3 list-disc list-inside text-sm text-[#212121]">
          <li className="font-semibold">
            Manage donations transparently and use funds solely for declared causes.
          </li>
          <li className="font-semibold">
            Stick to their original causes as stated during account registration on iVoluntia platform.
          </li>
          <li className="font-semibold">
            Ensure that all causes, information shared, including donation-related content, is accurate and lawful.
          </li>
          <li className="font-semibold">
            Comply with all applicable laws and ethical standards governing volunteer and donation activities in the country.
          </li>
          <li className="font-semibold">
            Acknowledge that iVoluntia platform is a connecting platform and is not liable for any disputes, losses, or misconduct arising from volunteer or donation engagements. Misuse of the platform may lead to suspension or removal
          </li>
        </ul>

        <div className="flex items-center gap-2 pt-4">
          <input
            type="checkbox"
            id="disclaimerAgreed"
            checked={formData.disclaimerAgreed}
            onChange={(e) =>
              setFormData({ ...formData, disclaimerAgreed: e.target.checked })
            }
            className="w-4 h-4 text-[#0E68DC] border-[#A0A0A0] focus:ring-[#0E68DC] rounded"
          />
          <Label
            htmlFor="disclaimerAgreed"
            className="text-[#212121] font-normal text-sm cursor-pointer"
          >
            {`I've read and agree to the disclaimer`}
          </Label>
        </div>
      </div>
    </form>
  );
};

export default Disclaimer;
