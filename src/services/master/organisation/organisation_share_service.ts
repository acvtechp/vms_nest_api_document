// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  single_select_mandatory,
  multi_select_optional,
  enumMandatory,
  stringOptional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../../services/main/users/user_organisation_service';
import { MasterVehicle } from 'src/services/main/vehicle/master_vehicle_service';

const URL = 'master/organisation/share';

const ENDPOINTS = {
  // OrganisationShare APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
  cache_child: (organisation_id: string): string => `${URL}/cache_child/${organisation_id}`,
};

// OrganisationShare Interface
export interface OrganisationShare extends Record<string, unknown> {
  // Primary Field
  organisation_share_id: string;

  // Main Field Details
  share_name: string;
  description?: string;

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

  // Relations - Child Count
  _count?: {
    MasterVehicle?: number;
  };
}

// OrganisationShare Create/Update Schema
export const OrganisationShareSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation

  // Main Field Details
  share_name: stringMandatory('Share Name', 3, 100),
  description: stringOptional('Description', 0, 300),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type OrganisationShareDTO = z.infer<typeof OrganisationShareSchema>;

// OrganisationShare Query Schema
export const OrganisationShareQuerySchema = BaseQuerySchema.extend({
  // Self Table
  organisation_share_ids: multi_select_optional('OrganisationShare'), // Multi-selection -> OrganisationShare

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
});
export type OrganisationShareQueryDTO = z.infer<
  typeof OrganisationShareQuerySchema
>;

// Convert OrganisationShare Data to API Payload
export const toOrganisationSharePayload = (row: OrganisationShare): OrganisationShareDTO => ({
  organisation_id: row.organisation_id || '',

  share_name: row.share_name || '',
  description: row.description || '',

  status: row.status || Status.Active,
});

// Create New OrganisationShare Payload
export const newOrganisationSharePayload = (): OrganisationShareDTO => ({
  organisation_id: '',

  share_name: '',
  description: '',
  
  status: Status.Active,
});

// OrganisationShare APIs
export const findOrganisationShares = async (data: OrganisationShareQueryDTO): Promise<FBR<OrganisationShare[]>> => {
  return apiPost<FBR<OrganisationShare[]>, OrganisationShareQueryDTO>(ENDPOINTS.find, data);
};

export const createOrganisationShare = async (data: OrganisationShareDTO): Promise<SBR> => {
  return apiPost<SBR, OrganisationShareDTO>(ENDPOINTS.create, data);
};

export const updateOrganisationShare = async (id: string, data: OrganisationShareDTO): Promise<SBR> => {
  return apiPatch<SBR, OrganisationShareDTO>(ENDPOINTS.update(id), data);
};

export const deleteOrganisationShare = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getOrganisationShareCache = async (organisation_id: string): Promise<FBR<OrganisationShare[]>> => {
  return apiGet<FBR<OrganisationShare[]>>(ENDPOINTS.cache(organisation_id));
};

export const getOrganisationShareCacheCount = async (organisation_id: string): Promise<FBR<OrganisationShare[]>> => {
  return apiGet<FBR<OrganisationShare[]>>(ENDPOINTS.cache_count(organisation_id));
};

export const getOrganisationShareCacheChild = async (organisation_id: string): Promise<FBR<OrganisationShare[]>> => {
  return apiGet<FBR<OrganisationShare[]>>(ENDPOINTS.cache_child(organisation_id));
};
