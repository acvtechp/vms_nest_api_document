// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR, BR, AWSPresignedUrl } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  stringOptional,
  single_select_mandatory,
  multi_select_optional,
  enumMandatory,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../main/users/user_organisation_service';
import { MasterVehicle } from '../../main/vehicle/master_vehicle_service';
import { MasterDriver } from 'src/services/main/drivers/master_driver_service';
import { User } from 'src/services/main/users/user_service';

const URL = 'master/organisation/subsidiary';

const ENDPOINTS = {
  // AWS S3 PRESIGNED
  organisation_subsidiary_logo_presigned_url: (fileName: string): string => `${URL}/organisation_subsidiary_logo_presigned_url/${fileName}`,

  // File Uploads
  update_organisation_subsidiary_logo: (id: string): string => `${URL}/update_organisation_subsidiary_logo/${id}`,
  remove_organisation_subsidiary_logo: (id: string): string => `${URL}/remove_organisation_subsidiary_logo/${id}`,

  // OrganisationSubsidiary APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
  cache_child: (organisation_id: string): string => `${URL}/cache_child/${organisation_id}`,
};

// OrganisationSubsidiary Interface
export interface OrganisationSubsidiary extends Record<string, unknown> {
  // Primary Field
  organisation_subsidiary_id: string;

  // Profile Image/Logo
  logo_key?: string;
  logo_url?: string;
  logo_name?: string;

  // Main Field Details
  subsidiary_name: string;
  subsidiary_gstin?: string;
  description: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;
  organisation_name?: string;
  organisation_code?: string;
  organisation_logo_url?: string;

  // Relations - Child
  MasterVehicle?: MasterVehicle[];
  MasterDriver?: MasterDriver[];
  User?: User[];

  // Relations - Child Count
  _count?: {
    MasterVehicle?: number;
    MasterDriver?: number;
    User?: number;
  };
}

// OrganisationSubsidiary Create/Update Schema
export const OrganisationSubsidiarySchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation

  // Profile Image/Logo
  logo_url: stringOptional('Logo URL', 0, 300),
  logo_key: stringOptional('Logo Key', 0, 300),
  logo_name: stringOptional('Logo Name', 0, 300),

  // Main Field Details
  subsidiary_name: stringMandatory('Subsidiary Name', 3, 100),
  subsidiary_gstin: stringOptional('Subsidiary GSTIN', 0, 100),
  description: stringOptional('Description', 0, 300),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type OrganisationSubsidiaryDTO = z.infer<
  typeof OrganisationSubsidiarySchema
>;

// OrganisationSubsidiary Query Schema
export const OrganisationSubsidiaryQuerySchema = BaseQuerySchema.extend({
  // Self Table
  organisation_subsidiary_ids: multi_select_optional('OrganisationSubsidiary'), // Multi-selection -> OrganisationSubsidiary

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
});
export type OrganisationSubsidiaryQueryDTO = z.infer<
  typeof OrganisationSubsidiaryQuerySchema
>;

// OrganisationSubsidiary Logo Schema
export const SubsidiaryLogoSchema = z.object({
  // Profile Image/Logo
  logo_url: stringMandatory('User Image URL', 0, 300),
  logo_key: stringMandatory('User Image Key', 0, 300),
  logo_name: stringMandatory('User Image Name', 0, 300),
});
export type SubsidiaryLogoDTO = z.infer<typeof SubsidiaryLogoSchema>;

// Convert OrganisationSubsidiary Data to API Payload
export const toOrganisationSubsidiaryPayload = (row: OrganisationSubsidiary): OrganisationSubsidiaryDTO => ({
  organisation_id: row.organisation_id || '',

  logo_url: row.logo_url || '',
  logo_key: row.logo_key || '',
  logo_name: row.logo_name || '',

  subsidiary_name: row.subsidiary_name || '',
  subsidiary_gstin: row.subsidiary_gstin || '',
  description: row.description || '',

  status: row.status || Status.Active,
});

// Create New OrganisationSubsidiary Payload
export const newOrganisationSubsidiaryPayload = (): OrganisationSubsidiaryDTO => ({
  organisation_id: '',

  logo_url: '',
  logo_key: '',
  logo_name: '',

  subsidiary_name: '',
  subsidiary_gstin: '',
  description: '',

  status: Status.Active,
});

// AWS S3 PRESIGNED
export const get_organisation_subsidiary_logo_presigned_url = async (fileName: string): Promise<BR<AWSPresignedUrl>> => {
  return apiGet<BR<AWSPresignedUrl>>(ENDPOINTS.organisation_subsidiary_logo_presigned_url(fileName));
};

// File Uploads
export const update_organisation_subsidiary_logo = async (id: string, data: SubsidiaryLogoDTO): Promise<SBR> => {
  return apiPatch<SBR, SubsidiaryLogoDTO>(ENDPOINTS.update_organisation_subsidiary_logo(id), data);
};

export const remove_organisation_subsidiary_logo = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.remove_organisation_subsidiary_logo(id));
};

// OrganisationSubsidiary APIs
export const findOrganisationSubsidiaryies = async (data: OrganisationSubsidiaryQueryDTO): Promise<FBR<OrganisationSubsidiary[]>> => {
  return apiPost<FBR<OrganisationSubsidiary[]>, OrganisationSubsidiaryQueryDTO>(ENDPOINTS.find, data);
};

export const createOrganisationSubsidiary = async (data: OrganisationSubsidiaryDTO): Promise<SBR> => {
  return apiPost<SBR, OrganisationSubsidiaryDTO>(ENDPOINTS.create, data);
};

export const updateOrganisationSubsidiary = async (id: string, data: OrganisationSubsidiaryDTO): Promise<SBR> => {
  return apiPatch<SBR, OrganisationSubsidiaryDTO>(ENDPOINTS.update(id), data);
};

export const deleteOrganisationSubsidiary = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getOrganisationSubsidiaryCache = async (organisation_id: string): Promise<FBR<OrganisationSubsidiary[]>> => {
  return apiGet<FBR<OrganisationSubsidiary[]>>(ENDPOINTS.cache(organisation_id));
};

export const getOrganisationSubsidiaryCacheCount = async (organisation_id: string): Promise<FBR<OrganisationSubsidiary[]>> => {
  return apiGet<FBR<OrganisationSubsidiary[]>>(ENDPOINTS.cache_count(organisation_id));
};

export const getOrganisationSubsidiaryCacheChild = async (organisation_id: string): Promise<FBR<OrganisationSubsidiary[]>> => {
  return apiGet<FBR<OrganisationSubsidiary[]>>(ENDPOINTS.cache_child(organisation_id));
};
