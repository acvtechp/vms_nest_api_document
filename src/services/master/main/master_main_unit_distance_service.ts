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

const URL = 'master/main/unit_distance';

const ENDPOINTS = {
  // MasterMainUnitDistance APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: `${URL}/cache`,
};

// MasterMainUnitDistance Interface
export interface MasterMainUnitDistance extends Record<string, unknown> {
  // Primary Fields
  distance_unit_id: string;

  // Main Field Details
  distance_unit_name: string;
  distance_unit_code: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Child
  // Child - User
  UserOrganisation?: UserOrganisation[]

  // Relations - Child Count
  _count?: {
    UserOrganisation?: number;
  };
}

// MasterMainUnitDistance Create/Update Schema
export const MasterMainUnitDistanceSchema = z.object({
  // Main Field Details
  distance_unit_name: stringMandatory('Distance Unit Name', 1, 50),
  distance_unit_code: stringMandatory('Distance Unit Code', 1, 10),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterMainUnitDistanceDTO = z.infer<
  typeof MasterMainUnitDistanceSchema
>;

// MasterMainUnitDistance Query Schema
export const MasterMainUnitDistanceQuerySchema = BaseQuerySchema.extend({
  // Self Table
  distance_unit_ids: multi_select_optional('MasterMainUnitDistance'), // Multi-selection -> MasterMainUnitDistance
});
export type MasterMainUnitDistanceQueryDTO = z.infer<
  typeof MasterMainUnitDistanceQuerySchema
>;

// Convert MasterMainUnitDistance Data to API Payload
export const toMasterMainUnitDistancePayload = (row: MasterMainUnitDistance): MasterMainUnitDistanceDTO => ({
  distance_unit_name: row.distance_unit_name || '',
  distance_unit_code: row.distance_unit_code || '',

  status: row.status || Status.Active,
});

// Create New MasterMainUnitDistance Payload
export const newMasterMainUnitDistancePayload = (): MasterMainUnitDistanceDTO => ({
  distance_unit_name: '',
  distance_unit_code: '',

  status: Status.Active,
});

// MasterMainUnitDistance APIs
export const findMasterMainUnitDistances = async (data: MasterMainUnitDistanceQueryDTO): Promise<FBR<MasterMainUnitDistance[]>> => {
  return apiPost<FBR<MasterMainUnitDistance[]>, MasterMainUnitDistanceQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterMainUnitDistance = async (data: MasterMainUnitDistanceDTO): Promise<SBR> => {
  return apiPost<SBR, MasterMainUnitDistanceDTO>(ENDPOINTS.create, data);
};

export const updateMasterMainUnitDistance = async (id: string, data: MasterMainUnitDistanceDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterMainUnitDistanceDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterMainUnitDistance = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterMainUnitDistanceCache = async (): Promise<FBR<MasterMainUnitDistance[]>> => {
  return apiGet<FBR<MasterMainUnitDistance[]>>(ENDPOINTS.cache);
};

