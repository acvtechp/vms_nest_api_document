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
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { LoginFrom, Status } from '../../../core/Enums';

// URL and Endpoints
const URL = 'analytics/user_login_analytics';

const ENDPOINTS = {
  // UserLoginAnalytics APIs
  find: `${URL}/search`,
  create: URL,

  // UserLoginAnalytics Report APIs
  report_login_count: `${URL}/report_login_count`,
  report_daily_login: `${URL}/report_daily_login`,
};

// Interfaces
export interface UserLoginAnalytics {
  user_login_analytics_id: string;

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
  user_id: string;
  user_details: string;
  user_image_url: string;
}

// UserLoginAnalytics Login Count Report Return
export interface UserLoginAnalyticsLoginCountReportReturn {
  organisation_id: string;
  organisation_name: string;
  organisation_code: string;
  organisation_logo_url: string;
  login_count: number;
}

// UserLoginAnalytics Daily Login Report Return
export interface UserLoginAnalyticsDailyLoginReportReturn {
  date: string;
  login_count: number;
}

// UserLoginAnalytics Create Schema
export const UserLoginAnalyticsSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'),
  user_id: single_select_mandatory('User'),

  // Main Field Details
  platform: enumMandatory('Platform', LoginFrom, LoginFrom.Web),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type UserLoginAnalyticsDTO = z.infer<typeof UserLoginAnalyticsSchema>;

// UserLoginAnalytics Query Schema
export const UserLoginAnalyticsQuerySchema = BaseQuerySchema.extend({
  // Self Table
  user_login_analytics_ids: multi_select_optional('UserLoginAnalytics'),

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'),
  user_ids: multi_select_optional('User'),

  // Enums
  platform: enumArrayOptional('Platform', LoginFrom, getAllEnums(LoginFrom)),

  // Date Range Filter
  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
});
export type UserLoginAnalyticsQueryDTO = z.infer<
  typeof UserLoginAnalyticsQuerySchema
>;

// UserLoginAnalytics Login Count Report Schema
export const UserLoginAnalyticsLoginCountReportSchema = BaseQuerySchema.extend({
  // Date Filter
  date: dateMandatory('Date'),
});
export type UserLoginAnalyticsLoginCountReportDTO = z.infer<
  typeof UserLoginAnalyticsLoginCountReportSchema
>;

// UserLoginAnalytics Daily Login Report Schema
export const UserLoginAnalyticsDailyLoginReportSchema = BaseQuerySchema.extend({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'),

  // Date Range Filter
  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
});
export type UserLoginAnalyticsDailyLoginReportDTO = z.infer<
  typeof UserLoginAnalyticsDailyLoginReportSchema
>;

// UserLoginAnalytics APIs
export const findUserLoginAnalytics = (payload: UserLoginAnalyticsQueryDTO): Promise<FBR<UserLoginAnalytics[]>> => apiPost(ENDPOINTS.find, payload);

export const createUserLoginAnalytics = (payload: UserLoginAnalyticsDTO): Promise<SBR> => apiPost(ENDPOINTS.create, payload);

// UserLoginAnalytics Report APIs
export const getUserLoginAnalyticsLoginCountReport = (payload: UserLoginAnalyticsLoginCountReportDTO): Promise<FBR<UserLoginAnalyticsLoginCountReportReturn[]>> => apiPost(ENDPOINTS.report_login_count, payload);

export const getUserLoginAnalyticsDailyLoginReport = (payload: UserLoginAnalyticsDailyLoginReportDTO): Promise<FBR<UserLoginAnalyticsDailyLoginReportReturn[]>> => apiPost(ENDPOINTS.report_daily_login, payload);