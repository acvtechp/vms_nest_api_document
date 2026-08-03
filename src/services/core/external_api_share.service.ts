// Axios
import { apiPost, apiPatch, apiDelete, apiGet } from 'src/core/apiCall';
import { FBR, SBR } from 'src/core/BaseResponse';

// Zod
import { z } from 'zod';
import {
    stringMandatory,
    stringOptional,
    enumOptional,
    numberMandatory,
    stringArrayMandatory,
    enumMandatory,
    multi_select_optional,
    enumArrayOptional,
    dateMandatory,
    getAllEnums,
} from 'src/zod_utils/zod_utils';
import { BaseQuerySchema } from 'src/zod_utils/zod_base_schema';

// Enums
import { YesNo, Status, APIAuthType } from 'src/core/Enums';

// Other Models
import { UserOrganisation } from '../main/users/user_organisation_service';
import { MasterVehicle } from '../main/vehicle/master_vehicle_service';

const URL = 'external_api';

const ENDPOINTS = {
    // ApiDataShareManagement APIs
    find: `${URL}/search`,
    create: URL,
    update: (id: string): string => `${URL}/${id}`,
    delete: (id: string): string => `${URL}/${id}`,

    hit_log_find: `${URL}/data_share_hit_log/search`,

    // Reports
    daily_report: `${URL}/report/daily`,
    monthly_report: `${URL}/report/monthly`,

    // Cache APIs
    reset_cache: `${URL}/reset_cache`,
};

// ApiDataShareManagement Interface
export interface ApiDataShareManagement extends Record<string, unknown> {
    // Primary Fields
    api_data_share_id: string;

    // Main Field Details
    api_name: string;
    vendor_name: string;
    description?: string;

    // Control
    is_enabled: YesNo;

    // Vehicles
    all_vehicles: YesNo;

    // Authentication
    auth_type: APIAuthType;

    api_keys: string[];
    usernames: string[];
    passwords: string[];

    // Rate limit
    rate_limit_rpm: number;

    allowed_ips: string[];

    // Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;

    // Relations - Child
    ApiDataShareHitLog?: ApiDataShareHitLog[];
    ApiDataShareManagementUserOrganisationLink?: ApiDataShareManagementUserOrganisationLink[];
    ApiDataShareManagementVehicleLink?: ApiDataShareManagementVehicleLink[];

    _count?: {
        ApiDataShareHitLog?: number;
        ApiDataShareManagementUserOrganisationLink?: number;
        ApiDataShareManagementVehicleLink?: number;
    };
}

// ApiDataShareManagementUserOrganisationLink Interface
export interface ApiDataShareManagementUserOrganisationLink extends Record<string, unknown> {
    // Primary Field
    api_data_share_user_organisation_link_id: string;

    // Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;

    // Relations - Parent
    api_data_share_id: string;
    ApiDataShareManagement?: ApiDataShareManagement;

    organisation_id: string;
    UserOrganisation?: UserOrganisation;
    organisation_name?: string;
    organisation_code?: string;
    organisation_logo_url?: string;
}

// ApiDataShareManagementVehicleLink Interface
export interface ApiDataShareManagementVehicleLink extends Record<string, unknown> {
    // Primary Field
    api_data_share_vehicle_link_id: string;

    // Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;

    // Relations - Parent
    api_data_share_id: string;
    ApiDataShareManagement?: ApiDataShareManagement;

    vehicle_id: string;
    MasterVehicle?: MasterVehicle;
    vehicle_number?: string;
    vehicle_type?: string;
}

// ApiDataShareHitLog Interface
export interface ApiDataShareHitLog extends Record<string, unknown> {
    // Primary Fields
    api_data_share_hit_log_id: string;

    // Relations - Parent
    api_data_share_id: string;
    ApiDataShareManagement?: ApiDataShareManagement;
    api_name?: string;
    vendor_name?: string;

    // Request info
    request_date_time: string;
    request_date_time_f?: string;

    request_id?: string;
    ip_address?: string;
    user_agent?: string;

    is_auth_success: YesNo;
    failed_message?: string;

    // Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;
}

// ExternalApiReport Interface
export interface ExternalApiReport extends Record<string, unknown> {
    api_name: string;
    vendor_name: string;

    success_count: number;
    failed_count: number;
    total_count: number;
}

