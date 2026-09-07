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
  stringMandatory,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { LoginFrom, Status } from '../../../core/Enums';

// URL and Endpoints
const URL = 'analytics/user_page_analytics';

const ENDPOINTS = {
  // UserPageAnalytics APIs
  find: `${URL}/search`,
  create: URL,

  // UserPageAnalytics Report APIs
  report_page_count: `${URL}/report_page_count`,
  report_daily_page_count: `${URL}/report_daily_page_count`,
  monthly_page_analysis: `${URL}/monthly_page_analysis`,
};

// Interfaces
export interface UserPageAnalytics {
  user_page_analytics_id: string;

  // Main Field Details
  page_name: string;
  module_name: string;
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
  user_id: string;
  user_details: string;
  user_image_url: string;
}

// UserPageAnalytics Page Count Report Return
export interface UserPageAnalyticsPageCountReportReturn {
  organisation_id: string;
  organisation_name: string;
  organisation_code: string;
  organisation_logo_url: string;
  page_count: number;
}

// UserPageAnalytics Daily Page Count Report Return
export interface UserPageAnalyticsDailyPageCountReportReturn {
  date: string;
  page_count: number;
}

// UserPageAnalytics Monthly Page Analysis Return
export interface UserPageAnalyticsMonthlyPageAnalysisReturn {
  module_name: string;
  page_name: string;
  count: number;
}

// UserPageAnalytics Create Schema
export const UserPageAnalyticsSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'),
  user_id: single_select_mandatory('User'),

  // Main Field Details
  page_name: stringMandatory('Page Name', 1, 100),
  module_name: stringMandatory('Module Name', 1, 100),
  platform: enumMandatory('Platform', LoginFrom, LoginFrom.Web),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type UserPageAnalyticsDTO = z.infer<typeof UserPageAnalyticsSchema>;

// UserPageAnalytics Query Schema
export const UserPageAnalyticsQuerySchema = BaseQuerySchema.extend({
  // Self Table
  user_page_analytics_ids: multi_select_optional('UserPageAnalytics'),

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'),
  user_ids: multi_select_optional('User'),

  // Enums
  platform: enumArrayOptional('Platform', LoginFrom, getAllEnums(LoginFrom)),

  // Date Range Filter
  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
});
export type UserPageAnalyticsQueryDTO = z.infer<
  typeof UserPageAnalyticsQuerySchema
>;

// UserPageAnalytics Page Count Report Schema
export const UserPageAnalyticsPageCountReportSchema = BaseQuerySchema.extend({
  // Date Filter
  date: dateMandatory('Date'),
});
export type UserPageAnalyticsPageCountReportDTO = z.infer<
  typeof UserPageAnalyticsPageCountReportSchema
>;

// UserPageAnalytics Daily Page Count Report Schema
export const UserPageAnalyticsDailyPageCountReportSchema =
  BaseQuerySchema.extend({
    // Relations - Parent
    organisation_id: single_select_mandatory('UserOrganisation'),

    // Date Range Filter
    from_date: dateMandatory('From Date'),
    to_date: dateMandatory('To Date'),
  });
export type UserPageAnalyticsDailyPageCountReportDTO = z.infer<
  typeof UserPageAnalyticsDailyPageCountReportSchema
>;

// UserPageAnalytics Monthly Page Analysis Schema
export const UserPageAnalyticsMonthlyPageAnalysisSchema =
  BaseQuerySchema.extend({
    // Date Filter
    date: dateMandatory('Date'),
  });
export type UserPageAnalyticsMonthlyPageAnalysisDTO = z.infer<
  typeof UserPageAnalyticsMonthlyPageAnalysisSchema
>;

// UserPageAnalytics APIs
export const findUserPageAnalytics = (payload: UserPageAnalyticsQueryDTO): Promise<FBR<UserPageAnalytics[]>> => apiPost(ENDPOINTS.find, payload);

export const createUserPageAnalytics = (payload: UserPageAnalyticsDTO): Promise<SBR> => apiPost(ENDPOINTS.create, payload);

// UserPageAnalytics Report APIs
export const getUserPageAnalyticsPageCountReport = (payload: UserPageAnalyticsPageCountReportDTO): Promise<FBR<UserPageAnalyticsPageCountReportReturn[]>> => apiPost(ENDPOINTS.report_page_count, payload);

export const getUserPageAnalyticsDailyPageCountReport = (payload: UserPageAnalyticsDailyPageCountReportDTO): Promise<FBR<UserPageAnalyticsDailyPageCountReportReturn[]>> => apiPost(ENDPOINTS.report_daily_page_count, payload);

export const getUserPageAnalyticsMonthlyPageAnalysis = (payload: UserPageAnalyticsMonthlyPageAnalysisDTO): Promise<FBR<UserPageAnalyticsMonthlyPageAnalysisReturn[]>> => apiPost(ENDPOINTS.monthly_page_analysis, payload);