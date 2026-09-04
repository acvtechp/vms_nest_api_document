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
const URL = 'analytics/student_login_analytics';

const ENDPOINTS = {
  // StudentLoginAnalytics APIs
  find: `${URL}/search`,
  create: URL,

  // StudentLoginAnalytics Report APIs
  report_login_count: `${URL}/report_login_count`,
  report_daily_login: `${URL}/report_daily_login`,
};

// Interfaces
export interface StudentLoginAnalytics {
  student_login_analytics_id: string;

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
  student_id: string;
  student_details: string;
  student_photo_url: string;
}

// StudentLoginAnalytics Login Count Report Return
export interface StudentLoginAnalyticsLoginCountReportReturn {
  student_id: string;
  student_details: string;
  student_photo_url: string;
  login_count: number;
}

// StudentLoginAnalytics Daily Login Report Return
export interface StudentLoginAnalyticsDailyLoginReportReturn {
  date: string;
  login_count: number;
}

// StudentLoginAnalytics Create Schema
export const StudentLoginAnalyticsSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'),
  organisation_branch_id: single_select_optional('OrganisationBranch'),
  student_id: single_select_mandatory('Student'),

  // Main Field Details
  platform: enumMandatory('Platform', LoginFrom, LoginFrom.Web),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type StudentLoginAnalyticsDTO = z.infer<
  typeof StudentLoginAnalyticsSchema
>;

// StudentLoginAnalytics Query Schema
export const StudentLoginAnalyticsQuerySchema = BaseQuerySchema.extend({
  // Self Table
  student_login_analytics_ids: multi_select_optional('StudentLoginAnalytics'),

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'),
  organisation_branch_ids: multi_select_optional('OrganisationBranch'),
  student_ids: multi_select_optional('Student'),

  // Enums
  platform: enumArrayOptional('Platform', LoginFrom, getAllEnums(LoginFrom)),

  // Date Range Filter
  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
});
export type StudentLoginAnalyticsQueryDTO = z.infer<
  typeof StudentLoginAnalyticsQuerySchema
>;

// StudentLoginAnalytics Login Count Report Schema
export const StudentLoginAnalyticsLoginCountReportSchema =
  BaseQuerySchema.extend({
    // Relations - Parent
    organisation_id: single_select_mandatory('UserOrganisation'),
    organisation_branch_id: single_select_mandatory('OrganisationBranch'),

    // Date Filter
    date: dateMandatory('Date'),
  });
export type StudentLoginAnalyticsLoginCountReportDTO = z.infer<
  typeof StudentLoginAnalyticsLoginCountReportSchema
>;

// StudentLoginAnalytics Daily Login Report Schema
export const StudentLoginAnalyticsDailyLoginReportSchema =
  BaseQuerySchema.extend({
    // Relations - Parent
    organisation_id: single_select_mandatory('UserOrganisation'),
    organisation_branch_id: single_select_mandatory('OrganisationBranch'),
    student_id: single_select_mandatory('Student'),

    // Date Range Filter
    from_date: dateMandatory('From Date'),
    to_date: dateMandatory('To Date'),
  });
export type StudentLoginAnalyticsDailyLoginReportDTO = z.infer<
  typeof StudentLoginAnalyticsDailyLoginReportSchema
>;

// StudentLoginAnalytics APIs
export const findStudentLoginAnalytics = (payload: StudentLoginAnalyticsQueryDTO): Promise<FBR<StudentLoginAnalytics[]>> => apiPost(ENDPOINTS.find, payload);

export const createStudentLoginAnalytics = (payload: StudentLoginAnalyticsDTO): Promise<SBR> => apiPost(ENDPOINTS.create, payload);

// StudentLoginAnalytics Report APIs
export const getStudentLoginAnalyticsLoginCountReport = (payload: StudentLoginAnalyticsLoginCountReportDTO): Promise<FBR<StudentLoginAnalyticsLoginCountReportReturn[]>> => apiPost(ENDPOINTS.report_login_count, payload);

export const getStudentLoginAnalyticsDailyLoginReport = (payload: StudentLoginAnalyticsDailyLoginReportDTO): Promise<FBR<StudentLoginAnalyticsDailyLoginReportReturn[]>> => apiPost(ENDPOINTS.report_daily_login, payload);