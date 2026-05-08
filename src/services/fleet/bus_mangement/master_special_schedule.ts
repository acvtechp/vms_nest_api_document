// Axios
import { apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

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
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status, BusLeg, YesNo } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../main/users/user_organisation_service';
import { OrganisationBranch } from 'src/services/master/organisation/organisation_branch_service';
import { MasterDriver } from 'src/services/main/drivers/master_driver_service';
import { MasterVehicle } from 'src/services/main/vehicle/master_vehicle_service';
import { Student } from '../school_management/student_service';
import { MasterRoute, MasterRouteStop } from './master_route';

const URL = 'fleet/bus_management/master_special_schedule';

const ENDPOINTS = {
    find_special_schedule: `${URL}/search`,
    create_special_schedule: `${URL}`,
    update_special_schedule: (id: string): string => `${URL}/${id}`,
    delete_special_schedule: (id: string): string => `${URL}/${id}`,

    find_special_schedule_student: `${URL}/student/search`,
    assign_special_schedule_to_students: `${URL}/assign_special_schedule_to_students`,
    remove_special_schedule_to_students: `${URL}/remove_special_schedule_to_students`,
    update_special_schedule_stop: `${URL}/update_stop`,
};

// MasterSpecialSchedule Interface
export interface MasterSpecialSchedule extends Record<string, unknown> {
    special_schedule_id: string;

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

    organisation_branch_id: string;
    OrganisationBranch?: OrganisationBranch;
    branch_name?: string;
    branch_city?: string;

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
    MasterSpecialScheduleStudent?: MasterSpecialScheduleStudent[];

    // Relations - Child Count
    _count?: {
        MasterSpecialScheduleStudent?: number;
    };
}

// MasterSpecialScheduleStudent Interface
export interface MasterSpecialScheduleStudent extends Record<string, unknown> {
    special_schedule_student_id: string;

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

    organisation_branch_id: string;
    OrganisationBranch?: OrganisationBranch;
    branch_name?: string;
    branch_city?: string;

    student_id: string;
    Student?: Student;
    student_details?: string;
    student_photo_url?: string;

