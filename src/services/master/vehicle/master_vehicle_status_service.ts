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

const URL = 'master/vehicle/status';

const ENDPOINTS = {
  // MasterVehicleStatus APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
  cache_child: (organisation_id: string): string => `${URL}/cache_child/${organisation_id}`,
};

// MasterVehicleStatus Interface
export interface MasterVehicleStatus extends Record<string, unknown> {
  // Primary Fields
  vehicle_status_id: string;

  // Main Field Details
  vehicle_status: string;
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

// MasterVehicleStatus Create/Update Schema
export const MasterVehicleStatusSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation

  // Main Field Details
  vehicle_status: stringMandatory('Vehicle Status', 3, 100),
  description: stringOptional('Description', 0, 300),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterVehicleStatusDTO = z.infer<typeof MasterVehicleStatusSchema>;

// MasterVehicleStatus Query Schema
export const MasterVehicleStatusQuerySchema = BaseQuerySchema.extend({
  // Self Table
  vehicle_status_ids: multi_select_optional('MasterVehicleStatus'), // Multi-selection -> MasterVehicleStatus

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
});
export type MasterVehicleStatusQueryDTO = z.infer<
  typeof MasterVehicleStatusQuerySchema
>;

// Convert MasterVehicleStatus Data to API Payload
export const toMasterVehicleStatusPayload = (row: MasterVehicleStatus): MasterVehicleStatusDTO => ({
  organisation_id: row.organisation_id || '',

  vehicle_status: row.vehicle_status || '',
  description: row.description || '',

  status: row.status || Status.Active,
});

// Create New MasterVehicleStatus Payload
export const newMasterVehicleStatusPayload = (): MasterVehicleStatusDTO => ({
  organisation_id: '',

  vehicle_status: '',
  description: '',

  status: Status.Active,
});

// MasterVehicleStatus APIs
export const findMasterVehicleStatus = async (data: MasterVehicleStatusQueryDTO): Promise<FBR<MasterVehicleStatus[]>> => {
  return apiPost<FBR<MasterVehicleStatus[]>, MasterVehicleStatusQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterVehicleStatus = async (data: MasterVehicleStatusDTO): Promise<SBR> => {
  return apiPost<SBR, MasterVehicleStatusDTO>(ENDPOINTS.create, data);
};

export const updateMasterVehicleStatus = async (id: string, data: MasterVehicleStatusDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterVehicleStatusDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterVehicleStatus = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterVehicleStatusCache = async (organisation_id: string): Promise<FBR<MasterVehicleStatus[]>> => {
  return apiGet<FBR<MasterVehicleStatus[]>>(ENDPOINTS.cache(organisation_id));
};

export const getMasterVehicleStatusCacheCount = async (organisation_id: string): Promise<FBR<MasterVehicleStatus>> => {
  return apiGet<FBR<MasterVehicleStatus>>(ENDPOINTS.cache_count(organisation_id));
};

export const getMasterVehicleStatusCacheChild = async (organisation_id: string): Promise<FBR<MasterVehicleStatus[]>> => {
  return apiGet<FBR<MasterVehicleStatus[]>>(ENDPOINTS.cache_child(organisation_id));
};
