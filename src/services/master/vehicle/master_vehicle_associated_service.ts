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

const URL = 'master/vehicle/associated';

const ENDPOINTS = {
  // MasterVehicleAssociated APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
  cache_child: (organisation_id: string): string => `${URL}/cache_child/${organisation_id}`,
};

//  MasterVehicleAssociated Interface
export interface MasterVehicleAssociated extends Record<string, unknown> {
  // Primary Fields
  vehicle_associated_id: string;

  // Main Field Details
  vehicle_associated: string;
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

// MasterVehicleAssociated Create/Update Schema
export const MasterVehicleAssociatedSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation

  // Main Field Details
  vehicle_associated: stringMandatory('Vehicle Associated', 3, 100),
  description: stringOptional('Description', 0, 300),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterVehicleAssociatedDTO = z.infer<
  typeof MasterVehicleAssociatedSchema
>;

// MasterVehicleAssociated Query Schema
export const MasterVehicleAssociatedQuerySchema = BaseQuerySchema.extend({
  // Self Table
  vehicle_associated_ids: multi_select_optional('MasterVehicleAssociated'), // Multi-selection -> MasterVehicleAssociated

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
});
export type MasterVehicleAssociatedQueryDTO = z.infer<
  typeof MasterVehicleAssociatedQuerySchema
>;

// Convert MasterVehicleAssociated Data to API Payload
export const toMasterVehicleAssociatedPayload = (row: MasterVehicleAssociated): MasterVehicleAssociatedDTO => ({
  organisation_id: row.organisation_id || '',

  vehicle_associated: row.vehicle_associated || '',
  description: row.description || '',
  
  status: row.status || Status.Active,
});

// Create New MasterVehicleAssociated Payload
export const newMasterVehicleAssociatedPayload = (): MasterVehicleAssociatedDTO => ({
  organisation_id: '',

  vehicle_associated: '',
  description: '',

  status: Status.Active,
});

// MasterVehicleAssociated APIs
export const findMasterVehicleAssociated = async (data: MasterVehicleAssociatedQueryDTO): Promise<FBR<MasterVehicleAssociated[]>> => {
  return apiPost<FBR<MasterVehicleAssociated[]>, MasterVehicleAssociatedQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterVehicleAssociated = async (data: MasterVehicleAssociatedDTO): Promise<SBR> => {
  return apiPost<SBR, MasterVehicleAssociatedDTO>(ENDPOINTS.create, data);
};

export const updateMasterVehicleAssociated = async (id: string, data: MasterVehicleAssociatedDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterVehicleAssociatedDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterVehicleAssociated = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterVehicleAssociatedCache = async (organisation_id: string): Promise<FBR<MasterVehicleAssociated[]>> => {
  return apiGet<FBR<MasterVehicleAssociated[]>>(ENDPOINTS.cache(organisation_id));
};

export const getMasterVehicleAssociatedCacheCount = async (organisation_id: string): Promise<FBR<MasterVehicleAssociated>> => {
  return apiGet<FBR<MasterVehicleAssociated>>(ENDPOINTS.cache_count(organisation_id));
};

export const getMasterVehicleAssociatedCacheChild = async (organisation_id: string): Promise<FBR<MasterVehicleAssociated[]>> => {
  return apiGet<FBR<MasterVehicleAssociated[]>>(ENDPOINTS.cache_child(organisation_id));
};

