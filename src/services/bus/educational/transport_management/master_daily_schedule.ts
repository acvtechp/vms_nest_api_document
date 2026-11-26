// Axios
import { apiPost, apiPatch, apiDelete } from '../../../../core/apiCall';
import { SBR, FBR } from '../../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
    stringMandatory,
    single_select_mandatory,
    single_select_optional,
    multi_select_optional,
    enumMandatory,
    enumArrayOptional,
    dateOptional,
    getAllEnums,
    stringOptional,
    numberMandatory,
    enumOptional,
} from '../../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../../zod_utils/zod_base_schema';

// Enums
import { Status, BusLeg, YesNo } from '../../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../../main/users/user_organisation_service';
import { InstitutionBranch } from '../institution_management/institution_branch_service';
import { MasterDriver } from 'src/services/main/drivers/master_driver_service';
import { MasterVehicle } from 'src/services/main/vehicle/master_vehicle_service';
import { Student } from '../institution_management/student_service';
import { MasterRoute, MasterRouteStop } from './master_route';

const URL = 'fleet/bus_management/master_daily_schedule';

const ENDPOINTS = {
    find_daily_schedule: `${URL}/search`,
    create_daily_schedule: `${URL}`,
    update_daily_schedule: (id: string): string => `${URL}/${id}`,
    delete_daily_schedule: (id: string): string => `${URL}/${id}`,

    find_daily_schedule_student: `${URL}/student/search`,
    assign_daily_schedule_to_students: `${URL}/assign_daily_schedule_to_students`,
    remove_daily_schedule_to_students: `${URL}/remove_daily_schedule_to_students`,
    update_daily_schedule_stop: `${URL}/update_stop`,
};

// MasterDailySchedule Interface
export interface MasterDailySchedule extends Record<string, unknown> {
    daily_schedule_id: string;

    schedule_name: string;
    schedule_status: Status;
    schedule_type: BusLeg;

    max_seating_count: number;

    start_time?: string;
    end_time?: string;

    schedule_plan_start_date?: string;
    schedule_plan_start_date_f?: string;
    schedule_plan_end_date?: string;
    schedule_plan_end_date_f?: string;

    sunday: YesNo;
    monday: YesNo;
    tuesday: YesNo;
    wednesday: YesNo;
    thursday: YesNo;
    friday: YesNo;
    saturday: YesNo;

    // Metadata
    status: Status;
    added_date_time?: string;
    modified_date_time?: string;

    // Relations - Parent
    organisation_id: string;
    UserOrganisation?: UserOrganisation;
    organisation_name?: string;
    organisation_code?: string;
    organisation_logo_url?: string;

    institution_branch_id: string;
    InstitutionBranch?: InstitutionBranch;
    branch?: string;
    city?: string;

    route_id: string;
    MasterRoute?: MasterRoute;
    route_name?: string;

    vehicle_id: string;
    MasterVehicle?: MasterVehicle;
    vehicle_number?: string;
    vehicle_type?: string;

    driver_id?: string;
    Driver?: MasterDriver;
    driver_details?: string;
    driver_image_url?: string;

    attendant_id?: string;
    Attendant?: MasterDriver;
    attendant_details?: string;
    attendant_image_url?: string;

    // Relations - Child
    MasterDailyScheduleStudent?: MasterDailyScheduleStudent[];

    // Relations - Child Count
    _count?: {
        MasterDailyScheduleStudent?: number;
    };
}

// MasterDailyScheduleStudent Interface
export interface MasterDailyScheduleStudent extends Record<string, unknown> {
    daily_schedule_student_id: string;

    leg: BusLeg;

    // Metadata
    status: Status;
    added_date_time?: string;
    modified_date_time?: string;

    // Relations - Parent
    organisation_id: string;
    UserOrganisation?: UserOrganisation;
    organisation_name?: string;
    organisation_code?: string;
    organisation_logo_url?: string;

    institution_branch_id: string;
    InstitutionBranch?: InstitutionBranch;
    branch?: string;
    city?: string;

    student_id: string;
    Student?: Student;
    student_details?: string;
    student_photo_url?: string;

    daily_schedule_id: string;
    MasterDailySchedule?: MasterDailySchedule;
    schedule_name?: string;

    route_id: string;
    MasterRoute?: MasterRoute;
    route_name?: string;

    route_stop_id?: string;
    MasterRouteStop?: MasterRouteStop;
    order_no?: string;
    stop_name?: string;

    _count?: Record<string, never>;
}

