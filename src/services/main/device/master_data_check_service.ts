// Axios
import { apiPost } from '../../../core/apiCall';
import { BR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import { stringMandatory } from '../../../zod_utils/zod_utils';
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

// DataCheck Result Interface
export interface DataCheckResult extends Record<string, unknown> {
    search: string;
    data_traccar_array: DataCheckTraccarRow[];
    data_protocol_array: DataCheckProtocolRow[];
    data_api_array: DataCheckApiRow[];
}

export const DataCheckQuerySchema = BaseQuerySchema.extend({
    search: stringMandatory('Search', 1, 100),
});
export type DataCheckQueryDTO = z.infer<typeof DataCheckQuerySchema>;

// Create New DataCheck Query Payload
export const newDataCheckQueryPayload = (): DataCheckQueryDTO => ({
    ...BaseQuerySchema.parse({}),
    search: '',
});

// DataCheck APIs
export const checkDataCheck = async (data: DataCheckQueryDTO,): Promise<BR<DataCheckResult>> => {
    return apiPost<BR<DataCheckResult>, DataCheckQueryDTO>(ENDPOINTS.check, data);
};