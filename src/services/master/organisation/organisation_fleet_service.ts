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
import { UserOrganisation } from '../../main/users/user_organisation_service';
import { MasterVehicle } from 'src/services/main/vehicle/master_vehicle_service';

const URL = 'master/organisation/fleet';

const ENDPOINTS = {
  // OrganisationFleet APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
  cache_child: (organisation_id: string): string => `${URL}/cache_child/${organisation_id}`,
};

// OrganisationFleet Interface
export interface OrganisationFleet extends Record<string, unknown> {
  // Primary Field
  organisation_fleet_id: string;

  // Main Field Details
  fleet_name: string;
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

// OrganisationFleet Create/Update Schema
export const OrganisationFleetSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation

  // Main Field Details
  fleet_name: stringMandatory('Fleet Name', 3, 100),
  description: stringOptional('Description', 0, 300),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type OrganisationFleetDTO = z.infer<typeof OrganisationFleetSchema>;

// OrganisationFleet Query Schema
export const OrganisationFleetQuerySchema = BaseQuerySchema.extend({
  // Self Table
  organisation_fleet_ids: multi_select_optional('OrganisationFleet'), // Multi-selection -> OrganisationFleet

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
});
export type OrganisationFleetQueryDTO = z.infer<
  typeof OrganisationFleetQuerySchema
>;

// Convert OrganisationFleet Data to API Payload
export const toOrganisationFleetPayload = (row: OrganisationFleet): OrganisationFleetDTO => ({
  organisation_id: row.organisation_id || '',

  fleet_name: row.fleet_name || '',
  description: row.description || '',

  status: row.status || Status.Active,
});

// Create New OrganisationFleet Payload
export const newOrganisationFleetPayload = (): OrganisationFleetDTO => ({
  organisation_id: '',

  fleet_name: '',
  description: '',
  
  status: Status.Active,
});

// OrganisationFleet APIs
export const findOrganisationFleets = async (data: OrganisationFleetQueryDTO): Promise<FBR<OrganisationFleet[]>> => {
  return apiPost<FBR<OrganisationFleet[]>, OrganisationFleetQueryDTO>(ENDPOINTS.find, data);
};

export const createOrganisationFleet = async (data: OrganisationFleetDTO): Promise<SBR> => {
  return apiPost<SBR, OrganisationFleetDTO>(ENDPOINTS.create, data);
};

export const updateOrganisationFleet = async (id: string, data: OrganisationFleetDTO): Promise<SBR> => {
  return apiPatch<SBR, OrganisationFleetDTO>(ENDPOINTS.update(id), data);
};

export const deleteOrganisationFleet = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getOrganisationFleetCache = async (organisation_id: string): Promise<FBR<OrganisationFleet[]>> => {
  return apiGet<FBR<OrganisationFleet[]>>(ENDPOINTS.cache(organisation_id));
};

export const getOrganisationFleetCacheCount = async (organisation_id: string): Promise<FBR<OrganisationFleet[]>> => {
  return apiGet<FBR<OrganisationFleet[]>>(ENDPOINTS.cache_count(organisation_id));
};

export const getOrganisationFleetCacheChild = async (organisation_id: string): Promise<FBR<OrganisationFleet[]>> => {
  return apiGet<FBR<OrganisationFleet[]>>(ENDPOINTS.cache_child(organisation_id));
};
