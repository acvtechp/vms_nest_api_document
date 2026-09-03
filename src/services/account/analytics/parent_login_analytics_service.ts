// Axios
import { apiPost } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  dateMandatory,
  enumArrayOptional,
  enumMandatory,
  getAllEnums,
  multi_select_optional,
  single_select_mandatory,
  single_select_optional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { LoginFrom, Status } from '../../../core/Enums';

// URL and Endpoints
const URL = 'analytics/parent_login_analytics';

const ENDPOINTS = {
  // StudentGuardianLoginAnalytics APIs
  find: `${URL}/search`,
  create: URL,

  // StudentGuardianLoginAnalytics Report APIs
  report_login_count: `${URL}/report_login_count`,
  report_daily_login: `${URL}/report_daily_login`,
};

// Interfaces
export interface StudentGuardianLoginAnalytics {
  guardian_login_analytics_id: string;

  // Main Field Details
  platform: LoginFrom;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  organisation_name: string;
  organisation_code: string;
  organisation_logo_url: string;
  organisation_branch_id: string;
  branch_name: string;
  branch_city: string;
  guardian_id: string;
  guardian_details: string;
  guardian_photo_url: string;
}

// StudentGuardianLoginAnalytics Login Count Report Return
export interface StudentGuardianLoginAnalyticsLoginCountReportReturn {
  guardian_id: string;
  guardian_details: string;
  guardian_photo_url: string;
  login_count: number;
}

// StudentGuardianLoginAnalytics Daily Login Report Return
export interface StudentGuardianLoginAnalyticsDailyLoginReportReturn {
  date: string;
  login_count: number;
}

// Create Schema
export const StudentGuardianLoginAnalyticsCreateSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'),
  organisation_branch_id: single_select_optional('OrganisationBranch'),
  guardian_id: single_select_mandatory('StudentGuardian'),

  // Main Field Details
  platform: enumMandatory('Platform', LoginFrom, LoginFrom.Web),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type StudentGuardianLoginAnalyticsCreateDTO = z.infer<
  typeof StudentGuardianLoginAnalyticsCreateSchema
>;

// Query Schema
export const StudentGuardianLoginAnalyticsQuerySchema = BaseQuerySchema.extend({
  // Self Table
  guardian_login_analytics_ids: multi_select_optional(
    'StudentGuardianLoginAnalytics',
  ),

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'),
  organisation_branch_ids: multi_select_optional('OrganisationBranch'),
  guardian_ids: multi_select_optional('StudentGuardian'),

  // Enums
  platform: enumArrayOptional('Platform', LoginFrom, getAllEnums(LoginFrom)),

  // Date Range Filter
  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
});
export type StudentGuardianLoginAnalyticsQueryDTO = z.infer<
  typeof StudentGuardianLoginAnalyticsQuerySchema
>;

// StudentGuardianLoginAnalytics Login Count Report Schema
export const StudentGuardianLoginAnalyticsLoginCountReportSchema =
  BaseQuerySchema.extend({
    // Relations - Parent
    organisation_id: single_select_mandatory('UserOrganisation'),
    organisation_branch_id: single_select_mandatory('OrganisationBranch'),

    // Date Filter
    date: dateMandatory('Date'),
  });
export type StudentGuardianLoginAnalyticsLoginCountReportDTO = z.infer<
  typeof StudentGuardianLoginAnalyticsLoginCountReportSchema
>;

// StudentGuardianLoginAnalytics Daily Login Report Schema
export const StudentGuardianLoginAnalyticsDailyLoginReportSchema =
  BaseQuerySchema.extend({
    // Relations - Parent
    organisation_id: single_select_mandatory('UserOrganisation'),
    organisation_branch_id: single_select_mandatory('OrganisationBranch'),
    guardian_id: single_select_mandatory('StudentGuardian'),

    // Date Range Filter
    from_date: dateMandatory('From Date'),
    to_date: dateMandatory('To Date'),
  });
export type StudentGuardianLoginAnalyticsDailyLoginReportDTO = z.infer<
  typeof StudentGuardianLoginAnalyticsDailyLoginReportSchema
>;

// Payload Converters
export const studentGuardianLoginAnalyticsCreatePayload = (
  payload: StudentGuardianLoginAnalyticsCreateDTO,
): StudentGuardianLoginAnalyticsCreateDTO => ({
  organisation_id: payload.organisation_id,
  organisation_branch_id: payload.organisation_branch_id,
  guardian_id: payload.guardian_id,
  platform: payload.platform,
  status: payload.status,
});

export const studentGuardianLoginAnalyticsQueryPayload = (
  payload: StudentGuardianLoginAnalyticsQueryDTO,
): StudentGuardianLoginAnalyticsQueryDTO => ({
  ...payload,
});

// StudentGuardianLoginAnalytics APIs
export const findStudentGuardianLoginAnalytics = (payload: StudentGuardianLoginAnalyticsQueryDTO): Promise<FBR<StudentGuardianLoginAnalytics[]>> => apiPost(ENDPOINTS.find, payload);

export const createStudentGuardianLoginAnalytics = (payload: StudentGuardianLoginAnalyticsCreateDTO): Promise<SBR> => apiPost(ENDPOINTS.create, payload);

// StudentGuardianLoginAnalytics Report APIs
export const getStudentGuardianLoginAnalyticsLoginCountReport = (payload: StudentGuardianLoginAnalyticsLoginCountReportDTO): Promise<FBR<StudentGuardianLoginAnalyticsLoginCountReportReturn[]>> => apiPost(ENDPOINTS.report_login_count, payload);

export const getStudentGuardianLoginAnalyticsDailyLoginReport = (payload: StudentGuardianLoginAnalyticsDailyLoginReportDTO): Promise<FBR<StudentGuardianLoginAnalyticsDailyLoginReportReturn[]>> => apiPost(ENDPOINTS.report_daily_login, payload);