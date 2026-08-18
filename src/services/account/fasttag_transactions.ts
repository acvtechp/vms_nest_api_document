// Axios
import { apiPost, apiPatch, apiDelete } from '../../core/apiCall';
import { SBR, FBR } from '../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  dateTimeOptional,
  doubleOptional,
  enumMandatory,
  multi_select_optional,
  single_select_mandatory,
  stringMandatory,
  stringOptional,
} from '../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../core/Enums';

// Other Models
import { FASTagDetails } from './fasttag_details';
import { MasterMainFASTagBank } from '../master/main/master_main_fasttag_bank_service';
import { UserOrganisation } from '../main/users/user_organisation_service';
import { MasterVehicle } from '../main/vehicle/master_vehicle_service';

// URL and Endpoints
const URL = 'account/fasttag_transactions';

const ENDPOINTS = {
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// FASTagTransaction Interface
export interface FASTagTransaction extends Record<string, unknown> {
  // Primary Fields
  fasttag_transaction_id: string;

  // Main Field Details
  processing_date_time?: string;
  transaction_date_time?: string;

  transaction_amount?: number;

  transaction_id: string;
  transaction_status?: string;
  transaction_reference_number?: string;
  hex_tag_id?: string;

  lane_code?: string;
  plaza_code?: string;
  plaza_name?: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  fasttag_details_id: string;
  FASTagDetails?: FASTagDetails;

  fasttag_bank_id: string;
  MasterMainFASTagBank?: MasterMainFASTagBank;
  bank_name?: string;
  bank_code?: string;

  organisation_id: string;
  UserOrganisation?: UserOrganisation;
  organisation_name?: string;
  organisation_code?: string;
  organisation_logo_url?: string;

  vehicle_id: string;
  MasterVehicle?: MasterVehicle;
  vehicle_number?: string;
  vehicle_type?: string;
}

// FASTagTransaction Create/Update Schema
export const FASTagTransactionSchema = z.object({
  // Relations - Parent
  fasttag_details_id: single_select_mandatory('FASTagDetails'), // Single-Selection -> FASTagDetails
  fasttag_bank_id: single_select_mandatory('MasterMainFASTagBank'), // Single-Selection -> MasterMainFASTagBank
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
  vehicle_id: single_select_mandatory('MasterVehicle'), // Single-Selection -> MasterVehicle

  // Main Field Details
  processing_date_time: dateTimeOptional('Processing Date Time'),
  transaction_date_time: dateTimeOptional('Transaction Date Time'),

  transaction_amount: doubleOptional('Transaction Amount', 0),

  transaction_id: stringMandatory('Transaction ID', 2, 150),
  transaction_status: stringOptional('Transaction Status', 0, 100),
  transaction_reference_number: stringOptional(
    'Transaction Reference Number',
    0,
    150,
  ),
  hex_tag_id: stringOptional('Hex Tag ID', 0, 150),

  lane_code: stringOptional('Lane Code', 0, 100),
  plaza_code: stringOptional('Plaza Code', 0, 100),
  plaza_name: stringOptional('Plaza Name', 0, 300),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});

export type FASTagTransactionDTO = z.infer<typeof FASTagTransactionSchema>;

// FASTagTransaction Query Schema
export const FASTagTransactionQuerySchema = BaseQuerySchema.extend({
  // Self Table
  fasttag_transaction_ids: multi_select_optional('FASTagTransaction'), // Multi-selection -> FASTagTransaction

  // Relations - Parent
  fasttag_details_ids: multi_select_optional('FASTagDetails'), // Multi-selection -> FASTagDetails
  fasttag_bank_ids: multi_select_optional('MasterMainFASTagBank'), // Multi-selection -> MasterMainFASTagBank
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
  vehicle_ids: multi_select_optional('MasterVehicle'), // Multi-selection -> MasterVehicle
});

export type FASTagTransactionQueryDTO = z.infer<
  typeof FASTagTransactionQuerySchema
>;

// Convert existing data to a payload structure
export const toFASTagTransactionPayload = (
  row: FASTagTransaction,
): FASTagTransactionDTO => ({
  fasttag_details_id: row.fasttag_details_id,
  fasttag_bank_id: row.fasttag_bank_id,
  organisation_id: row.organisation_id,
  vehicle_id: row.vehicle_id,

  processing_date_time: row.processing_date_time ?? '',
  transaction_date_time: row.transaction_date_time ?? '',

  transaction_amount: row.transaction_amount ?? 0,

  transaction_id: row.transaction_id ?? '',
  transaction_status: row.transaction_status ?? '',
  transaction_reference_number: row.transaction_reference_number ?? '',
  hex_tag_id: row.hex_tag_id ?? '',

  lane_code: row.lane_code ?? '',
  plaza_code: row.plaza_code ?? '',
  plaza_name: row.plaza_name ?? '',

  status: row.status || Status.Active,
});

// Generate a new payload with default values
export const newFASTagTransactionPayload = (): FASTagTransactionDTO => ({
  fasttag_details_id: '',
  fasttag_bank_id: '',
  organisation_id: '',
  vehicle_id: '',

  processing_date_time: '',
  transaction_date_time: '',

  transaction_amount: 0,

  transaction_id: '',
  transaction_status: '',
  transaction_reference_number: '',
  hex_tag_id: '',

  lane_code: '',
  plaza_code: '',
  plaza_name: '',

  status: Status.Active,
});

// API Methods
export const findFASTagTransactions = async (data: FASTagTransactionQueryDTO): Promise<FBR<FASTagTransaction[]>> => {
  return apiPost<FBR<FASTagTransaction[]>, FASTagTransactionQueryDTO>(ENDPOINTS.find, data,);
};

export const createFASTagTransaction = async (data: FASTagTransactionDTO): Promise<SBR> => {
  return apiPost<SBR, FASTagTransactionDTO>(ENDPOINTS.create, data);
};

export const updateFASTagTransaction = async (id: string, data: FASTagTransactionDTO): Promise<SBR> => {
  return apiPatch<SBR, FASTagTransactionDTO>(ENDPOINTS.update(id), data);
};

export const deleteFASTagTransaction = async (id: string): Promise<SBR> => {
  return apiDelete(ENDPOINTS.delete(id));
};