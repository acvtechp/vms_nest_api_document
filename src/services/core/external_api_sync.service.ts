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
    enumMandatory,
    multi_select_optional,
    enumArrayOptional,
    dateMandatory,
    getAllEnums,
} from 'src/zod_utils/zod_utils';
import { BaseQuerySchema } from 'src/zod_utils/zod_base_schema';

// Enums
import {
    YesNo,
    Status,
    APISyncRunType,
} from 'src/core/Enums';

// Other Models
import { UserOrganisation } from '../main/users/user_organisation_service';

const URL = 'external_api_sync';

const ENDPOINTS = {
    // ApiDataSyncManagement APIs
    find: `${URL}/search`,
    create: URL,
    update: (id: string): string => `${URL}/${id}`,
    delete: (id: string): string => `${URL}/${id}`,

    // Run Log APIs
    run_log_find: `${URL}/data_sync_run_log/search`,

    // Manual Sync
    sync_now: (id: string): string => `${URL}/${id}/sync_now`,

    // Reports
    daily_report: `${URL}/report/daily`,
    monthly_report: `${URL}/report/monthly`,

    // Cache APIs
    reset_cache: `${URL}/reset_cache`,
};

// ApiDataSyncManagement Interface
export interface ApiDataSyncManagement extends Record<string, unknown> {
    // Primary Fields
    api_data_sync_id: string;

    // Main Field Details
    api_name: string;
    vendor_name: string;
    description?: string;

    // Control
    is_enabled: YesNo;

    // Frequency
    frequency_seconds: number;

    // Last Run
    last_run_date_time?: string;
    last_run_date_time_f?: string;

    last_run_status?: YesNo;
    last_run_message?: string;

    // Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;

    // Relations - Child
    ApiDataSyncRunLog?: ApiDataSyncRunLog[];
    ApiDataSyncManagementUserOrganisationLink?: ApiDataSyncManagementUserOrganisationLink[];

    _count?: {
        ApiDataSyncRunLog?: number;
        ApiDataSyncManagementUserOrganisationLink?: number;
    };
}

// ApiDataSyncManagementUserOrganisationLink Interface
export interface ApiDataSyncManagementUserOrganisationLink extends Record<string, unknown> {
    // Primary Field
    api_data_sync_user_organisation_link_id: string;

    // Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;

    // Relations - Parent
    api_data_sync_id: string;
    ApiDataSyncManagement?: ApiDataSyncManagement;

    organisation_id: string;
    UserOrganisation?: UserOrganisation;
    organisation_name?: string;
    organisation_code?: string;
    organisation_logo_url?: string;
}

// ApiDataSyncRunLog Interface
export interface ApiDataSyncRunLog extends Record<string, unknown> {
    // Primary Fields
    api_data_sync_run_log_id: string;

    // Relations - Parent
    api_data_sync_id: string;
    ApiDataSyncManagement?: ApiDataSyncManagement;

    api_name?: string;
    vendor_name?: string;

    // Run Details
    run_type: APISyncRunType;

    run_date_time: string;
    run_date_time_f?: string;

    run_status: YesNo;
    run_message?: string;

    // Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;
}

// ExternalApiSyncReport Interface
export interface ExternalApiSyncReport extends Record<string, unknown> {
    api_name: string;
    vendor_name: string;

    success_count: number;
    failed_count: number;
    total_count: number;
}

// ApiDataSyncManagement Create/Update Schema
export const ApiDataSyncManagementSchema = z.object({
    // Main Field Details
    api_name: stringMandatory('API Name', 3, 100),
    vendor_name: stringMandatory('Vendor Name', 3, 100),
    description: stringOptional('Description', 0, 500),

    organisation_ids: multi_select_optional('UserOrganisation'), // Multi selection -> UserOrganisation

    // Control
    is_enabled: enumOptional('Is Enabled', YesNo, YesNo.Yes),

    // Frequency
    frequency_seconds: numberMandatory('Frequency Seconds'),

    // Metadata
    status: enumMandatory('Status', Status, Status.Active),
});
export type ApiDataSyncManagementDTO = z.infer<
    typeof ApiDataSyncManagementSchema
>;

// ApiDataSyncManagement Query Schema
export const ApiDataSyncManagementQuerySchema = BaseQuerySchema.extend({
    // Self Table
    api_data_sync_ids: multi_select_optional('ApiDataSyncManagement'), // Multi-selection -> ApiDataSyncManagement

    // Enums
    is_enabled: enumArrayOptional('Is Enabled', YesNo, getAllEnums(YesNo)),
});
export type ApiDataSyncManagementQueryDTO = z.infer<
    typeof ApiDataSyncManagementQuerySchema
