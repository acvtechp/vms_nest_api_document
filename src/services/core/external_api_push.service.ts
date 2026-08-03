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
import { YesNo, Status } from 'src/core/Enums';

// Other Models
import { UserOrganisation } from '../main/users/user_organisation_service';
import { MasterVehicle } from '../main/vehicle/master_vehicle_service';

const URL = 'external_api_push';

const ENDPOINTS = {
    // ApiDataPushManagement APIs
    find: `${URL}/search`,
    create: URL,
    update: (id: string): string => `${URL}/${id}`,
    delete: (id: string): string => `${URL}/${id}`,

    hit_log_find: `${URL}/data_push_hit_log/search`,

    // Reports
    daily_report: `${URL}/report/daily`,
    monthly_report: `${URL}/report/monthly`,

    // Cache APIs
    reset_cache: `${URL}/reset_cache`,
};

// ApiDataPushManagement Interface
export interface ApiDataPushManagement extends Record<string, unknown> {
    // Primary Fields
    api_data_push_id: string;

    // Main Field Details
    api_name: string;
    vendor_name: string;
    description?: string;

    // Control
    is_enabled: YesNo;

    // Vehicles
    all_vehicles: YesNo;

    // Frequency
    frequency_seconds: number;
    last_run_date_time?: string;
    last_run_date_time_f?: string;
    last_run_status?: YesNo;
    last_run_message?: string;

    // Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;

    // Relations - Child
    ApiDataPushHitLog?: ApiDataPushHitLog[];
    ApiDataPushManagementUserOrganisationLink?: ApiDataPushManagementUserOrganisationLink[];
    ApiDataPushManagementVehicleLink?: ApiDataPushManagementVehicleLink[];

    _count?: {
        ApiDataPushHitLog?: number;
        ApiDataPushManagementUserOrganisationLink?: number;
        ApiDataPushManagementVehicleLink?: number;
    };
}

// ApiDataPushManagementUserOrganisationLink Interface
export interface ApiDataPushManagementUserOrganisationLink extends Record<string, unknown> {
    // Primary Field
    api_data_push_user_organisation_link_id: string;

    // Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;

    // Relations - Parent
    api_data_push_id: string;
    ApiDataPushManagement?: ApiDataPushManagement;

    organisation_id: string;
    UserOrganisation?: UserOrganisation;
    organisation_name?: string;
    organisation_code?: string;
}

// ApiDataPushManagementVehicleLink Interface
export interface ApiDataPushManagementVehicleLink extends Record<string, unknown> {
    // Primary Field
    api_data_push_vehicle_link_id: string;

    // Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;

    // Relations - Parent
    api_data_push_id: string;
    ApiDataPushManagement?: ApiDataPushManagement;

    vehicle_id: string;
    MasterVehicle?: MasterVehicle;
    vehicle_number?: string;
    vehicle_type?: string;
}

// ApiDataPushHitLog Interface
export interface ApiDataPushHitLog extends Record<string, unknown> {
    // Primary Fields
    api_data_push_hit_log_id: string;

    // Relations - Parent
    api_data_push_id: string;
    ApiDataPushManagement?: ApiDataPushManagement;
    api_name?: string;
    vendor_name?: string;

    // Run info
    run_date_time?: string;
    run_date_time_f?: string;

    run_status?: YesNo;
    run_message?: string;

    // Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;
}

// ExternalApiPushReport Interface
export interface ExternalApiPushReport extends Record<string, unknown> {
    api_name: string;
    vendor_name: string;

    success_count: number;
    failed_count: number;
    total_count: number;
}

