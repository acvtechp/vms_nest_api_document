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

const URL = 'gps/features/gps_lock_digital_door_log';

const ENDPOINTS = {
  // GPSLockDigitalDoorLog APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// GPSLockDigitalDoorLog Interface
export interface GPSLockDigitalDoorLog extends Record<string, unknown> {
  // Primary Fields
  gps_lock_digital_door_log_id: string;

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

// GPSLockDigitalDoorLog Create/Update Schema
export const GPSLockDigitalDoorLogSchema = z.object({
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
export type GPSLockDigitalDoorLogDTO = z.infer<
  typeof GPSLockDigitalDoorLogSchema
>;

// GPSLockDigitalDoorLog Query Schema
export const GPSLockDigitalDoorLogQuerySchema = BaseQuerySchema.extend({
  // Self Table
  gps_lock_digital_door_log_ids: multi_select_optional(
    'GPSLockDigitalDoorLog',
  ), // Multi-Selection -> GPSLockDigitalDoorLog

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
export type GPSLockDigitalDoorLogQueryDTO = z.infer<
  typeof GPSLockDigitalDoorLogQuerySchema
>;

// Convert GPSLockDigitalDoorLog Data to API Payload
export const toGPSLockDigitalDoorLogPayload = (
  row: GPSLockDigitalDoorLog,
): GPSLockDigitalDoorLogDTO => ({
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

// Create New GPSLockDigitalDoorLog Payload
export const newGPSLockDigitalDoorLogPayload =
  (): GPSLockDigitalDoorLogDTO => ({
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

// GPSLockDigitalDoorLog APIs
export const findGPSLockDigitalDoorLogs = async (
  data: GPSLockDigitalDoorLogQueryDTO,
): Promise<FBR<GPSLockDigitalDoorLog[]>> => {
  return apiPost<
    FBR<GPSLockDigitalDoorLog[]>,
    GPSLockDigitalDoorLogQueryDTO
  >(ENDPOINTS.find, data);
};

export const createGPSLockDigitalDoorLog = async (
  data: GPSLockDigitalDoorLogDTO,
): Promise<SBR> => {
  return apiPost<SBR, GPSLockDigitalDoorLogDTO>(ENDPOINTS.create, data);
};

export const updateGPSLockDigitalDoorLog = async (
  id: string,
  data: GPSLockDigitalDoorLogDTO,
): Promise<SBR> => {
  return apiPatch<SBR, GPSLockDigitalDoorLogDTO>(ENDPOINTS.update(id), data);
};

export const deleteGPSLockDigitalDoorLog = async (
  id: string,
): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};
