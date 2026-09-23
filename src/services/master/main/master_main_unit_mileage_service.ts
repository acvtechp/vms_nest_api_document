// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  enumMandatory,
  multi_select_optional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../../services/main/users/user_organisation_service';

const URL = 'master/main/unit_mileage';

const ENDPOINTS = {
  // MasterMainUnitMileage APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: `${URL}/cache`,
};

// MasterMainUnitMileage Interface
export interface MasterMainUnitMileage extends Record<string, unknown> {
  // Primary Fields
  mileage_unit_id: string;

  // Main Field Details
  mileage_unit_name: string;
  mileage_unit_code: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Child
  // Child - User
  UserOrganisation?: UserOrganisation[];

  // Relations - Child Count
  _count?: {
    UserOrganisation?: number;
  };
}

// MasterMainUnitMileage Create/Update Schema
export const MasterMainUnitMileageSchema = z.object({
  // Main Field Details
  mileage_unit_name: stringMandatory('Mileage Unit Name', 1, 50),
  mileage_unit_code: stringMandatory('Mileage Unit Code', 1, 10),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterMainUnitMileageDTO = z.infer<
  typeof MasterMainUnitMileageSchema
>;

// MasterMainUnitMileage Query Schema
export const MasterMainUnitMileageQuerySchema = BaseQuerySchema.extend({
  // Self Table
  mileage_unit_ids: multi_select_optional('MasterMainUnitMileage'), // Multi-selection -> MasterMainUnitMileage
});
export type MasterMainUnitMileageQueryDTO = z.infer<
  typeof MasterMainUnitMileageQuerySchema
>;

// Convert MasterMainUnitMileage Data to API Payload
export const toMasterMainUnitMileagePayload = (row: MasterMainUnitMileage): MasterMainUnitMileageDTO => ({
  mileage_unit_name: row.mileage_unit_name || '',
  mileage_unit_code: row.mileage_unit_code || '',

  status: row.status || Status.Active,
});

// Create New MasterMainUnitMileage Payload
export const newMasterMainUnitMileagePayload = (): MasterMainUnitMileageDTO => ({
  mileage_unit_name: '',
  mileage_unit_code: '',

  status: Status.Active,
});

// MasterMainUnitMileage APIs
export const findMasterMainUnitMileages = async (data: MasterMainUnitMileageQueryDTO): Promise<FBR<MasterMainUnitMileage[]>> => {
  return apiPost<FBR<MasterMainUnitMileage[]>, MasterMainUnitMileageQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterMainUnitMileage = async (data: MasterMainUnitMileageDTO): Promise<SBR> => {
  return apiPost<SBR, MasterMainUnitMileageDTO>(ENDPOINTS.create, data);
};

export const updateMasterMainUnitMileage = async (id: string, data: MasterMainUnitMileageDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterMainUnitMileageDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterMainUnitMileage = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterMainUnitMileageCache = async (): Promise<FBR<MasterMainUnitMileage[]>> => {
  return apiGet<FBR<MasterMainUnitMileage[]>>(ENDPOINTS.cache);
};

