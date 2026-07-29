// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
    stringMandatory,
    stringOptional,
    numberOptional,
    enumMandatory,
    multi_select_optional,
    enumOptional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status, YesNo } from '../../../core/Enums';

const URL = 'main/traccar_server';

const ENDPOINTS = {
    // MasterTraccarServer APIs
    find: `${URL}/search`,
    create: URL,
    update: (id: string): string => `${URL}/${id}`,
    delete: (id: string): string => `${URL}/${id}`,

    // Cache APIs
    cache: `${URL}/cache`,
};

// MasterTraccarServer Interface
export interface MasterTraccarServer extends Record<string, unknown> {
    // Primary Fields
    master_traccar_server_id: string;

    // Main Field Details
    server_code: string;

    // Postgres connection
    db_host?: string;
    db_port?: number;
    db_name?: string;
    db_user?: string;
    db_password?: string;
    db_ssl_enabled?: YesNo;
    db_connection_string?: string;
    datacheck_api?: string;

    // Traccar REST API
    api_base_url?: string;
    api_admin_email?: string;
    api_admin_password?: string;

    // Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;
}

// MasterTraccarServer Create/Update Schema
export const MasterTraccarServerSchema = z.object({
  // Main Field Details
  server_code: stringMandatory('Server Code', 3, 100),

  // Postgres connection
  db_host: stringOptional('DB Host', 0, 100),
  db_port: numberOptional('DB Port', 0, 100000, 5432),
  db_name: stringOptional('DB Name', 0, 100),
  db_user: stringOptional('DB User', 0, 100),
  db_password: stringOptional('DB Password', 0, 100),
  db_ssl_enabled: enumOptional('DB SSL Enabled', YesNo, YesNo.No),
  db_connection_string: stringOptional('DB Connection String', 0, 500),
  datacheck_api: stringOptional('Data Check API', 0, 500),

  // Traccar REST API
  api_base_url: stringOptional('API Base URL', 0, 100),
  api_admin_email: stringOptional('API Admin Email', 0, 100),
  api_admin_password: stringOptional('API Admin Password', 0, 100),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterTraccarServerDTO = z.infer<typeof MasterTraccarServerSchema>;

// MasterTraccarServer Query Schema
export const MasterTraccarServerQuerySchema = BaseQuerySchema.extend({
    // Self Table
    master_traccar_server_ids: multi_select_optional('MasterTraccarServer'), // Multi-selection -> MasterTraccarServer
});
export type MasterTraccarServerQueryDTO = z.infer<
    typeof MasterTraccarServerQuerySchema
>;

// Convert MasterTraccarServer Data to API Payload
export const toMasterTraccarServerPayload = (row: MasterTraccarServer): MasterTraccarServerDTO => ({
    server_code: row.server_code || '',

    db_host: row.db_host || '',
    db_port: row.db_port || 5432,
    db_name: row.db_name || '',
    db_user: row.db_user || '',
    db_password: row.db_password || '',
    db_ssl_enabled: row.db_ssl_enabled || YesNo.No,
    db_connection_string: row.db_connection_string || '',
    datacheck_api: row.datacheck_api || '',

    api_base_url: row.api_base_url || '',
    api_admin_email: row.api_admin_email || '',
    api_admin_password: row.api_admin_password || '',

    status: row.status || Status.Active,
});

// Create New MasterTraccarServer Payload
export const newMasterTraccarServerPayload = (): MasterTraccarServerDTO => ({
    server_code: '',

    db_host: '',
    db_port: 5432,
    db_name: '',
    db_user: '',
    db_password: '',
    db_ssl_enabled: YesNo.No,
    db_connection_string: '',
    datacheck_api: '',

    api_base_url: '',
    api_admin_email: '',
    api_admin_password: '',

    status: Status.Active,
});

// MasterTraccarServer APIs
export const findMasterTraccarServer = async (data: MasterTraccarServerQueryDTO): Promise<FBR<MasterTraccarServer[]>> => {
    return apiPost<FBR<MasterTraccarServer[]>, MasterTraccarServerQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterTraccarServer = async (data: MasterTraccarServerDTO): Promise<SBR> => {
    return apiPost<SBR, MasterTraccarServerDTO>(ENDPOINTS.create, data);
};

export const updateMasterTraccarServer = async (id: string, data: MasterTraccarServerDTO): Promise<SBR> => {
    return apiPatch<SBR, MasterTraccarServerDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterTraccarServer = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.delete(id));
};

export const getMasterTraccarServerCache = async (): Promise<FBR<MasterTraccarServer[]>> => {
    return apiGet<FBR<MasterTraccarServer[]>>(ENDPOINTS.cache);
};