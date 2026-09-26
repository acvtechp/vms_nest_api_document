// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

//Zod
import { z } from 'zod';
import {
  stringMandatory,
  enumMandatory,
  multi_select_optional,
  single_select_mandatory,
  stringOptional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

//Enums
import { Status } from '../../../core/Enums';

//Other Models
import { UserOrganisation } from '../../main/users/user_organisation_service';

const URL = 'master/expense/expense_item';

const ENDPOINTS = {
  // MasterExpenseItem APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
};

// MasterExpenseItem Interface
export interface MasterExpenseItem extends Record<string, unknown> {
  // Primary Fields
  expense_item_id: string;

  // Main Field Details
  expense_item: string;
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

//  MasterExpenseItem Create/Update Schema
export const MasterExpenseItemSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation

  // Main Field Details
  expense_item: stringMandatory('Expense Item', 3, 100),
  description: stringOptional('Description', 0, 300),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterExpenseItemDTO = z.infer<typeof MasterExpenseItemSchema>;

//  MasterExpenseItem Query Schema
export const MasterExpenseItemQuerySchema = BaseQuerySchema.extend({
  // Self Table
  expense_item_ids: multi_select_optional('MasterExpenseItem'), // Multi-Selection -> MasterExpenseItem

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-Selection -> UserOrganisation
});
export type MasterExpenseItemQueryDTO = z.infer<
  typeof MasterExpenseItemQuerySchema
>;

// Convert MasterExpenseItem Data to API Payload
export const toMasterExpenseItemPayload = (row: MasterExpenseItem): MasterExpenseItemDTO => ({
  organisation_id: row.organisation_id || '',

  expense_item: row.expense_item || '',
  description: row.description || '',

  status: row.status || Status.Active,
});

// Create New MasterExpenseItem Payload
export const newMasterExpenseItemPayload = (): MasterExpenseItemDTO => ({
  organisation_id: '',

  expense_item: '',
  description: '',

  status: Status.Active,
});

// MasterExpenseItem APIs
export const findMasterExpenseItem = async (data: MasterExpenseItemQueryDTO): Promise<FBR<MasterExpenseItem[]>> => {
  return apiPost<FBR<MasterExpenseItem[]>, MasterExpenseItemQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterExpenseItem = async (data: MasterExpenseItemDTO): Promise<SBR> => {
  return apiPost<SBR, MasterExpenseItemDTO>(ENDPOINTS.create, data);
};

export const updateMasterExpenseItem = async (id: string, data: MasterExpenseItemDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterExpenseItemDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterExpenseItem = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterExpenseItemCache = async (organisation_id: string): Promise<FBR<MasterExpenseItem[]>> => {
  return apiGet<FBR<MasterExpenseItem[]>>(ENDPOINTS.cache(organisation_id));
};


