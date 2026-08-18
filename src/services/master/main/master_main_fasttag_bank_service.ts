// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  enumMandatory,
  multi_select_optional,
  stringMandatory,
  stringOptional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';
import { FASTagTransaction } from 'src/services/account/fasttag_transactions';
import { FASTagDetails } from 'src/services/account/fasttag_details';

const URL = 'master/main/fasttag_bank';

const ENDPOINTS = {
  // MasterMainFASTagBank APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: `${URL}/cache`,
};

// MasterMainFASTagBank Interface
export interface MasterMainFASTagBank extends Record<string, unknown> {
  // Primary Fields
  fasttag_bank_id: string;

  // Main Field Details
  bank_name: string;
  bank_code?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Child
  FASTagDetails?: FASTagDetails[];
  FASTagTransaction?: FASTagTransaction[];

  // Relations - Child Count
  _count?: {
    FASTagDetails?: number;
    FASTagTransaction?: number;
  };
}

// MasterMainFASTagBank Create/Update Schema
export const MasterMainFASTagBankSchema = z.object({
  // Main Field Details
  bank_name: stringMandatory('Bank Name', 3, 100),
  bank_code: stringOptional('Bank Code', 0, 10),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterMainFASTagBankDTO = z.infer<
  typeof MasterMainFASTagBankSchema
>;

// MasterMainFASTagBank Query Schema
export const MasterMainFASTagBankQuerySchema = BaseQuerySchema.extend({
  // Self Table
  fasttag_bank_ids: multi_select_optional('MasterMainFASTagBank'), // Multi-selection -> MasterMainFASTagBank
});
export type MasterMainFASTagBankQueryDTO = z.infer<
  typeof MasterMainFASTagBankQuerySchema
>;

// Convert MasterMainFasttagBank Data to API Payload
export const toMasterMainFasttagPayload = (row: MasterMainFASTagBank): MasterMainFASTagBankDTO => ({
  bank_name: row.bank_name || '',
  bank_code: row.bank_code || '',

  status: row.status || Status.Active,
});

// Create New MasterMainFasttagBank Payload
export const newMasterMainFasttagPayload = (): MasterMainFASTagBankDTO => ({
  bank_name: '',
  bank_code: '',

  status: Status.Active,
});

// MasterMainFasttagBank APIs
export const findMasterMainFasttagBanks = async (data: MasterMainFASTagBankQueryDTO): Promise<FBR<MasterMainFASTagBank[]>> => {
  return apiPost<FBR<MasterMainFASTagBank[]>, MasterMainFASTagBankQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterMainFasttagBank = async (data: MasterMainFASTagBankDTO): Promise<SBR> => {
  return apiPost<SBR, MasterMainFASTagBankDTO>(ENDPOINTS.create, data);
};

export const updateMasterMainFasttagBank = async (id: string, data: MasterMainFASTagBankDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterMainFASTagBankDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterMainFasttagBank = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterMainFasttagBankCache = async (): Promise<FBR<MasterMainFASTagBank[]>> => {
  return apiGet<FBR<MasterMainFASTagBank[]>>(ENDPOINTS.cache);
};

