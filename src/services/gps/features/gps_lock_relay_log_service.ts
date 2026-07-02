// Axios
import { apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  stringOptional,
  enumMandatory,
  multi_select_mandatory,
  multi_select_optional,
  enumArrayOptional,
  getAllEnums,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status, RequestType, YesNo } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../main/users/user_organisation_service';
import { User } from '../../main/users/user_service';
import { MasterVehicle } from '../../main/vehicle/master_vehicle_service';
import { MasterDriver } from 'src/services/main/drivers/master_driver_service';

const URL = 'gps/features/gps_lock_relay_log';

const ENDPOINTS = {
  // GPSLockRelayLog APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// GPSLockRelayLog Interface
export interface GPSLockRelayLog extends Record<string, unknown> {
  // Primary Fields
  gps_lock_relay_log_id: string;

  // Main Field Details
  request_type: RequestType;
  command?: string;
  is_success: YesNo;
  response?: string;

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

  user_id?: string;
  User?: User;
  user_details?: string;
  user_image_url?: string;

  vehicle_id: string;
  MasterVehicle?: MasterVehicle;
  vehicle_number?: string;
  vehicle_type?: string;

  driver_id?: string;
  MasterDriver?: MasterDriver;
  driver_details?: string;
  driver_image_url?: string;
}

// GPSLockRelayLog Create/Update Schema
export const GPSLockRelayLogSchema = z.object({
  // Relations - Parent
  organisation_id: stringMandatory('Organisation'),
  user_id: stringOptional('User'),
  vehicle_id: stringMandatory('Master Vehicle'),
  driver_id: stringOptional('Master Driver'),

  // Main Field Details
  request_type: enumMandatory(
    'Request Type',
    RequestType,
    RequestType.Unlock,
  ),
  command: stringOptional('Command', 0, 150),
  is_success: enumMandatory('Is Success', YesNo, YesNo.No),
  response: stringOptional('Response', 0, 1000),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type GPSLockRelayLogDTO = z.infer<typeof GPSLockRelayLogSchema>;

// GPSLockRelayLog Query Schema
export const GPSLockRelayLogQuerySchema = BaseQuerySchema.extend({
  // Self Table
  gps_lock_relay_log_ids: multi_select_optional('GPSLockRelayLog'), // Multi-Selection -> GPSLockRelayLog

  // Relations - Parent
  organisation_ids: multi_select_mandatory('UserOrganisation'), // Multi-Selection -> UserOrganisation
  user_ids: multi_select_optional('User'), // Multi-Selection -> User
  vehicle_ids: multi_select_mandatory('MasterVehicle'), // Multi-Selection -> MasterVehicle
  driver_ids: multi_select_optional('MasterDriver'), // Multi-Selection -> MasterDriver

  // Main Field Details
  request_type: enumArrayOptional(
    'Request Type',
    RequestType,
    getAllEnums(RequestType),
  ),
  is_success: enumArrayOptional('Is Success', YesNo, getAllEnums(YesNo)),
});
export type GPSLockRelayLogQueryDTO = z.infer<
  typeof GPSLockRelayLogQuerySchema
>;

// Convert GPSLockRelayLog Data to API Payload
export const toGPSLockRelayLogPayload = (
  row: GPSLockRelayLog,
): GPSLockRelayLogDTO => ({
  organisation_id: row.organisation_id || '',
  user_id: row.user_id || '',
  vehicle_id: row.vehicle_id || '',
  driver_id: row.driver_id || '',

  request_type: row.request_type || RequestType.Unlock,
  command: row.command || '',
  is_success: row.is_success || YesNo.No,
  response: row.response || '',

  status: row.status || Status.Active,
});

// Create New GPSLockRelayLog Payload
export const newGPSLockRelayLogPayload = (): GPSLockRelayLogDTO => ({
  organisation_id: '',
  user_id: '',
  vehicle_id: '',
  driver_id: '',

  request_type: RequestType.Unlock,
  command: '',
  is_success: YesNo.No,
  response: '',

  status: Status.Active,
});

// GPSLockRelayLog APIs
export const findGPSLockRelayLogs = async (
  data: GPSLockRelayLogQueryDTO,
): Promise<FBR<GPSLockRelayLog[]>> => {
  return apiPost<FBR<GPSLockRelayLog[]>, GPSLockRelayLogQueryDTO>(
    ENDPOINTS.find,
    data,
  );
};

export const createGPSLockRelayLog = async (
  data: GPSLockRelayLogDTO,
): Promise<SBR> => {
  return apiPost<SBR, GPSLockRelayLogDTO>(ENDPOINTS.create, data);
};

export const updateGPSLockRelayLog = async (
  id: string,
  data: GPSLockRelayLogDTO,
): Promise<SBR> => {
  return apiPatch<SBR, GPSLockRelayLogDTO>(ENDPOINTS.update(id), data);
};

export const deleteGPSLockRelayLog = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};