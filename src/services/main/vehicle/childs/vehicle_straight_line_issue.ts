// Axios
import { apiPost } from '../../../../core/apiCall';
import { FBR } from '../../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
    single_select_mandatory,
    dateMandatory,
} from '../../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../../../services/main/users/user_organisation_service';
import { MasterVehicle } from '../../../../services/main/vehicle/master_vehicle_service';

const URL = 'main/straight_line_issue';

const ENDPOINTS = {
    // VehicleStraightLineIssue APIs
    organisation_summary: `${URL}/organisation_summary`,
    month_summary: `${URL}/month_summary`,
};

// VehicleStraightLineIssue Interface
export interface VehicleStraightLineIssue extends Record<string, unknown> {
    // Primary Field
    vehicle_straight_line_issue_id: string;

    // Main Field Details
    issue_date?: string;
    issue_date_f?: string;

    // Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;
    added_date_time_f?: string;
    modified_date_time_f?: string;

    // Relations - Organisation
    organisation_id: string;
    UserOrganisation?: UserOrganisation;
    organisation_name?: string;
    organisation_code?: string;
    organisation_logo_url?: string;

    // Relations - Vehicle
    vehicle_id: string;
    MasterVehicle?: MasterVehicle;
    vehicle_number?: string;
    vehicle_type?: string;
}

// Straight Line Issue Organisation Summary Response
export interface StraightLineIssueOrganisationSummary extends Record<string, unknown> {
    si: number;
    time_zone_id: string;
    org_id: string;
    org_name: string;
    org_code: string;
    total_vehicles: number;
    issue_vehicles: number;
    issue_vehicles_list: string[];
}

// Straight Line Issue Month Summary Response
export interface StraightLineIssueMonthSummary extends Record<string, unknown> {
    si: number;
    date: string; // 'YYYY-MM-DD'
    day: string;  // '01' to '31'
    issue_vehicles: number;
    issue_vehicles_list: string[];
}

// Straight Line Issue Organisation Summary Query Schema
export const StraightLineIssueOrganisationSummaryQuerySchema =
    BaseQuerySchema.extend({
        // Filters
        selected_time_zone_id: single_select_mandatory('MasterMainTimeZone'), // Single-Selection -> MasterMainTimeZone
        date: dateMandatory('Date'),
    });
export type StraightLineIssueOrganisationSummaryQueryDTO = z.infer<
    typeof StraightLineIssueOrganisationSummaryQuerySchema
>;

// VehicleStraightLineIssue Month Summary Query Schema
export const StraightLineIssueMonthSummaryQuerySchema = BaseQuerySchema.extend({
    // Main Field Details
    organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
    date: dateMandatory('Date'),
});
export type StraightLineIssueMonthSummaryQueryDTO = z.infer<
    typeof StraightLineIssueMonthSummaryQuerySchema
>;

// VehicleStraightLineIssue APIs
export const findStraightLineIssueOrganisationSummary = async (data: StraightLineIssueOrganisationSummaryQueryDTO): Promise<FBR<StraightLineIssueOrganisationSummary[]>> => {
    return apiPost<FBR<StraightLineIssueOrganisationSummary[]>, StraightLineIssueOrganisationSummaryQueryDTO>(ENDPOINTS.organisation_summary, data);
};

export const findStraightLineIssueMonthSummary = async (data: StraightLineIssueMonthSummaryQueryDTO): Promise<FBR<StraightLineIssueMonthSummary[]>> => {
    return apiPost<FBR<StraightLineIssueMonthSummary[]>, StraightLineIssueMonthSummaryQueryDTO>(ENDPOINTS.month_summary, data);
};