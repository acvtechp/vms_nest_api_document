// Axios
import { apiPost } from '../../../core/apiCall';
import { BR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import { single_select_mandatory, stringMandatory } from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

const URL = 'main/data_check';

const ENDPOINTS = {
    check: `${URL}/search`,
};

// DataCheck Traccar Row Interface
export interface DataCheckTraccarRow extends Record<string, unknown> {
    id: string;
    received_at: string | null;
    device_unique_id: string | null;
    device_time: string | null;
    fix_time: string | null;
    server_time: string | null;
    payload: unknown;
}

// DataCheck Protocol Row Interface
export interface DataCheckProtocolRow extends Record<string, unknown> {
    id: string;
    received_date_time: string | null;
    protocol: string | null;
    device_imei: string | null;
    raw: string | null;
    payload_json: unknown;
}

// DataCheck API Row Interface
export interface DataCheckApiRow extends Record<string, unknown> {
    id: string;
    received_date_time: string | null;
    api_name: string | null;
    api_code: string | null;
    vehicle_number: string | null;
    device_date_time: string | null;
    gps_data_json: unknown;
}

// DataCheck Vehicle Info Interface
// Present when the searched value (IMEI / device unique id) resolves to a
// known vehicle/device record (vehicle_found = true).
export interface DataCheckVehicleInfo extends Record<string, unknown> {
    organisation_id: string;
    organisation_name: string;
    organisation_code: string;
    organisation_logo_url: string;
    vehicle_id: string;
    vehicle_number: string;
    vehicle_name: string;
    vehicle_type: string;
    gps_device_identifier: string;
    assign_device_date: string | null;
    assign_device_date_f: string | null;
    device_manufacturer_name: string | null;
    device_manufacturer_code: string | null;
    device_model_name: string | null;
    device_model_code: string | null;
    device_type_name: string | null;
    device_type_code: string | null;
    gps_sim_mobile_number: string | null;
    gps_sim_serial_number: string | null;
    provider_name: string | null;
}

// DataCheck API Response Interface
// This is the nested object actually returned under `data.api_response` -
// it holds the three raw-data arrays, keyed by source.
export interface DataCheckApiResponse extends Record<string, unknown> {
    search: string;
    data_traccar_array: DataCheckTraccarRow[];
    data_protocol_array: DataCheckProtocolRow[];
    data_api_array: DataCheckApiRow[];
}

// DataCheck Result Interface
export interface DataCheckResult extends Record<string, unknown> {
    search: string;
    api_search: string;
    api_response: DataCheckApiResponse;
    vehicle_found: boolean;
    vehicle_info: DataCheckVehicleInfo | null;
}

// MasterDataCheck Query Schema
export const MasterDataCheckQuerySchema = BaseQuerySchema.extend({
    // Relations - Parent
    master_traccar_server_id: single_select_mandatory('MasterTraccarServer'), // Single-Selection -> MasterTraccarServer

    // Search value - vehicle number or IMEI
    search: stringMandatory('Search', 1, 100),
});
export type MasterDataCheckQueryDTO = z.infer<
    typeof MasterDataCheckQuerySchema
>;

// DataCheck APIs
export const checkDataCheck = async (data: MasterDataCheckQueryDTO,): Promise<BR<DataCheckResult>> => {
    return apiPost<BR<DataCheckResult>, MasterDataCheckQueryDTO>(ENDPOINTS.check, data);
};