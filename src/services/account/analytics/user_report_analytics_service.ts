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
import { DownloadReportType, LoginFrom, Status } from '../../../core/Enums';

// URL and Endpoints
const URL = 'analytics/user_report_analytics';

const ENDPOINTS = {
  // UserReportAnalytics APIs
  find: `${URL}/search`,
  create: URL,

  // UserReportAnalytics Report APIs
  monthly_report_analysis: `${URL}/monthly_report_analysis`,
};

// Interfaces
export interface UserReportAnalytics {
  user_report_analytics_id: string;

  // Main Field Details
  page_name: string;
  module_name: string;
  report_name: string;
  report_type: DownloadReportType;
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

// UserReportAnalytics Monthly Report Analysis Return
export interface UserReportAnalyticsMonthlyReportAnalysisReturn {
  module_name: string;
  page_name: string;
  report_name: string;
  count: number;
}

// UserReportAnalytics Create Schema
export const UserReportAnalyticsSchema = z.object({
  // Main Field Details
  page_name: stringMandatory('Page Name', 1, 100),
  module_name: stringMandatory('Module Name', 1, 100),
  report_name: stringMandatory('Report Name', 1, 100),
  report_type: enumMandatory(
    'DownloadReportType',
    DownloadReportType,
    DownloadReportType.PDF,
  ),
  platform: enumMandatory('Platform', LoginFrom, LoginFrom.Web),

  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'),
  user_id: single_select_mandatory('User'),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type UserReportAnalyticsDTO = z.infer<typeof UserReportAnalyticsSchema>;

// UserReportAnalytics Query Schema
export const UserReportAnalyticsQuerySchema = BaseQuerySchema.extend({
  // Self Table
  user_report_analytics_ids: multi_select_optional('UserReportAnalytics'),

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'),
  user_ids: multi_select_optional('User'),

  // Enums
  report_type: enumArrayOptional(
    'DownloadReportType',
    DownloadReportType,
    getAllEnums(DownloadReportType),
  ),
  platform: enumArrayOptional('Platform', LoginFrom, getAllEnums(LoginFrom)),

  // Date Range Filter
  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
});
export type UserReportAnalyticsQueryDTO = z.infer<
  typeof UserReportAnalyticsQuerySchema
>;

// UserReportAnalytics Monthly Report Analysis Schema
export const UserReportAnalyticsMonthlyReportAnalysisSchema =
  BaseQuerySchema.extend({
    // Date Filter
    date: dateMandatory('Date'),
  });
export type UserReportAnalyticsMonthlyReportAnalysisDTO = z.infer<
  typeof UserReportAnalyticsMonthlyReportAnalysisSchema
>;

// UserReportAnalytics APIs
export const findUserReportAnalytics = (payload: UserReportAnalyticsQueryDTO): Promise<FBR<UserReportAnalytics[]>> => apiPost(ENDPOINTS.find, payload);

export const createUserReportAnalytics = (payload: UserReportAnalyticsDTO): Promise<SBR> => apiPost(ENDPOINTS.create, payload);

// UserReportAnalytics Report APIs
export const getUserReportAnalyticsMonthlyReportAnalysis = (payload: UserReportAnalyticsMonthlyReportAnalysisDTO): Promise<FBR<UserReportAnalyticsMonthlyReportAnalysisReturn[]>> => apiPost(ENDPOINTS.monthly_report_analysis, payload);