// ApiDataPushManagement Create/Update Schema
export const ApiDataPushManagementSchema = z.object({
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

  // Frequency
  frequency_seconds: numberMandatory('Frequency Seconds'),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type ApiDataPushManagementDTO = z.infer<
  typeof ApiDataPushManagementSchema
>;

// ApiDataPushManagement Query Schema
export const ApiDataPushManagementQuerySchema = BaseQuerySchema.extend({
  // Self Table
  api_data_push_ids: multi_select_optional('ApiDataPushManagement'), // Multi-selection -> ApiDataPushManagement

  // Enums
  is_enabled: enumArrayOptional('Is Enabled', YesNo, getAllEnums(YesNo)),
});
export type ApiDataPushManagementQueryDTO = z.infer<
  typeof ApiDataPushManagementQuerySchema
>;

// ApiDataPushHitLog Query Schema
export const ApiDataPushHitLogQuerySchema = BaseQuerySchema.extend({
  // Self Table
  api_data_push_hit_log_ids: multi_select_optional('ApiDataPushHitLog'), // Multi-selection -> ApiDataPushHitLog

  // Relations - Parent
  api_data_push_ids: multi_select_optional('ApiDataPushManagement'), // Multi-selection -> ApiDataPushManagement

  // Enums
  run_status: enumArrayOptional('Run Status', YesNo, getAllEnums(YesNo)),
});
export type ApiDataPushHitLogQueryDTO = z.infer<
  typeof ApiDataPushHitLogQuerySchema
>;

// Reuse the same schema/DTO shape as the share module
export const ExternalApiPushReportSchema = z.object({
  date: dateMandatory('Date'),
});
export type ExternalApiPushReportDTO = z.infer<
  typeof ExternalApiPushReportSchema
>;

// Convert ApiDataPushManagement Data to API Payload
export const toApiDataPushManagementPayload = (row: ApiDataPushManagement): ApiDataPushManagementDTO => ({
    api_name: row.api_name || '',
    vendor_name: row.vendor_name || '',
    description: row.description || '',

    is_enabled: row.is_enabled || YesNo.Yes,

    all_vehicles: row.all_vehicles || YesNo.No,
    organisation_ids: row.ApiDataPushManagementUserOrganisationLink?.map((link) => link.organisation_id) || [],
    vehicle_ids: row.ApiDataPushManagementVehicleLink?.map((link) => link.vehicle_id) || [],

    frequency_seconds: row.frequency_seconds || 60,

    status: row.status || Status.Active,
});

// Create New ApiDataPushManagement Payload
export const newApiDataPushManagementPayload = (): ApiDataPushManagementDTO => ({
    api_name: '',
    vendor_name: '',
    description: '',

    is_enabled: YesNo.Yes,

    all_vehicles: YesNo.No,
    organisation_ids: [],
    vehicle_ids: [],

    frequency_seconds: 60,

    status: Status.Active,
});


// ApiDataPushManagement APIs
export const findApiDataPushManagement = async (data: ApiDataPushManagementQueryDTO,): Promise<FBR<ApiDataPushManagement[]>> => {
    return apiPost<FBR<ApiDataPushManagement[]>, ApiDataPushManagementQueryDTO>(ENDPOINTS.find, data);
};

export const createApiDataPushManagement = async (data: ApiDataPushManagementDTO): Promise<SBR> => {
    return apiPost<SBR, ApiDataPushManagementDTO>(ENDPOINTS.create, data);
};

export const updateApiDataPushManagement = async (id: string, data: ApiDataPushManagementDTO): Promise<SBR> => {
    return apiPatch<SBR, ApiDataPushManagementDTO>(ENDPOINTS.update(id), data);
};

export const deleteApiDataPushManagement = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Hit Log APIs
export const findApiDataPushHitLog = async (data: ApiDataPushHitLogQueryDTO): Promise<FBR<ApiDataPushHitLog[]>> => {
    return apiPost<FBR<ApiDataPushHitLog[]>, ApiDataPushHitLogQueryDTO>(ENDPOINTS.hit_log_find, data);
};

// Reports
export const getExternalApiPushDailyReport = async (data: ExternalApiPushReportDTO): Promise<FBR<ExternalApiPushReport[]>> => {
    return apiPost<FBR<ExternalApiPushReport[]>, ExternalApiPushReportDTO>(ENDPOINTS.daily_report, data);
};

export const getExternalApiPushMonthlyReport = async (data: ExternalApiPushReportDTO): Promise<FBR<ExternalApiPushReport[]>> => {
    return apiPost<FBR<ExternalApiPushReport[]>, ExternalApiPushReportDTO>(ENDPOINTS.monthly_report, data);
};

// Cache APIs
export const resetExternalApiPushCache = async (): Promise<SBR> => {
    return apiGet<SBR>(ENDPOINTS.reset_cache);
};