    special_schedule_id: string;
    MasterSpecialSchedule?: MasterSpecialSchedule;
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

// MasterSpecialSchedule Create/Update Schema
export const MasterSpecialScheduleSchema = z.object({
    organisation_id: single_select_mandatory('UserOrganisation'),
    organisation_branch_id: single_select_mandatory('OrganisationBranch'),

    route_id: single_select_mandatory('MasterRoute'),
    vehicle_id: single_select_mandatory('MasterVehicle'),
    driver_id: single_select_optional('Driver'),
    attendant_id: single_select_optional('Attendant'),

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

    status: enumMandatory('Status', Status, Status.Active),
    time_zone_id: single_select_mandatory('MasterMainTimeZone'),
});
export type MasterSpecialScheduleDTO = z.infer<
    typeof MasterSpecialScheduleSchema
>;

// MasterSpecialSchedule Query Schema
export const MasterSpecialScheduleQuerySchema = BaseQuerySchema.extend({
    special_schedule_ids: multi_select_optional('MasterSpecialSchedule'),

    organisation_ids: multi_select_optional('UserOrganisation'),
    organisation_branch_ids: multi_select_optional('OrganisationBranch'),

    route_ids: multi_select_optional('MasterRoute'),
    vehicle_ids: multi_select_optional('MasterVehicle'),
    driver_ids: multi_select_optional('Driver'),
    attendant_ids: multi_select_optional('Attendant'),

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
export type MasterSpecialScheduleQueryDTO = z.infer<
    typeof MasterSpecialScheduleQuerySchema
>;

// MasterSpecialScheduleStudent Query Schema
export const MasterSpecialScheduleStudentQuerySchema = BaseQuerySchema.extend({
    special_schedule_student_ids: multi_select_optional(
        'MasterSpecialScheduleStudent',
    ),

    organisation_ids: multi_select_optional('UserOrganisation'),
    organisation_branch_ids: multi_select_optional('OrganisationBranch'),

    student_ids: multi_select_optional('Student'),
    special_schedule_ids: multi_select_optional('MasterSpecialSchedule'),

    route_ids: multi_select_optional('MasterRoute'),
    route_stop_ids: multi_select_optional('MasterRouteStop'),

    leg: enumArrayOptional('Leg', BusLeg, getAllEnums(BusLeg)),
});
export type MasterSpecialScheduleStudentQueryDTO = z.infer<
    typeof MasterSpecialScheduleStudentQuerySchema
>;

export const AssignSpecialScheduleToStudentsSchema = z.object({
    special_schedule_id: single_select_mandatory('MasterSpecialSchedule'),
    student_ids: multi_select_optional('Student'),
});
export type AssignSpecialScheduleToStudentsDTO = z.infer<
    typeof AssignSpecialScheduleToStudentsSchema
>;

export const RemoveSpecialScheduleToStudentsSchema = z.object({
    special_schedule_id: single_select_mandatory('MasterSpecialSchedule'),
    student_ids: multi_select_optional('Student'),
});
export type RemoveSpecialScheduleToStudentsDTO = z.infer<
    typeof RemoveSpecialScheduleToStudentsSchema
>;

export const UpdateSpecialScheduleStopSchema = z.object({
    special_schedule_student_id: single_select_mandatory(
        'MasterSpecialScheduleStudent',
    ),
    route_stop_id: single_select_mandatory('MasterRouteStop'),
});
export type UpdateSpecialScheduleStopDTO = z.infer<
    typeof UpdateSpecialScheduleStopSchema
>;

// Convert MasterSpecialSchedule Data to API Payload
export const toMasterSpecialSchedulePayload = (row: MasterSpecialSchedule): MasterSpecialScheduleDTO => ({
    organisation_id: row.organisation_id || '',
    organisation_branch_id: row.organisation_branch_id || '',
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

// Create New MasterSpecialSchedule Payload
export const newMasterSpecialSchedulePayload = (): MasterSpecialScheduleDTO => ({
    organisation_id: '',
    organisation_branch_id: '',
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

// MasterSpecialSchedule APIs
export const findMasterSpecialSchedule = async (
    data: MasterSpecialScheduleQueryDTO,
): Promise<FBR<MasterSpecialSchedule[]>> => {
    return apiPost<FBR<MasterSpecialSchedule[]>, MasterSpecialScheduleQueryDTO>(
        ENDPOINTS.find_special_schedule,
        data,
    );
};

export const createMasterSpecialSchedule = async (
    data: MasterSpecialScheduleDTO,
): Promise<SBR> => {
    return apiPost<SBR, MasterSpecialScheduleDTO>(
        ENDPOINTS.create_special_schedule,
        data,
    );
};

export const updateMasterSpecialSchedule = async (
    id: string,
    data: MasterSpecialScheduleDTO,
): Promise<SBR> => {
    return apiPatch<SBR, MasterSpecialScheduleDTO>(
        ENDPOINTS.update_special_schedule(id),
        data,
    );
};

export const deleteMasterSpecialSchedule = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.delete_special_schedule(id));
};

export const findMasterSpecialScheduleStudent = async (
    data: MasterSpecialScheduleStudentQueryDTO,
): Promise<FBR<MasterSpecialScheduleStudent[]>> => {
    return apiPost<
        FBR<MasterSpecialScheduleStudent[]>,
        MasterSpecialScheduleStudentQueryDTO
    >(ENDPOINTS.find_special_schedule_student, data);
};

export const assignSpecialScheduleToStudents = async (
    data: AssignSpecialScheduleToStudentsDTO,
): Promise<SBR> => {
    return apiPost<SBR, AssignSpecialScheduleToStudentsDTO>(
        ENDPOINTS.assign_special_schedule_to_students,
        data,
    );
};

export const removeSpecialScheduleToStudents = async (
    data: RemoveSpecialScheduleToStudentsDTO,
): Promise<SBR> => {
    return apiPost<SBR, RemoveSpecialScheduleToStudentsDTO>(
        ENDPOINTS.remove_special_schedule_to_students,
        data,
    );
};

export const updateSpecialScheduleStop = async (
    data: UpdateSpecialScheduleStopDTO,
): Promise<SBR> => {
    return apiPost<SBR, UpdateSpecialScheduleStopDTO>(
        ENDPOINTS.update_special_schedule_stop,
        data,
    );
};
