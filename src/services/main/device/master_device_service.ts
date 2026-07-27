// Axios
import { apiPost, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
    stringMandatory,
    single_select_mandatory,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

const URL = 'main/master_device';

const ENDPOINTS = {
    // MasterDevice APIs
    create: URL,
    find: `${URL}/search`,
    delete: (master_traccar_server_id: string, imei: string): string =>
        `${URL}/${master_traccar_server_id}/${imei}`,
};

// MasterDevice Interface
// Rows come from the Traccar server's own tc_devices table (via raw query),
// merged with matching MasterVehicle rows on gps_device_identifier.
export interface MasterDevice extends Record<string, unknown> {
    // Primary Fields (tc_devices)
    id: number;
    description: string; // tc_devices.name
    imei: string; // tc_devices.uniqueid
    lastupdate: string;
    lastupdate_f: string;

    // Merged from MasterVehicle (empty strings when unassigned)
    organisation_id?: string;
    organisation_name?: string;
    organisation_code?: string;
    organisation_logo_url?: string;

    vehicle_id?: string;
    vehicle_number?: string;
    vehicle_name?: string;
    vehicle_type?: string;

    gps_device_identifier?: string;
    assign_device_date?: string;
    assign_device_date_f?: string;

    device_manufacturer_name?: string;
    device_manufacturer_code?: string;
    device_model_name?: string;
    device_model_code?: string;
    device_type_name?: string;
    device_type_code?: string;

    si?: number;
}

// MasterDevice Create Schema
export const MasterDeviceSchema = z.object({
    // Relations - Parent
    master_traccar_server_id: single_select_mandatory('MasterTraccarServer'), // Single-Selection -> MasterTraccarServer

    description: stringMandatory('Description', 1, 100),
    imei: stringMandatory('IMEI', 1, 100),
});
export type MasterDeviceDTO = z.infer<typeof MasterDeviceSchema>;

// MasterDevice Query Schema
export const MasterDeviceQuerySchema = BaseQuerySchema.extend({
    // Relations - Parent
    master_traccar_server_id: single_select_mandatory('MasterTraccarServer'), // Single-Selection -> MasterTraccarServer
});
export type MasterDeviceQueryDTO = z.infer<typeof MasterDeviceQuerySchema>;

// Convert MasterDevice Data to API Payload
export const toMasterDevicePayload = (row: MasterDevice): MasterDeviceDTO => ({
    master_traccar_server_id: '', // not returned on the row; set from selected server context
    description: row.description || '',
    imei: row.imei || '',
});

// Create New MasterDevice Payload
export const newMasterDevicePayload = (master_traccar_server_id: string = '',): MasterDeviceDTO => ({
    master_traccar_server_id,
    description: '',
    imei: '',
});

// MasterDevice APIs
export const findMasterDevice = async (data: MasterDeviceQueryDTO,): Promise<FBR<MasterDevice[]>> => {
    return apiPost<FBR<MasterDevice[]>, MasterDeviceQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterDevice = async (data: MasterDeviceDTO): Promise<SBR> => {
    return apiPost<SBR, MasterDeviceDTO>(ENDPOINTS.create, data);
};

export const deleteMasterDevice = async (master_traccar_server_id: string, imei: string,): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.delete(master_traccar_server_id, imei));
};