// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../../core/apiCall';
import { SBR, FBR } from '../../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  single_select_mandatory,
  multi_select_optional,
  enumMandatory,
  stringOptional,
} from '../../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../../../services/main/users/user_organisation_service';
import { MasterVehicle } from '../../../../services/main/vehicle/master_vehicle_service';
import { MasterDriver } from '../../../../services/main/drivers/master_driver_service';
import { User, UserLoginPush } from '../../../../services/main/users/user_service';
import { UserLoginAnalytics } from 'src/services/account/analytics/user_login_analytics_service';
import { OrganisationCalendar } from './calendar_service';
import { OrganisationNoticeBoard } from './notice_board_service';
import { Student, StudentAddress, StudentGuardian, StudentGuardianLink, StudentGuardianLoginPush, StudentLeaveRequest, StudentLoginPush, StudentStopChangeRequest, StudentTransportPlanTypeChangeHistory } from './student_service';
import { StudentGuardianLoginAnalytics } from 'src/services/account/analytics/parent_login_analytics_service';
import { StudentLoginAnalytics } from 'src/services/account/analytics/student_login_analytics_service';
import { BusStop } from '../transport_management/bus_stop';
import { DailyScheduleDayRun, DailyScheduleDayRunStop, DailyScheduleDayRunStudent } from '../transport_management/day_run_daily_schedule_api';
import { SpecialScheduleDayRun, SpecialScheduleDayRunStop, SpecialScheduleDayRunStudent } from '../transport_management/day_run_special_schedule_api';
import { MasterDailySchedule, MasterDailyScheduleStudent } from '../transport_management/master_daily_schedule';
import { MasterRoute, MasterRouteStop } from '../transport_management/master_route';
import { MasterSpecialSchedule, MasterSpecialScheduleStudent } from '../transport_management/master_special_schedule';

const URL = 'bus/educational/institution_management/branch';

const ENDPOINTS = {
  // InstitutionBranch APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
  cache_child: (organisation_id: string): string => `${URL}/cache_child/${organisation_id}`,
};

// InstitutionBranch Interface
export interface InstitutionBranch extends Record<string, unknown> {
  // Primary Field
  institution_branch_id: string;

  // Main Field Details
  branch: string;
  city: string;
  branch_address: string;
  description: string;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  organisation_id: string;
  UserOrganisation?: UserOrganisation;
  organisation_name?: string;
  organisation_code?: string;
  organisation_logo_url?: string;

  // Relations - Child
  MasterVehicle?: MasterVehicle[];
  User?: User[];
  UserLoginPush?: UserLoginPush[];
  UserLoginAnalytics?: UserLoginAnalytics[];
  MasterDriver?: MasterDriver[];
  // MasterDriverLoginPush?: MasterDriverLoginPush[];
  // MasterDriverLoginAnalytics?: MasterDriverLoginAnalytics[];

  // Child - Institution Management
  OrganisationCalendar?: OrganisationCalendar[];
  OrganisationNoticeBoard?: OrganisationNoticeBoard[];

  Student?: Student[];
  StudentAddress?: StudentAddress[];
  StudentGuardian?: StudentGuardian[];
  StudentGuardianLink?: StudentGuardianLink[];
  StudentLeaveRequest?: StudentLeaveRequest[];
  StudentStopChangeRequest?: StudentStopChangeRequest[];
  StudentTransportPlanTypeChangeHistory?: StudentTransportPlanTypeChangeHistory[];

  StudentLoginPush?: StudentLoginPush[];
  StudentLoginAnalytics?: StudentLoginAnalytics[];
  StudentGuardianLoginPush?: StudentGuardianLoginPush[];
  StudentGuardianLoginAnalytics?: StudentGuardianLoginAnalytics[];

  // Child - Transport Management
  BusStop?: BusStop[];
  MasterRoute?: MasterRoute[];
  MasterRouteStop?: MasterRouteStop[];
  MasterDailySchedule?: MasterDailySchedule[];
  MasterDailyScheduleStudent?: MasterDailyScheduleStudent[];
  MasterSpecialSchedule?: MasterSpecialSchedule[];
  MasterSpecialScheduleStudent?: MasterSpecialScheduleStudent[];
  DailyScheduleDayRun?: DailyScheduleDayRun[];
  DailyScheduleDayRunStop?: DailyScheduleDayRunStop[];
  DailyScheduleDayRunStudent?: DailyScheduleDayRunStudent[];
  SpecialScheduleDayRun?: SpecialScheduleDayRun[];
  SpecialScheduleDayRunStop?: SpecialScheduleDayRunStop[];
  SpecialScheduleDayRunStudent?: SpecialScheduleDayRunStudent[];


