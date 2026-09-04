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
const URL = 'analytics/driver_login_analytics';

const ENDPOINTS = {
  // MasterDriverLoginAnalytics APIs
  find: `${URL}/search`,
  create: URL,

  // MasterDriverLoginAnalytics Report APIs
  report_login_count: `${URL}/report_login_count`,
  report_daily_login: `${URL}/report_daily_login`,
};

// Interfaces
export interface MasterDriverLoginAnalytics {
  master_driver_login_analytics_id: string;

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
  driver_id: string;
  driver_details: string;
  driver_image_url: string;
}

// MasterDriverLoginAnalytics Login Count Report Return
export interface MasterDriverLoginAnalyticsLoginCountReportReturn {
  driver_id: string;
  driver_details: string;
  driver_image_url: string;
  login_count: number;
}

// MasterDriverLoginAnalytics Daily Login Report Return
export interface MasterDriverLoginAnalyticsDailyLoginReportReturn {
  date: string;
  login_count: number;
}

// MasterDriverLoginAnalytics Create Schema
export const MasterDriverLoginAnalyticsSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'),
  organisation_branch_id: single_select_mandatory('OrganisationBranch'),
  driver_id: single_select_mandatory('MasterDriver'),

  // Main Field Details
  platform: enumMandatory('Platform', LoginFrom, LoginFrom.Web),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterDriverLoginAnalyticsDTO = z.infer<
  typeof MasterDriverLoginAnalyticsSchema
>;

// MasterDriverLoginAnalytics Query Schema
export const MasterDriverLoginAnalyticsQuerySchema = BaseQuerySchema.extend({
  // Self Table
  master_driver_login_analytics_ids: multi_select_optional(
    'MasterDriverLoginAnalytics',
  ),

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'),
  organisation_branch_ids: multi_select_optional('OrganisationBranch'),
  driver_ids: multi_select_optional('MasterDriver'),

  // Enums
  platform: enumArrayOptional('Platform', LoginFrom, getAllEnums(LoginFrom)),

  // Date Range Filter
  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
});
export type MasterDriverLoginAnalyticsQueryDTO = z.infer<
  typeof MasterDriverLoginAnalyticsQuerySchema
>;

// MasterDriverLoginAnalytics Login Count Report Schema
export const MasterDriverLoginAnalyticsLoginCountReportSchema =
  BaseQuerySchema.extend({
    // Relations - Parent
    organisation_id: single_select_mandatory('UserOrganisation'),
    organisation_branch_id: single_select_mandatory('OrganisationBranch'),

    // Date Filter
    date: dateMandatory('Date'),
  });
export type MasterDriverLoginAnalyticsLoginCountReportDTO = z.infer<
  typeof MasterDriverLoginAnalyticsLoginCountReportSchema
>;

// MasterDriverLoginAnalytics Daily Login Report Schema
export const MasterDriverLoginAnalyticsDailyLoginReportSchema =
  BaseQuerySchema.extend({
    // Relations - Parent
    organisation_id: single_select_mandatory('UserOrganisation'),
    organisation_branch_id: single_select_mandatory('OrganisationBranch'),
    driver_id: single_select_mandatory('MasterDriver'),

    // Date Range Filter
    from_date: dateMandatory('From Date'),
    to_date: dateMandatory('To Date'),
  });
export type MasterDriverLoginAnalyticsDailyLoginReportDTO = z.infer<
  typeof MasterDriverLoginAnalyticsDailyLoginReportSchema
>;

// MasterDriverLoginAnalytics APIs
export const findMasterDriverLoginAnalytics = (payload: MasterDriverLoginAnalyticsQueryDTO): Promise<FBR<MasterDriverLoginAnalytics[]>> => apiPost(ENDPOINTS.find, payload);

export const createMasterDriverLoginAnalytics = (payload: MasterDriverLoginAnalyticsDTO): Promise<SBR> => apiPost(ENDPOINTS.create, payload);

// MasterDriverLoginAnalytics Report APIs
export const getMasterDriverLoginAnalyticsLoginCountReport = (payload: MasterDriverLoginAnalyticsLoginCountReportDTO): Promise<FBR<MasterDriverLoginAnalyticsLoginCountReportReturn[]>> => apiPost(ENDPOINTS.report_login_count, payload);

export const getMasterDriverLoginAnalyticsDailyLoginReport = (payload: MasterDriverLoginAnalyticsDailyLoginReportDTO): Promise<FBR<MasterDriverLoginAnalyticsDailyLoginReportReturn[]>> => apiPost(ENDPOINTS.report_daily_login, payload);