// ApiDataShareManagement Create/Update Schema
export const ApiDataShareManagementSchema = z.object({
  // Main Field Details
  api_name: stringMandatory('API Name', 3, 100),
  vendor_name: stringMandatory('Vendor Name', 3, 100),
  description: stringOptional('Description', 0, 500),

  // Control
  is_enabled: enumOptional('Is Enabled', YesNo, YesNo.Yes),

  // Vehicles
  all_vehicles: enumMandatory('All Vehicles', YesNo, YesNo.No),
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi selection -> UserOrganisation
  vehicle_ids: multi_select_optional('MasterVehicle'), // Multi selection -> MasterVehicle

  // Authentication
  auth_type: enumOptional('Auth Type', APIAuthType, APIAuthType.API_KEY),

  api_keys: stringArrayMandatory('API Keys', 0, 100),
  usernames: stringArrayMandatory('Usernames', 0, 100),
  passwords: stringArrayMandatory('Passwords', 0, 100),

  // Rate limit
  rate_limit_rpm: numberMandatory('Rate Limit rpm'),
  allowed_ips: stringArrayMandatory('Allowed IPs', 0, 100),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type ApiDataShareManagementDTO = z.infer<
  typeof ApiDataShareManagementSchema
>;

// ApiDataShareManagement Query Schema
export const ApiDataShareManagementQuerySchema = BaseQuerySchema.extend({
    // Self Table
    api_data_share_ids: multi_select_optional('ApiDataShareManagement'), // Multi-selection -> ApiDataShareManagement

    // Enums
    is_enabled: enumArrayOptional('Is Enabled', YesNo, getAllEnums(YesNo)),
    auth_type: enumArrayOptional(
        'Auth Type',
        APIAuthType,
        getAllEnums(APIAuthType),
    ),
});
export type ApiDataShareManagementQueryDTO = z.infer<
    typeof ApiDataShareManagementQuerySchema
>;

// ApiDataShareHitLog Query Schema
export const ApiDataShareHitLogQuerySchema = BaseQuerySchema.extend({
    // Self Table
    api_data_share_hit_log_ids: multi_select_optional('ApiDataShareHitLog'), // Multi-selection -> ApiDataShareHitLog

    // Relations - Parent
    api_data_share_ids: multi_select_optional('ApiDataShareManagement'), // Multi-selection -> ApiDataShareManagement

    // Enums
    is_auth_success: enumArrayOptional(
        'Is Auth Success',
        YesNo,
        getAllEnums(YesNo),
    ),
});
export type ApiDataShareHitLogQueryDTO = z.infer<
    typeof ApiDataShareHitLogQuerySchema
>;

// External API Report Schema
export const ExternalApiShareReportSchema = z.object({
  date: dateMandatory('Date'),
});
export type ExternalApiShareReportDTO = z.infer<
  typeof ExternalApiShareReportSchema
>;

// Convert ApiDataShareManagement Data to API Payload
export const toApiDataShareManagementPayload = (row: ApiDataShareManagement): ApiDataShareManagementDTO => ({
    api_name: row.api_name || '',
    vendor_name: row.vendor_name || '',
    description: row.description || '',

    is_enabled: row.is_enabled || YesNo.Yes,

    all_vehicles: row.all_vehicles || YesNo.No,
    organisation_ids: row.ApiDataShareManagementUserOrganisationLink?.map((link) => link.organisation_id) || [],
    vehicle_ids: row.ApiDataShareManagementVehicleLink?.map((link) => link.vehicle_id) || [],

    auth_type: row.auth_type || APIAuthType.API_KEY,

    api_keys: row.api_keys || [],
    usernames: row.usernames || [],
    passwords: row.passwords || [],

    rate_limit_rpm: row.rate_limit_rpm || 0,
    allowed_ips: row.allowed_ips || [],

    status: row.status || Status.Active,
});

// Create New ApiDataShareManagement Payload
export const newApiDataShareManagementPayload = (): ApiDataShareManagementDTO => ({
    api_name: '',
    vendor_name: '',
    description: '',

    is_enabled: YesNo.Yes,

    all_vehicles: YesNo.No,
    organisation_ids: [],
    vehicle_ids: [],

    auth_type: APIAuthType.API_KEY,

    api_keys: [],
    usernames: [],
    passwords: [],

    rate_limit_rpm: 10,
    allowed_ips: [],

    status: Status.Active,
});


// ApiDataShareManagement APIs
export const findApiDataShareManagement = async (data: ApiDataShareManagementQueryDTO,): Promise<FBR<ApiDataShareManagement[]>> => {
    return apiPost<FBR<ApiDataShareManagement[]>, ApiDataShareManagementQueryDTO>(ENDPOINTS.find, data);
};

export const createApiDataShareManagement = async (data: ApiDataShareManagementDTO): Promise<SBR> => {
    return apiPost<SBR, ApiDataShareManagementDTO>(ENDPOINTS.create, data);
};

export const updateApiDataShareManagement = async (id: string, data: ApiDataShareManagementDTO): Promise<SBR> => {
    return apiPatch<SBR, ApiDataShareManagementDTO>(ENDPOINTS.update(id), data);
};

export const deleteApiDataShareManagement = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Hit Log APIs
export const findApiDataShareHitLog = async (data: ApiDataShareHitLogQueryDTO): Promise<FBR<ApiDataShareHitLog[]>> => {
    return apiPost<FBR<ApiDataShareHitLog[]>, ApiDataShareHitLogQueryDTO>(ENDPOINTS.hit_log_find, data);
};

// Reports
export const getExternalApiDailyReport = async (data: ExternalApiShareReportDTO): Promise<FBR<ExternalApiReport[]>> => {
    return apiPost<FBR<ExternalApiReport[]>, ExternalApiShareReportDTO>(ENDPOINTS.daily_report, data);
};

export const getExternalApiMonthlyReport = async (data: ExternalApiShareReportDTO): Promise<FBR<ExternalApiReport[]>> => {
    return apiPost<FBR<ExternalApiReport[]>, ExternalApiShareReportDTO>(ENDPOINTS.monthly_report, data);
};

// Cache APIs
export const resetExternalApiCache = async (): Promise<SBR> => {
    return apiGet<SBR>(ENDPOINTS.reset_cache);
};