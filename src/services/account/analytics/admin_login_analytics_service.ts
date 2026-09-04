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
const URL = 'analytics/admin_login_analytics';

const ENDPOINTS = {
  // UserAdminLoginAnalytics APIs
  find: `${URL}/search`,
  create: URL,

  // UserAdminLoginAnalytics Report APIs
  report_login_count: `${URL}/report_login_count`,
  report_daily_login: `${URL}/report_daily_login`,
};

// Interfaces
export interface UserAdminLoginAnalytics {
  user_admin_login_analytics_id: string;

  // Main Field Details
  platform: LoginFrom;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  admin_id: string;
  admin_details: string;
  admin_image_url: string;
}

// UserAdminLoginAnalytics Login Count Report Return
export interface UserAdminLoginAnalyticsLoginCountReportReturn {
  admin_id: string;
  admin_details: string;
  login_count: number;
}

// UserAdminLoginAnalytics Daily Login Report Return
export interface UserAdminLoginAnalyticsDailyLoginReportReturn {
  date: string;
  login_count: number;
}

// UserAdminLoginAnalytics Create Schema
export const UserAdminLoginAnalyticsSchema = z.object({
  // Relations - Parent
  admin_id: single_select_mandatory('UserAdmin'),

  // Main Field Details
  platform: enumMandatory('Platform', LoginFrom, LoginFrom.Web),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type UserAdminLoginAnalyticsDTO = z.infer<
  typeof UserAdminLoginAnalyticsSchema
>;

// UserAdminLoginAnalytics Query Schema
export const UserAdminLoginAnalyticsQuerySchema = BaseQuerySchema.extend({
  // Self Table
  user_admin_login_analytics_ids: multi_select_optional(
    'UserAdminLoginAnalytics',
  ),

  // Relations - Parent
  admin_ids: multi_select_optional('UserAdmin'),

  // Enums
  platform: enumArrayOptional('Platform', LoginFrom, getAllEnums(LoginFrom)),

  // Date Range Filter
  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
});
export type UserAdminLoginAnalyticsQueryDTO = z.infer<
  typeof UserAdminLoginAnalyticsQuerySchema
>;

// UserAdminLoginAnalytics Login Count Report Schema
export const UserAdminLoginAnalyticsLoginCountReportSchema =
  BaseQuerySchema.extend({
    // Date Filter
    date: dateMandatory('Date'),
  });
export type UserAdminLoginAnalyticsLoginCountReportDTO = z.infer<
  typeof UserAdminLoginAnalyticsLoginCountReportSchema
>;

// UserAdminLoginAnalytics Daily Login Report Schema
export const UserAdminLoginAnalyticsDailyLoginReportSchema =
  BaseQuerySchema.extend({
    // Relations - Parent
    admin_id: single_select_mandatory('UserAdmin'),

    // Date Range Filter
    from_date: dateMandatory('From Date'),
    to_date: dateMandatory('To Date'),
  });
export type UserAdminLoginAnalyticsDailyLoginReportDTO = z.infer<
  typeof UserAdminLoginAnalyticsDailyLoginReportSchema
>;

// UserAdminLoginAnalytics APIs
export const findUserAdminLoginAnalytics = (payload: UserAdminLoginAnalyticsQueryDTO): Promise<FBR<UserAdminLoginAnalytics[]>> => apiPost(ENDPOINTS.find, payload);

export const createUserAdminLoginAnalytics = (payload: UserAdminLoginAnalyticsDTO): Promise<SBR> => apiPost(ENDPOINTS.create, payload);

// UserAdminLoginAnalytics Report APIs
export const getUserAdminLoginAnalyticsLoginCountReport = (payload: UserAdminLoginAnalyticsLoginCountReportDTO): Promise<FBR<UserAdminLoginAnalyticsLoginCountReportReturn[]>> => apiPost(ENDPOINTS.report_login_count, payload);

export const getUserAdminLoginAnalyticsDailyLoginReport = (payload: UserAdminLoginAnalyticsDailyLoginReportDTO): Promise<FBR<UserAdminLoginAnalyticsDailyLoginReportReturn[]>> => apiPost(ENDPOINTS.report_daily_login, payload);