// MasterDailySchedule Create/Update Schema
export const MasterDailyScheduleSchema = z.object({
    organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation
    institution_branch_id: single_select_mandatory('InstitutionBranch'), // Single-Selection -> InstitutionBranch

    route_id: single_select_mandatory('MasterRoute'), // Single-Selection -> MasterRoute
    vehicle_id: single_select_mandatory('MasterVehicle'), // Single-Selection -> MasterVehicle
    driver_id: single_select_optional('Driver'), // Single-Selection -> MasterDriver
    attendant_id: single_select_optional('Attendant'), // Single-Selection -> MasterDriver

    schedule_name: stringMandatory('Schedule Name', 3, 100),
    schedule_status: enumMandatory('Schedule Status', Status, Status.Active),
    schedule_type: enumMandatory('Schedule Type', BusLeg, BusLeg.Pickup),
    max_seating_count: numberMandatory('Max Seating Count'),

    start_time: stringOptional('Start Time'),
    end_time: stringOptional('End Time'),

    schedule_plan_start_date: dateOptional('Schedule Plan Start Date'),
    schedule_plan_end_date: dateOptional('Schedule Plan End Date'),

    sunday: enumOptional('Sunday', YesNo, YesNo.No),
    monday: enumOptional('Monday', YesNo, YesNo.Yes),
    tuesday: enumOptional('Tuesday', YesNo, YesNo.Yes),
    wednesday: enumOptional('Wednesday', YesNo, YesNo.Yes),
    thursday: enumOptional('Thursday', YesNo, YesNo.Yes),
    friday: enumOptional('Friday', YesNo, YesNo.Yes),
    saturday: enumOptional('Saturday', YesNo, YesNo.Yes),

    // Metadata
    status: enumMandatory('Status', Status, Status.Active),

    // Other
    time_zone_id: single_select_mandatory('MasterMainTimeZone'),
});
export type MasterDailyScheduleDTO = z.infer<typeof MasterDailyScheduleSchema>;

// MasterDailySchedule Query Schema
export const MasterDailyScheduleQuerySchema = BaseQuerySchema.extend({
    // Self Table
    daily_schedule_ids: multi_select_optional('MasterDailySchedule'), // Multi-selection -> MasterDailySchedule

    // Relations - Parent
    organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
    institution_branch_ids: multi_select_optional('InstitutionBranch'), // Multi-selection -> InstitutionBranch

    route_ids: multi_select_optional('MasterRoute'), // Multi-selection -> MasterRoute
    vehicle_ids: multi_select_optional('MasterVehicle'), // Multi-selection -> MasterVehicle
    driver_ids: multi_select_optional('Driver'), // Multi-selection -> MasterDriver
    attendant_ids: multi_select_optional('Attendant'), // Multi-selection -> MasterDriver

    // Enums
    schedule_status: enumArrayOptional(
        'Schedule Status',
        Status,
        getAllEnums(Status),
    ),
    schedule_type: enumArrayOptional(
        'Schedule Type',
        BusLeg,
        getAllEnums(BusLeg),
    ),
});
export type MasterDailyScheduleQueryDTO = z.infer<
    typeof MasterDailyScheduleQuerySchema
>;

// MasterDailyScheduleStudent Query Schema
export const MasterDailyScheduleStudentQuerySchema = BaseQuerySchema.extend({
    // Self Table
    daily_schedule_student_ids: multi_select_optional(
        'MasterDailyScheduleStudent',
    ), // Multi-selection -> MasterDailyScheduleStudent

    // Relations - Parent
    organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
    institution_branch_ids: multi_select_optional('InstitutionBranch'), // Multi-selection -> InstitutionBranch

    student_ids: multi_select_optional('Student'), // Multi-selection -> Student
    daily_schedule_ids: multi_select_optional('MasterDailySchedule'), // Multi-selection -> MasterDailySchedule

    route_ids: multi_select_optional('MasterRoute'), // Multi-selection -> MasterRoute
    route_stop_ids: multi_select_optional('MasterRouteStop'), // Multi-selection -> MasterRouteStop

    // Enums
    leg: enumArrayOptional('Leg', BusLeg, getAllEnums(BusLeg)),
});
export type MasterDailyScheduleStudentQueryDTO = z.infer<
    typeof MasterDailyScheduleStudentQuerySchema
>;

export const AssignDailyScheduleToStudentsSchema = z.object({
    daily_schedule_id: single_select_mandatory('MasterDailySchedule'),
    student_ids: multi_select_optional('Student'),
});
export type AssignDailyScheduleToStudentsDTO = z.infer<
    typeof AssignDailyScheduleToStudentsSchema
>;

export const RemoveDailyScheduleToStudentsSchema = z.object({
    daily_schedule_id: single_select_mandatory('MasterDailySchedule'),
    student_ids: multi_select_optional('Student'),
});
export type RemoveDailyScheduleToStudentsDTO = z.infer<
    typeof RemoveDailyScheduleToStudentsSchema
>;

