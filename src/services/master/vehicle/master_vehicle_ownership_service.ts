// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  enumMandatory,
  multi_select_optional,
  single_select_mandatory,
  stringOptional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../main/users/user_organisation_service';
import { MasterVehicle } from 'src/services/main/vehicle/master_vehicle_service';

const URL = 'master/vehicle/ownership';

const ENDPOINTS = {
  // MasterVehicleOwnership APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
  cache_child: (organisation_id: string): string => `${URL}/cache_child/${organisation_id}`,
};

// MasterVehicleOwnership Interface
export interface MasterVehicleOwnership extends Record<string, unknown> {
  // Primary Fields
  vehicle_ownership_id: string;

  // Main Field Details
  vehicle_ownership: string;
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

  // Relations - Child Count
  _count?: {
    MasterVehicle?: number;
  };
}

// MasterVehicleOwnership Create/Update Schema
export const MasterVehicleOwnershipSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation

  // Main Field Details
  vehicle_ownership: stringMandatory('Vehicle Ownership', 3, 100),
  description: stringOptional('Description', 0, 300),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterVehicleOwnershipDTO = z.infer<
  typeof MasterVehicleOwnershipSchema
>;

// MasterVehicleOwnership Query Schema
export const MasterVehicleOwnershipQuerySchema = BaseQuerySchema.extend({
  // Self Table
  vehicle_ownership_ids: multi_select_optional('MasterVehicleOwnership'), // Multi-selection -> MasterVehicleOwnership

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
});
export type MasterVehicleOwnershipQueryDTO = z.infer<
  typeof MasterVehicleOwnershipQuerySchema
>;

// Convert MasterVehicleOwnership Data to API Payload
export const toMasterVehicleOwnershipPayload = (row: MasterVehicleOwnership): MasterVehicleOwnershipDTO => ({
  organisation_id: row.organisation_id || '',

  vehicle_ownership: row.vehicle_ownership || '',
  description: row.description || '',

  status: row.status || Status.Active,
});

// Create New MasterVehicleOwnership Payload
export const newMasterVehicleOwnershipPayload = (): MasterVehicleOwnershipDTO => ({
  organisation_id: '',

  vehicle_ownership: '',
  description: '',

  status: Status.Active,
});

// MasterVehicleOwnership APIs
export const findMasterVehicleOwnership = async (data: MasterVehicleOwnershipQueryDTO): Promise<FBR<MasterVehicleOwnership[]>> => {
  return apiPost<FBR<MasterVehicleOwnership[]>, MasterVehicleOwnershipQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterVehicleOwnership = async (data: MasterVehicleOwnershipDTO): Promise<SBR> => {
  return apiPost<SBR, MasterVehicleOwnershipDTO>(ENDPOINTS.create, data);
};

export const updateMasterVehicleOwnership = async (id: string, data: MasterVehicleOwnershipDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterVehicleOwnershipDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterVehicleOwnership = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterVehicleOwnershipCache = async (organisation_id: string): Promise<FBR<MasterVehicleOwnership[]>> => {
  return apiGet<FBR<MasterVehicleOwnership[]>>(ENDPOINTS.cache(organisation_id));
};

export const getMasterVehicleOwnershipCacheCount = async (organisation_id: string): Promise<FBR<MasterVehicleOwnership>> => {
  return apiGet<FBR<MasterVehicleOwnership>>(ENDPOINTS.cache_count(organisation_id));
};

export const getMasterVehicleOwnershipCacheChild = async (organisation_id: string): Promise<FBR<MasterVehicleOwnership[]>> => {
  return apiGet<FBR<MasterVehicleOwnership[]>>(ENDPOINTS.cache_child(organisation_id));
};