  // Relations - Child Count
  _count?: {
    // Relations - Child
    MasterVehicle?: number;
    User?: number;
    UserLoginPush?: number;
    UserLoginAnalytics?: number;
    MasterDriver?: number;
    MasterDriverLoginPush?: number;
    MasterDriverLoginAnalytics?: number;

    // Child - Institution Management
    OrganisationCalendar?: number;
    OrganisationNoticeBoard?: number;

    Student?: number;
    StudentAddress?: number;
    StudentGuardian?: number;
    StudentGuardianLink?: number;
    StudentLeaveRequest?: number;
    StudentStopChangeRequest?: number;
    StudentTransportPlanTypeChangeHistory?: number;

    StudentLoginPush?: number;
    StudentLoginAnalytics?: number;
    StudentGuardianLoginPush?: number;
    StudentGuardianLoginAnalytics?: number;

    // Child - Transport Management
    BusStop?: number;
    MasterRoute?: number;
    MasterRouteStop?: number;
    MasterDailySchedule?: number;
    MasterDailyScheduleStudent?: number;
    MasterSpecialSchedule?: number;
    MasterSpecialScheduleStudent?: number;
    DailyScheduleDayRun?: number;
    DailyScheduleDayRunStop?: number;
    DailyScheduleDayRunStudent?: number;
    SpecialScheduleDayRun?: number;
    SpecialScheduleDayRunStop?: number;
    SpecialScheduleDayRunStudent?: number;
  };

}

// InstitutionBranch Create/Update Schema
export const InstitutionBranchSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation

  // Main Field Details
  branch: stringMandatory('Branch', 3, 100),
  city: stringMandatory('City', 3, 100),
  branch_address: stringMandatory('Branch Address', 3, 300),
  description: stringOptional('Description', 0, 300),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type InstitutionBranchDTO = z.infer<typeof InstitutionBranchSchema>;

// InstitutionBranch Query Schema
export const InstitutionBranchQuerySchema = BaseQuerySchema.extend({
  // Self Table
  institution_branch_ids: multi_select_optional('InstitutionBranch'), // Multi-selection -> InstitutionBranch

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
});
export type InstitutionBranchQueryDTO = z.infer<
  typeof InstitutionBranchQuerySchema
>;

// Convert InstitutionBranch Data to API Payload
export const toInstitutionBranchPayload = (row: InstitutionBranch): InstitutionBranchDTO => ({
  organisation_id: row.organisation_id || '',

  branch: row.branch || '',
  city: row.city || '',
  branch_address: row.branch_address || '',
  description: row.description || '',

  status: row.status || Status.Active,
});

// Create New InstitutionBranch Payload
export const newInstitutionBranchPayload = (): InstitutionBranchDTO => ({
  organisation_id: '',

  branch: '',
  city: '',
  branch_address: '',
  description: '',

  status: Status.Active,
});

// InstitutionBranch APIs
export const findInstitutionBranch = async (data: InstitutionBranchQueryDTO): Promise<FBR<InstitutionBranch[]>> => {
  return apiPost<FBR<InstitutionBranch[]>, InstitutionBranchQueryDTO>(ENDPOINTS.find, data);
};

export const createInstitutionBranch = async (data: InstitutionBranchDTO): Promise<SBR> => {
  return apiPost<SBR, InstitutionBranchDTO>(ENDPOINTS.create, data);
};

export const updateInstitutionBranch = async (id: string, data: InstitutionBranchDTO): Promise<SBR> => {
  return apiPatch<SBR, InstitutionBranchDTO>(ENDPOINTS.update(id), data);
};

export const deleteInstitutionBranch = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getInstitutionBranchCache = async (organisation_id: string): Promise<FBR<InstitutionBranch[]>> => {
  return apiGet<FBR<InstitutionBranch[]>>(ENDPOINTS.cache(organisation_id));
};

export const getInstitutionBranchCacheCount = async (organisation_id: string): Promise<FBR<InstitutionBranch[]>> => {
  return apiGet<FBR<InstitutionBranch[]>>(ENDPOINTS.cache_count(organisation_id));
};

export const getInstitutionBranchCacheChild = async (organisation_id: string): Promise<FBR<InstitutionBranch[]>> => {
  return apiGet<FBR<InstitutionBranch[]>>(ENDPOINTS.cache_child(organisation_id));
};
