'use server';

import { uploadFile as uploadFileServer, volunteerOnboarding as volunteerOnboardingServer, organizationOnboarding as organizationOnboardingServer } from '@/lib/server-api';
import { VolunteerOnboardingRequest, OrganizationOnboardingRequest } from '@/types/api';

/**
 * Server Action for file upload
 * This wraps the server-side uploadFile function to be callable from client components
 */
export async function uploadFile(file: File): Promise<string> {
  return await uploadFileServer(file);
}

/**
 * Server Action for volunteer onboarding
 * This wraps the server-side volunteerOnboarding function to be callable from client components
 */
export async function volunteerOnboarding(data: VolunteerOnboardingRequest): Promise<void> {
  await volunteerOnboardingServer(data);
}

/**
 * Server Action for organization onboarding
 * This wraps the server-side organizationOnboarding function to be callable from client components
 */
export async function organizationOnboarding(data: OrganizationOnboardingRequest): Promise<void> {
  await organizationOnboardingServer(data);
}
