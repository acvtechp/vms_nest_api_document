// Axios
import { apiPost, apiPatch, apiDelete } from '../../core/apiCall';
import { SBR, FBR } from '../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringOptional,
  enumMandatory,
  multi_select_optional,
  single_select_mandatory,
} from '../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../core/Enums';

// Other Models
import { UserOrganisation } from '../main/users/user_organisation_service';
import { User } from '../main/users/user_service';
import { MasterMainFASTagBank } from '../master/main/master_main_fasttag_bank_service';
import { FASTagTransaction } from './fasttag_transactions';

// URL and Endpoints
const URL = 'account/fasttag_details';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// FASTagDetails Interface
export interface FASTagDetails extends Record<string, unknown> {
  // Primary Fields
  fasttag_details_id: string;

  // Main Field Details
  customer_id: string;
  client_id: string; 
  client_secret: string; 
  api_key: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  fasttag_bank_id: string;
  MasterMainFASTagBank?: MasterMainFASTagBank;
  bank_name?: string;
  bank_code?: string;

  organisation_id: string;
  UserOrganisation?: UserOrganisation;
  organisation_name?: string;
  organisation_code?: string;
  organisation_logo_url?: string;

  user_id: string;
  User?: User;
  user_details?: string;
  user_image_url?: string;

    // Relations - Child
  FASTagTransaction?: FASTagTransaction[];

  // Relations - Child Count
  _count?: {
    FASTagTransaction?: number;
  };
}

// FASTagDetails Create/Update Schema
export const FASTagDetailsSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  user_id: single_select_mandatory('User'), // Single-Selection -> User
  fasttag_bank_id: single_select_mandatory('MasterMainFASTagBank'), // Single-Selection -> MasterMainFASTagBank

  // Main Field Details
  customer_id: stringOptional('Customer ID', 0, 100),
  client_id: stringOptional('Client ID', 0, 100),
  client_secret: stringOptional('Client Secret', 0, 100),
  api_key: stringOptional('Api Key', 0, 500),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type FASTagDetailsDTO = z.infer<typeof FASTagDetailsSchema>;

// FASTagDetails Query Schema
export const FASTagDetailsQuerySchema = BaseQuerySchema.extend({
  // Self Table
  fasttag_details_ids: multi_select_optional('FASTagDetails'), // Multi-selection -> FASTagDetails

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
  user_ids: multi_select_optional('User'), // Multi-selection -> User
  fasttag_bank_ids: multi_select_optional('MasterMainFASTagBank'), // Multi-selection -> MasterMainFASTagBank
});
export type FASTagDetailsQueryDTO = z.infer<typeof FASTagDetailsQuerySchema>;

// Convert existing data to a payload structure
export const toFASTagDetailsPayload = (row: FASTagDetails): FASTagDetailsDTO => ({
  organisation_id: row.organisation_id,
  user_id: row.user_id,
  fasttag_bank_id: row.fasttag_bank_id,

  customer_id: row.customer_id ?? '',
  client_id: row.client_id ?? '',
  client_secret: row.client_secret ?? '',
  api_key: row.api_key ?? '',

  status: row.status || Status.Active,
});

// Generate a new payload with default values
export const newFASTagDetailsPayload = (): FASTagDetailsDTO => ({
  organisation_id: '',
  user_id: '',
  fasttag_bank_id: '',

  customer_id: '',
  client_id: '',
  client_secret: '',
  api_key: '',

  status: Status.Active
});

// API Methods
export const findFASTagDetails = async (data: FASTagDetailsQueryDTO): Promise<FBR<FASTagDetails[]>> => {
  return apiPost<FBR<FASTagDetails[]>, FASTagDetailsQueryDTO>(ENDPOINTS.find, data);
};

export const createFASTagDetails = async (data: FASTagDetailsDTO): Promise<SBR> => {
  return apiPost<SBR, FASTagDetailsDTO>(ENDPOINTS.create, data);
};

export const updateFASTagDetails = async (id: string, data: FASTagDetailsDTO): Promise<SBR> => {
  return apiPatch<SBR, FASTagDetailsDTO>(ENDPOINTS.update(id), data);
};

export const deleteFASTagDetails = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};
