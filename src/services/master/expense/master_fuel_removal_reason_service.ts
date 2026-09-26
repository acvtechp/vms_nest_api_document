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

const URL = 'master/expense/fuel_removal_reason';

const ENDPOINTS = {
  // MasterFuelRemovalReason APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
};

//  MasterFuelRemovalReason Interface
export interface MasterFuelRemovalReason extends Record<string, unknown> {
  // Primary Fields
  fuel_removal_reason_id: string;

  // Main Field Details
  fuel_removal_reason: string;
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
}

// MasterFuelRemovalReason Create/Update Schema
export const MasterFuelRemovalReasonSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation

  // Main Field Details
  fuel_removal_reason: stringMandatory('Fuel Removal Reason', 3, 100),
  description: stringOptional('Description', 0, 300),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterFuelRemovalReasonDTO = z.infer<
  typeof MasterFuelRemovalReasonSchema
>;

// MasterFuelRemovalReason Query Schema
export const MasterFuelRemovalReasonQuerySchema = BaseQuerySchema.extend({
  // Self Table
  fuel_removal_reason_ids: multi_select_optional('MasterFuelRemovalReason'), // Multi-selection -> MasterFuelRemovalReason

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
});
export type MasterFuelRemovalReasonQueryDTO = z.infer<
  typeof MasterFuelRemovalReasonQuerySchema
>;

// Convert MasterFuelRemovalReason Data to API Payload
export const toMasterFuelRemovalReasonPayload = (row: MasterFuelRemovalReason): MasterFuelRemovalReasonDTO => ({
  organisation_id: row.organisation_id || '',

  fuel_removal_reason: row.fuel_removal_reason || '',
  description: row.description || '',

  status: row.status || Status.Active,
});

// Create New MasterFuelRemovalReason Payload
export const newMasterFuelRemovalReasonPayload = (): MasterFuelRemovalReasonDTO => ({
  organisation_id: '',

  fuel_removal_reason: '',
  description: '',
  
  status: Status.Active,
});

// MasterFuelRemovalReason APIs
export const findMasterFuelRemovalReason = async (data: MasterFuelRemovalReasonQueryDTO): Promise<FBR<MasterFuelRemovalReason[]>> => {
  return apiPost<FBR<MasterFuelRemovalReason[]>, MasterFuelRemovalReasonQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterFuelRemovalReason = async (data: MasterFuelRemovalReasonDTO): Promise<SBR> => {
  return apiPost<SBR, MasterFuelRemovalReasonDTO>(ENDPOINTS.create, data);
};

export const updateMasterFuelRemovalReason = async (id: string, data: MasterFuelRemovalReasonDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterFuelRemovalReasonDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterFuelRemovalReason = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterFuelRemovalReasonCache = async (organisation_id: string): Promise<FBR<MasterFuelRemovalReason[]>> => {
  return apiGet<FBR<MasterFuelRemovalReason[]>>(ENDPOINTS.cache(organisation_id));
};