export const UpdateDailyScheduleStopSchema = z.object({
    daily_schedule_student_id: single_select_mandatory(
        'MasterDailyScheduleStudent',
    ),
    route_stop_id: single_select_mandatory('MasterRouteStop'),
});
export type UpdateDailyScheduleStopDTO = z.infer<
    typeof UpdateDailyScheduleStopSchema
>;

// Convert MasterDailySchedule Data to API Payload
export const toMasterDailySchedulePayload = (row: MasterDailySchedule): MasterDailyScheduleDTO => ({
    organisation_id: row.organisation_id || '',
    institution_branch_id: row.institution_branch_id || '',
    route_id: row.route_id || '',

    vehicle_id: row.vehicle_id || '',
    driver_id: row.driver_id || '',
    attendant_id: row.attendant_id || '',

    schedule_name: row.schedule_name || '',
    schedule_status: row.schedule_status || Status.Active,
    schedule_type: row.schedule_type || BusLeg.Pickup,
    max_seating_count: row.max_seating_count || 0,

    start_time: row.start_time || '00:00',
    end_time: row.end_time || '00:00',

    schedule_plan_start_date: row.schedule_plan_start_date || '',
    schedule_plan_end_date: row.schedule_plan_end_date || '',

    sunday: row.sunday || YesNo.No,
    monday: row.monday || YesNo.Yes,
    tuesday: row.tuesday || YesNo.Yes,
    wednesday: row.wednesday || YesNo.Yes,
    thursday: row.thursday || YesNo.Yes,
    friday: row.friday || YesNo.Yes,
    saturday: row.saturday || YesNo.Yes,

    status: row.status || Status.Active,
    time_zone_id: '', // Needs to be provided manually
});

// Create New MasterDailySchedule Payload
export const newMasterDailySchedulePayload = (): MasterDailyScheduleDTO => ({
    organisation_id: '',
    institution_branch_id: '',
    route_id: '',

    vehicle_id: '',
    driver_id: '',
    attendant_id: '',

    schedule_name: '',
    schedule_status: Status.Active,
    schedule_type: BusLeg.Pickup,
    max_seating_count: 0,

    start_time: '00:00',
    end_time: '00:00',

    schedule_plan_start_date: '',
    schedule_plan_end_date: '',

    sunday: YesNo.No,
    monday: YesNo.Yes,
    tuesday: YesNo.Yes,
    wednesday: YesNo.Yes,
    thursday: YesNo.Yes,
    friday: YesNo.Yes,
    saturday: YesNo.Yes,

    status: Status.Active,
    time_zone_id: '', // Needs to be provided manually
});

// MasterDailySchedule APIs
export const findMasterDailySchedule = async (data: MasterDailyScheduleQueryDTO,): Promise<FBR<MasterDailySchedule[]>> => {
    return apiPost<FBR<MasterDailySchedule[]>, MasterDailyScheduleQueryDTO>(ENDPOINTS.find_daily_schedule, data,);
};

export const createMasterDailySchedule = async (
    data: MasterDailyScheduleDTO,
): Promise<SBR> => {
    return apiPost<SBR, MasterDailyScheduleDTO>(
        ENDPOINTS.create_daily_schedule,
        data,
    );
};

export const updateMasterDailySchedule = async (
    id: string,
    data: MasterDailyScheduleDTO,
): Promise<SBR> => {
    return apiPatch<SBR, MasterDailyScheduleDTO>(
        ENDPOINTS.update_daily_schedule(id),
        data,
    );
};

export const deleteMasterDailySchedule = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.delete_daily_schedule(id));
};

export const findMasterDailyScheduleStudent = async (
    data: MasterDailyScheduleStudentQueryDTO,
): Promise<FBR<MasterDailyScheduleStudent[]>> => {
    return apiPost<
        FBR<MasterDailyScheduleStudent[]>,
        MasterDailyScheduleStudentQueryDTO
    >(ENDPOINTS.find_daily_schedule_student, data);
};

export const assignDailyScheduleToStudents = async (
    data: AssignDailyScheduleToStudentsDTO,
): Promise<SBR> => {
    return apiPost<SBR, AssignDailyScheduleToStudentsDTO>(
        ENDPOINTS.assign_daily_schedule_to_students,
        data,
    );
};

export const removeDailyScheduleToStudents = async (
    data: RemoveDailyScheduleToStudentsDTO,
): Promise<SBR> => {
    return apiPost<SBR, RemoveDailyScheduleToStudentsDTO>(
        ENDPOINTS.remove_daily_schedule_to_students,
        data,
    );
};

export const updateDailyScheduleStop = async (
    data: UpdateDailyScheduleStopDTO,
): Promise<SBR> => {
    return apiPost<SBR, UpdateDailyScheduleStopDTO>(
        ENDPOINTS.update_daily_schedule_stop,
        data,
    );
};