>;

// ApiDataSyncRunLog Query Schema
export const ApiDataSyncRunLogQuerySchema = BaseQuerySchema.extend({
    // Self Table
    api_data_sync_run_log_ids: multi_select_optional('ApiDataSyncRunLog'), // Multi-selection -> ApiDataSyncRunLog

    // Relations - Parent
    api_data_sync_ids: multi_select_optional('ApiDataSyncManagement'), // Multi-selection -> ApiDataSyncManagement

    // Enums
    run_type: enumArrayOptional(
        'Run Type',
        APISyncRunType,
        getAllEnums(APISyncRunType),
    ),

    run_status: enumArrayOptional('Run Status', YesNo, getAllEnums(YesNo)),
});
export type ApiDataSyncRunLogQueryDTO = z.infer<
    typeof ApiDataSyncRunLogQuerySchema
>;

// External API Report Schema
export const ExternalApiSyncReportSchema = z.object({
    date: dateMandatory('Date'),
});
export type ExternalApiSyncReportDTO = z.infer<
    typeof ExternalApiSyncReportSchema
>;

// Convert ApiDataSyncManagement Data to API Payload
export const toApiDataSyncManagementPayload = (row: ApiDataSyncManagement,): ApiDataSyncManagementDTO => ({
    // Main Field Details
    api_name: row.api_name || '',
    vendor_name: row.vendor_name || '',
    description: row.description || '',

    // Organisations
    organisation_ids: row.ApiDataSyncManagementUserOrganisationLink?.map((link) => link.organisation_id,) || [],

    // Control
    is_enabled: row.is_enabled || YesNo.Yes,

    // Frequency
    frequency_seconds: row.frequency_seconds || 60,

    // Metadata
    status: row.status || Status.Active,
});

// Create New ApiDataSyncManagement Payload
export const newApiDataSyncManagementPayload = (): ApiDataSyncManagementDTO => ({
    // Main Field Details
    api_name: '',
    vendor_name: '',
    description: '',

    // Organisations
    organisation_ids: [],

    // Control
    is_enabled: YesNo.Yes,

    // Frequency
    frequency_seconds: 60,

    // Metadata
    status: Status.Active,
});

// ApiDataSyncManagement APIs
export const findApiDataSyncManagement = async (data: ApiDataSyncManagementQueryDTO,): Promise<FBR<ApiDataSyncManagement[]>> => {
    return apiPost<FBR<ApiDataSyncManagement[]>, ApiDataSyncManagementQueryDTO>(ENDPOINTS.find, data);
};

export const createApiDataSyncManagement = async (data: ApiDataSyncManagementDTO,): Promise<SBR> => {
    return apiPost<SBR, ApiDataSyncManagementDTO>(ENDPOINTS.create, data);
};

export const updateApiDataSyncManagement = async (id: string, data: ApiDataSyncManagementDTO,): Promise<SBR> => {
    return apiPatch<SBR, ApiDataSyncManagementDTO>(ENDPOINTS.update(id), data);
};

export const deleteApiDataSyncManagement = async (id: string,): Promise<SBR> => {
    return apiDelete(ENDPOINTS.delete(id),);
};

// Run Log APIs
export const findApiDataSyncRunLog = async (data: ApiDataSyncRunLogQueryDTO,): Promise<FBR<ApiDataSyncRunLog[]>> => {
    return apiPost<FBR<ApiDataSyncRunLog[]>, ApiDataSyncRunLogQueryDTO>(ENDPOINTS.run_log_find, data);
};

// Manual Sync
export const syncNowApiDataSyncManagement = async (id: string,): Promise<SBR> => {
    return apiPost<SBR, Record<string, never>>(ENDPOINTS.sync_now(id), {});
};

// Reports
export const getExternalApiSyncDailyReport = async (data: ExternalApiSyncReportDTO,): Promise<FBR<ExternalApiSyncReport[]>> => {
    return apiPost<FBR<ExternalApiSyncReport[]>, ExternalApiSyncReportDTO>(ENDPOINTS.daily_report, data);
};

export const getExternalApiSyncMonthlyReport = async (data: ExternalApiSyncReportDTO,): Promise<FBR<ExternalApiSyncReport[]>> => {
    return apiPost<FBR<ExternalApiSyncReport[]>, ExternalApiSyncReportDTO>(ENDPOINTS.monthly_report, data);
};

// Cache APIs
export const resetExternalApiSyncCache = async (): Promise<SBR> => {
    return apiGet(ENDPOINTS.reset_cache);
};