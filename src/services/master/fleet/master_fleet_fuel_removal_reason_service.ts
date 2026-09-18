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
import { MasterVehicle } from '../../main/vehicle/master_vehicle_service';

const URL = 'master/vehicle/fuel_removal_reason';

const ENDPOINTS = {
  // MasterFleetFuelRemovalReason APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
};

//  MasterFleetFuelRemovalReason Interface
export interface MasterFleetFuelRemovalReason extends Record<string, unknown> {
  // Primary Fields
  fleet_fuel_removal_reason_id: string;

  // Main Field Details
  removal_reason: string;
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
}

// MasterFleetFuelRemovalReason Create/Update Schema
export const MasterFleetFuelRemovalReasonSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation

  // Main Field Details
  removal_reason: stringMandatory('Removal Reason', 3, 100),
  description: stringOptional('Description', 0, 300),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterFleetFuelRemovalReasonDTO = z.infer<
  typeof MasterFleetFuelRemovalReasonSchema
>;

// MasterFleetFuelRemovalReason Query Schema
export const MasterFleetFuelRemovalReasonQuerySchema = BaseQuerySchema.extend(
  {
    // Self Table
    fleet_fuel_removal_reason_ids: multi_select_optional(
      'MasterFleetFuelRemovalReason',
    ), // Multi-selection -> MasterFleetFuelRemovalReason

    // Relations - Parent
    organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
  },
);
export type MasterFleetFuelRemovalReasonQueryDTO = z.infer<
  typeof MasterFleetFuelRemovalReasonQuerySchema
>;

// Convert MasterFleetFuelRemovalReason Data to API Payload
export const toMasterFleetFuelRemovalReasonPayload = (row: MasterFleetFuelRemovalReason): MasterFleetFuelRemovalReasonDTO => ({
  organisation_id: row.organisation_id || '',

  removal_reason: row.removal_reason || '',
  description: row.description || '',

  status: row.status || Status.Active,
});

// Create New MasterFleetFuelRemovalReason Payload
export const newMasterFleetFuelRemovalReasonPayload = (): MasterFleetFuelRemovalReasonDTO => ({
  organisation_id: '',

  removal_reason: '',
  description: '',
  
  status: Status.Active,
});

// MasterFleetFuelRemovalReason APIs
export const findMasterFleetFuelRemovalReasons = async (data: MasterFleetFuelRemovalReasonQueryDTO): Promise<FBR<MasterFleetFuelRemovalReason[]>> => {
  return apiPost<FBR<MasterFleetFuelRemovalReason[]>, MasterFleetFuelRemovalReasonQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterFleetFuelRemovalReason = async (data: MasterFleetFuelRemovalReasonDTO): Promise<SBR> => {
  return apiPost<SBR, MasterFleetFuelRemovalReasonDTO>(ENDPOINTS.create, data);
};

export const updateMasterFleetFuelRemovalReason = async (id: string, data: MasterFleetFuelRemovalReasonDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterFleetFuelRemovalReasonDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterFleetFuelRemovalReason = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterFleetFuelRemovalReasonCache = async (organisation_id: string): Promise<FBR<MasterFleetFuelRemovalReason[]>> => {
  return apiGet<FBR<MasterFleetFuelRemovalReason[]>>(ENDPOINTS.cache(organisation_id));
};

