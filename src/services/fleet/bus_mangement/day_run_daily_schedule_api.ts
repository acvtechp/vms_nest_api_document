// Axios
import { apiPost, apiPatch, apiDelete, apiGet } from '../../../core/apiCall';
import { SBR, FBR, AWSPresignedUrl, BR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
    single_select_mandatory,
    single_select_optional,
    multi_select_optional,
    enumMandatory,
    enumArrayOptional,
    dateMandatory,
    dateOptional,
    getAllEnums,
    stringOptional,
    numberMandatory,
    numberOptional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import {
    AttendanceMethod,
    BusLeg,
    DayRunRunningStatus,
    DayRunStatus,
    DayRunStopStatus,
    Status,
    StudentLegStatus,
} from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../main/users/user_organisation_service';
import { OrganisationBranch } from 'src/services/master/organisation/organisation_branch_service';
import { MasterDriver } from 'src/services/main/drivers/master_driver_service';
import { MasterVehicle } from 'src/services/main/vehicle/master_vehicle_service';
import { Student } from '../school_management/student_service';
import { MasterRoute } from './master_route';
import { BusStop } from './bus_stop';
import { MasterDailySchedule } from './master_daily_schedule';

const URL = 'fleet/bus_management/day_run_daily_schedule';

const ENDPOINTS = {
    get_student_attendance_presigned_url: (file_name: string): string =>
        `${URL}/get_student_attendance_presigned_url/${encodeURIComponent(file_name)}`,

    find_day_run: `${URL}/run/search`,
    create_day_run: `${URL}/run`,
    update_day_run: (id: string): string => `${URL}/run/${id}`,
    delete_day_run: (id: string): string => `${URL}/run/${id}`,

    find_day_run_stop: `${URL}/stop/search`,
    create_day_run_stop: `${URL}/stop`,
    update_day_run_stop: (id: string): string => `${URL}/stop/${id}`,
    delete_day_run_stop: (id: string): string => `${URL}/stop/${id}`,

    find_day_run_student: `${URL}/student/search`,
    create_day_run_student: `${URL}/student`,
    update_day_run_student: (id: string): string => `${URL}/student/${id}`,
    delete_day_run_student: (id: string): string => `${URL}/student/${id}`,

    generate_day_run: `${URL}/generate_day_run`,
    start_day_run: `${URL}/start_day_run`,
    end_day_run: `${URL}/end_day_run`,
    cancel_day_run: `${URL}/cancel_day_run`,
    update_planned_absent: `${URL}/update_planned_absent`,
    refresh_day_run_counts: `${URL}/refresh_day_run_counts`,
    arrive_stop: `${URL}/arrive_stop`,
    depart_stop: `${URL}/depart_stop`,
    skip_stop: `${URL}/skip_stop`,
    mark_student: `${URL}/mark_student`,
};

export interface StudentAttendancePresignedUrl extends Record<string, unknown> {
    presigned_url: string;
    file_url: string;
    file_key: string;
}

// DailyScheduleDayRun Interface
export interface DailyScheduleDayRun extends Record<string, unknown> {
    daily_schedule_day_run_id: string;

    run_date: string;
    run_date_f?: string;
    schedule_type: BusLeg;

    start_planned_date_time?: string;
    start_planned_date_time_f?: string;
    end_planned_date_time?: string;
    end_planned_date_time_f?: string;
    start_actual_date_time?: string;
    start_actual_date_time_f?: string;
    end_actual_date_time?: string;
    end_actual_date_time_f?: string;

    planned_stops_count?: number;
    covered_stops_count?: number;
    planned_student_count?: number;
    marked_student_count?: number;

    day_run_status: DayRunStatus;
    running_status: DayRunRunningStatus;
    running_delay_seconds?: number;
    notes?: string;
    cancel_reason?: string;

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

    daily_schedule_id: string;
    MasterDailySchedule?: MasterDailySchedule;
    schedule_name?: string;

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
    DailyScheduleDayRunStop?: DailyScheduleDayRunStop[];
    DailyScheduleDayRunStudent?: DailyScheduleDayRunStudent[];

    // Relations - Child Count
    _count?: {
        DailyScheduleDayRunStop?: number;
        DailyScheduleDayRunStudent?: number;
    };
}

// DailyScheduleDayRunStop Interface
export interface DailyScheduleDayRunStop extends Record<string, unknown> {
    daily_schedule_day_run_stop_id: string;

    order_no: number;

    planned_arrival_time?: string;
    planned_arrival_time_f?: string;
    planned_departure_time?: string;
    planned_departure_time_f?: string;
    planned_stop_duration_seconds?: number;

    actual_arrival_time?: string;
    actual_arrival_time_f?: string;
    actual_departure_time?: string;
    actual_departure_time_f?: string;
    actual_stop_duration_seconds?: number;

    stop_status: DayRunStopStatus;
    planned_student_count?: number;
    marked_student_count?: number;

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

    daily_schedule_id: string;
    MasterDailySchedule?: MasterDailySchedule;
    schedule_name?: string;

    daily_schedule_day_run_id: string;
    DailyScheduleDayRun?: DailyScheduleDayRun;

    bus_stop_id: string;
    BusStop?: BusStop;
    stop_name?: string;
    geofence_type?: string;
    radius_m?: number;
    radius_km?: number;
    latitude?: number;
    longitude?: number;
    poliline_data?: unknown;
    polyline_data?: unknown;

    // Relations - Child
    FSDRS_Planned_DailyScheduleDayRunStop?: DailyScheduleDayRunStudent[];
    FSDRS_Actual_DailyScheduleDayRunStop?: DailyScheduleDayRunStudent[];

    _count?: Record<string, number>;
}

// DailyScheduleDayRunStudent Interface
export interface DailyScheduleDayRunStudent extends Record<string, unknown> {
    daily_schedule_day_run_student_id: string;

    student_boarding_status: StudentLegStatus;
    method: AttendanceMethod;
    mark_time?: string;
    mark_time_f?: string;
    note?: string;

    student_attendance_image_url?: string;
    student_attendance_image_key?: string;
    student_attendance_image_name?: string;

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

    daily_schedule_id: string;
    MasterDailySchedule?: MasterDailySchedule;
    schedule_name?: string;

    daily_schedule_day_run_id: string;
    DailyScheduleDayRun?: DailyScheduleDayRun;

    planned_daily_schedule_day_run_stop_id?: string;
    Planned_DailyScheduleDayRunStop?: DailyScheduleDayRunStop;

    actual_daily_schedule_day_run_stop_id?: string;
    Actual_DailyScheduleDayRunStop?: DailyScheduleDayRunStop;

    student_id: string;
    Student?: Student;
    student_details?: string;
    student_photo_url?: string;

    _count?: Record<string, never>;
}

// DailyScheduleDayRun Create/Update Schema
export const DailyScheduleDayRunSchema = z.object({
    run_date: dateMandatory('Run Date'),
    schedule_type: enumMandatory('Schedule Type', BusLeg, BusLeg.Pickup),

    start_planned_date_time: stringOptional('Start Planned Date Time'),
    end_planned_date_time: stringOptional('End Planned Date Time'),
    start_actual_date_time: stringOptional('Start Actual Date Time'),
    end_actual_date_time: stringOptional('End Actual Date Time'),

    planned_stops_count: numberOptional('Planned Stops Count'),
    covered_stops_count: numberOptional('Covered Stops Count'),
    planned_student_count: numberOptional('Planned Student Count'),
    marked_student_count: numberOptional('Marked Student Count'),

    day_run_status: enumMandatory('Day Run Status', DayRunStatus, DayRunStatus.Planned),
    running_status: enumMandatory('Running Status', DayRunRunningStatus, DayRunRunningStatus.OnTime),
    running_delay_seconds: numberOptional('Running Delay Seconds'),
    notes: stringOptional('Notes', 0, 500),
    cancel_reason: stringOptional('Cancel Reason', 0, 500),

    organisation_id: single_select_mandatory('UserOrganisation'),
    organisation_branch_id: single_select_mandatory('OrganisationBranch'),
    route_id: single_select_mandatory('MasterRoute'),
    daily_schedule_id: single_select_mandatory('MasterDailySchedule'),
    vehicle_id: single_select_mandatory('MasterVehicle'),
    driver_id: single_select_optional('Driver'),
    attendant_id: single_select_optional('Attendant'),

    status: enumMandatory('Status', Status, Status.Active),
    time_zone_id: single_select_mandatory('MasterMainTimeZone'),
});
export type DailyScheduleDayRunDTO = z.infer<typeof DailyScheduleDayRunSchema>;

// DailyScheduleDayRun Query Schema
export const DailyScheduleDayRunQuerySchema = BaseQuerySchema.extend({
    daily_schedule_day_run_ids: multi_select_optional('DailyScheduleDayRun'),

    organisation_ids: multi_select_optional('UserOrganisation'),
    organisation_branch_ids: multi_select_optional('OrganisationBranch'),

    route_ids: multi_select_optional('MasterRoute'),
    daily_schedule_ids: multi_select_optional('MasterDailySchedule'),
    vehicle_ids: multi_select_optional('MasterVehicle'),
    driver_ids: multi_select_optional('Driver'),
    attendant_ids: multi_select_optional('Attendant'),

    schedule_type: enumArrayOptional('Schedule Type', BusLeg, getAllEnums(BusLeg)),
    day_run_status: enumArrayOptional('Day Run Status', DayRunStatus, getAllEnums(DayRunStatus)),
    running_status: enumArrayOptional('Running Status', DayRunRunningStatus, getAllEnums(DayRunRunningStatus)),

    run_date_from: dateOptional('Run Date From'),
    run_date_to: dateOptional('Run Date To'),
});
export type DailyScheduleDayRunQueryDTO = z.infer<typeof DailyScheduleDayRunQuerySchema>;

// DailyScheduleDayRunStop Create/Update Schema
export const DailyScheduleDayRunStopSchema = z.object({
    daily_schedule_day_run_id: single_select_mandatory('DailyScheduleDayRun'),
    bus_stop_id: single_select_mandatory('BusStop'),

    order_no: numberMandatory('Order No'),

    planned_arrival_time: stringOptional('Planned Arrival Time'),
    planned_departure_time: stringOptional('Planned Departure Time'),
    planned_stop_duration_seconds: numberOptional('Planned Stop Duration Seconds'),

    actual_arrival_time: stringOptional('Actual Arrival Time'),
    actual_departure_time: stringOptional('Actual Departure Time'),
    actual_stop_duration_seconds: numberOptional('Actual Stop Duration Seconds'),

    stop_status: enumMandatory('Stop Status', DayRunStopStatus, DayRunStopStatus.Pending),
    planned_student_count: numberOptional('Planned Student Count'),
    marked_student_count: numberOptional('Marked Student Count'),

    status: enumMandatory('Status', Status, Status.Active),
    time_zone_id: single_select_optional('MasterMainTimeZone'),
});
export type DailyScheduleDayRunStopDTO = z.infer<typeof DailyScheduleDayRunStopSchema>;

// DailyScheduleDayRunStop Query Schema
export const DailyScheduleDayRunStopQuerySchema = BaseQuerySchema.extend({
    daily_schedule_day_run_stop_ids: multi_select_optional('DailyScheduleDayRunStop'),

    organisation_ids: multi_select_optional('UserOrganisation'),
    organisation_branch_ids: multi_select_optional('OrganisationBranch'),

    route_ids: multi_select_optional('MasterRoute'),
    daily_schedule_ids: multi_select_optional('MasterDailySchedule'),
    daily_schedule_day_run_ids: multi_select_optional('DailyScheduleDayRun'),
    bus_stop_ids: multi_select_optional('BusStop'),

    stop_status: enumArrayOptional('Stop Status', DayRunStopStatus, getAllEnums(DayRunStopStatus)),
});
export type DailyScheduleDayRunStopQueryDTO = z.infer<typeof DailyScheduleDayRunStopQuerySchema>;

// DailyScheduleDayRunStudent Create/Update Schema
export const DailyScheduleDayRunStudentSchema = z.object({
    daily_schedule_day_run_id: single_select_mandatory('DailyScheduleDayRun'),
    student_id: single_select_mandatory('Student'),

    planned_daily_schedule_day_run_stop_id: single_select_optional('Planned_DailyScheduleDayRunStop'),
    actual_daily_schedule_day_run_stop_id: single_select_optional('Actual_DailyScheduleDayRunStop'),

    student_boarding_status: enumMandatory('Student Boarding Status', StudentLegStatus, StudentLegStatus.Planned),
    method: enumMandatory('Attendance Method', AttendanceMethod, AttendanceMethod.None),
    mark_time: stringOptional('Mark Time'),
    note: stringOptional('Note', 0, 500),

    student_attendance_image_url: stringOptional('Student Attendance Image URL', 0, 300),
    student_attendance_image_key: stringOptional('Student Attendance Image Key', 0, 300),
    student_attendance_image_name: stringOptional('Student Attendance Image Name', 0, 300),

    status: enumMandatory('Status', Status, Status.Active),
    time_zone_id: single_select_optional('MasterMainTimeZone'),
});
export type DailyScheduleDayRunStudentDTO = z.infer<typeof DailyScheduleDayRunStudentSchema>;

// DailyScheduleDayRunStudent Query Schema
export const DailyScheduleDayRunStudentQuerySchema = BaseQuerySchema.extend({
    daily_schedule_day_run_student_ids: multi_select_optional('DailyScheduleDayRunStudent'),

    organisation_ids: multi_select_optional('UserOrganisation'),
    organisation_branch_ids: multi_select_optional('OrganisationBranch'),

    route_ids: multi_select_optional('MasterRoute'),
    daily_schedule_ids: multi_select_optional('MasterDailySchedule'),
    daily_schedule_day_run_ids: multi_select_optional('DailyScheduleDayRun'),
    planned_daily_schedule_day_run_stop_ids: multi_select_optional('Planned_DailyScheduleDayRunStop'),
    actual_daily_schedule_day_run_stop_ids: multi_select_optional('Actual_DailyScheduleDayRunStop'),
    student_ids: multi_select_optional('Student'),

    student_boarding_status: enumArrayOptional('Student Boarding Status', StudentLegStatus, getAllEnums(StudentLegStatus)),
    method: enumArrayOptional('Attendance Method', AttendanceMethod, getAllEnums(AttendanceMethod)),
});
export type DailyScheduleDayRunStudentQueryDTO = z.infer<typeof DailyScheduleDayRunStudentQuerySchema>;

// Action Schemas
export const GenerateDailyScheduleDayRunSchema = z.object({
    daily_schedule_id: single_select_mandatory('MasterDailySchedule'),
    run_date: dateMandatory('Run Date'),
    time_zone_id: single_select_mandatory('MasterMainTimeZone'),
});
export type GenerateDailyScheduleDayRunDTO = z.infer<typeof GenerateDailyScheduleDayRunSchema>;

export const DailyScheduleDayRunIdSchema = z.object({
    daily_schedule_day_run_id: single_select_mandatory('DailyScheduleDayRun'),
    time_zone_id: single_select_optional('MasterMainTimeZone'),
});
export type DailyScheduleDayRunIdDTO = z.infer<typeof DailyScheduleDayRunIdSchema>;

export const CancelDailyScheduleDayRunSchema = z.object({
    daily_schedule_day_run_id: single_select_mandatory('DailyScheduleDayRun'),
    cancel_reason: stringOptional('Cancel Reason', 0, 500),
    time_zone_id: single_select_optional('MasterMainTimeZone'),
});
export type CancelDailyScheduleDayRunDTO = z.infer<typeof CancelDailyScheduleDayRunSchema>;

export const DailyScheduleDayRunStopIdSchema = z.object({
    daily_schedule_day_run_stop_id: single_select_mandatory('DailyScheduleDayRunStop'),
    actual_time: stringOptional('Actual Time'),
    time_zone_id: single_select_optional('MasterMainTimeZone'),
});
export type DailyScheduleDayRunStopIdDTO = z.infer<typeof DailyScheduleDayRunStopIdSchema>;

export const MarkDailyScheduleDayRunStudentSchema = z.object({
    daily_schedule_day_run_student_id: single_select_mandatory('DailyScheduleDayRunStudent'),
    student_boarding_status: enumMandatory('Student Boarding Status', StudentLegStatus, StudentLegStatus.Boarded),
    method: enumMandatory('Attendance Method', AttendanceMethod, AttendanceMethod.Manual),
    actual_daily_schedule_day_run_stop_id: single_select_optional('Actual_DailyScheduleDayRunStop'),
    mark_time: stringOptional('Mark Time'),
    note: stringOptional('Note', 0, 500),
    student_attendance_image_url: stringOptional('Student Attendance Image URL', 0, 300),
    student_attendance_image_key: stringOptional('Student Attendance Image Key', 0, 300),
    student_attendance_image_name: stringOptional('Student Attendance Image Name', 0, 300),
    time_zone_id: single_select_optional('MasterMainTimeZone'),
});
export type MarkDailyScheduleDayRunStudentDTO = z.infer<typeof MarkDailyScheduleDayRunStudentSchema>;

// Convert DailyScheduleDayRun Data to API Payload
export const toDailyScheduleDayRunPayload = (row: DailyScheduleDayRun): DailyScheduleDayRunDTO => ({
    run_date: row.run_date || '',
    schedule_type: row.schedule_type || BusLeg.Pickup,
    start_planned_date_time: row.start_planned_date_time || '',
    end_planned_date_time: row.end_planned_date_time || '',
    start_actual_date_time: row.start_actual_date_time || '',
    end_actual_date_time: row.end_actual_date_time || '',
    planned_stops_count: row.planned_stops_count || 0,
    covered_stops_count: row.covered_stops_count || 0,
    planned_student_count: row.planned_student_count || 0,
    marked_student_count: row.marked_student_count || 0,
    day_run_status: row.day_run_status || DayRunStatus.Planned,
    running_status: row.running_status || DayRunRunningStatus.OnTime,
    running_delay_seconds: row.running_delay_seconds || 0,
    notes: row.notes || '',
    cancel_reason: row.cancel_reason || '',
    organisation_id: row.organisation_id || '',
    organisation_branch_id: row.organisation_branch_id || '',
    route_id: row.route_id || '',
    daily_schedule_id: row.daily_schedule_id || '',
    vehicle_id: row.vehicle_id || '',
    driver_id: row.driver_id || '',
    attendant_id: row.attendant_id || '',
    status: row.status || Status.Active,
    time_zone_id: '',
});

export const newDailyScheduleDayRunPayload = (): DailyScheduleDayRunDTO => ({
    run_date: '',
    schedule_type: BusLeg.Pickup,
    start_planned_date_time: '',
    end_planned_date_time: '',
    start_actual_date_time: '',
    end_actual_date_time: '',
    planned_stops_count: 0,
    covered_stops_count: 0,
    planned_student_count: 0,
    marked_student_count: 0,
    day_run_status: DayRunStatus.Planned,
    running_status: DayRunRunningStatus.OnTime,
    running_delay_seconds: 0,
    notes: '',
    cancel_reason: '',
    organisation_id: '',
    organisation_branch_id: '',
    route_id: '',
    daily_schedule_id: '',
    vehicle_id: '',
    driver_id: '',
    attendant_id: '',
    status: Status.Active,
    time_zone_id: '',
});

export const toDailyScheduleDayRunStopPayload = (row: DailyScheduleDayRunStop): DailyScheduleDayRunStopDTO => ({
    daily_schedule_day_run_id: row.daily_schedule_day_run_id || '',
    bus_stop_id: row.bus_stop_id || '',
    order_no: row.order_no || 0,
    planned_arrival_time: row.planned_arrival_time || '',
    planned_departure_time: row.planned_departure_time || '',
    planned_stop_duration_seconds: row.planned_stop_duration_seconds || 0,
    actual_arrival_time: row.actual_arrival_time || '',
    actual_departure_time: row.actual_departure_time || '',
    actual_stop_duration_seconds: row.actual_stop_duration_seconds || 0,
    stop_status: row.stop_status || DayRunStopStatus.Pending,
    planned_student_count: row.planned_student_count || 0,
    marked_student_count: row.marked_student_count || 0,
    status: row.status || Status.Active,
    time_zone_id: '',
});

export const newDailyScheduleDayRunStopPayload = (): DailyScheduleDayRunStopDTO => ({
    daily_schedule_day_run_id: '',
    bus_stop_id: '',
    order_no: 0,
    planned_arrival_time: '',
    planned_departure_time: '',
    planned_stop_duration_seconds: 0,
    actual_arrival_time: '',
    actual_departure_time: '',
    actual_stop_duration_seconds: 0,
    stop_status: DayRunStopStatus.Pending,
    planned_student_count: 0,
    marked_student_count: 0,
    status: Status.Active,
    time_zone_id: '',
});

export const toDailyScheduleDayRunStudentPayload = (row: DailyScheduleDayRunStudent): DailyScheduleDayRunStudentDTO => ({
    daily_schedule_day_run_id: row.daily_schedule_day_run_id || '',
    student_id: row.student_id || '',
    planned_daily_schedule_day_run_stop_id: row.planned_daily_schedule_day_run_stop_id || '',
    actual_daily_schedule_day_run_stop_id: row.actual_daily_schedule_day_run_stop_id || '',
    student_boarding_status: row.student_boarding_status || StudentLegStatus.Planned,
    method: row.method || AttendanceMethod.None,
    mark_time: row.mark_time || '',
    note: row.note || '',
    student_attendance_image_url: row.student_attendance_image_url || '',
    student_attendance_image_key: row.student_attendance_image_key || '',
    student_attendance_image_name: row.student_attendance_image_name || '',
    status: row.status || Status.Active,
    time_zone_id: '',
});

export const newDailyScheduleDayRunStudentPayload = (): DailyScheduleDayRunStudentDTO => ({
    daily_schedule_day_run_id: '',
    student_id: '',
    planned_daily_schedule_day_run_stop_id: '',
    actual_daily_schedule_day_run_stop_id: '',
    student_boarding_status: StudentLegStatus.Planned,
    method: AttendanceMethod.None,
    mark_time: '',
    note: '',
    student_attendance_image_url: '',
    student_attendance_image_key: '',
    student_attendance_image_name: '',
    status: Status.Active,
    time_zone_id: '',
});

// DailyScheduleDayRun APIs
export const get_student_attendance_presigned_url = async (file_name: string): Promise<BR<AWSPresignedUrl>> => {
    return apiGet<BR<AWSPresignedUrl>>(ENDPOINTS.get_student_attendance_presigned_url(file_name));
};

export const findDailyScheduleDayRun = async (data: DailyScheduleDayRunQueryDTO): Promise<FBR<DailyScheduleDayRun[]>> => {
    return apiPost<FBR<DailyScheduleDayRun[]>, DailyScheduleDayRunQueryDTO>(ENDPOINTS.find_day_run, data);
};

export const createDailyScheduleDayRun = async (data: DailyScheduleDayRunDTO): Promise<SBR> => {
    return apiPost<SBR, DailyScheduleDayRunDTO>(ENDPOINTS.create_day_run, data);
};

export const updateDailyScheduleDayRun = async (id: string, data: DailyScheduleDayRunDTO): Promise<SBR> => {
    return apiPatch<SBR, DailyScheduleDayRunDTO>(ENDPOINTS.update_day_run(id), data);
};

export const deleteDailyScheduleDayRun = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.delete_day_run(id));
};

export const findDailyScheduleDayRunStop = async (data: DailyScheduleDayRunStopQueryDTO): Promise<FBR<DailyScheduleDayRunStop[]>> => {
    return apiPost<FBR<DailyScheduleDayRunStop[]>, DailyScheduleDayRunStopQueryDTO>(ENDPOINTS.find_day_run_stop, data);
};

export const createDailyScheduleDayRunStop = async (data: DailyScheduleDayRunStopDTO): Promise<SBR> => {
    return apiPost<SBR, DailyScheduleDayRunStopDTO>(ENDPOINTS.create_day_run_stop, data);
};

export const updateDailyScheduleDayRunStop = async (id: string, data: DailyScheduleDayRunStopDTO): Promise<SBR> => {
    return apiPatch<SBR, DailyScheduleDayRunStopDTO>(ENDPOINTS.update_day_run_stop(id), data);
};

export const deleteDailyScheduleDayRunStop = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.delete_day_run_stop(id));
};

export const findDailyScheduleDayRunStudent = async (data: DailyScheduleDayRunStudentQueryDTO): Promise<FBR<DailyScheduleDayRunStudent[]>> => {
    return apiPost<FBR<DailyScheduleDayRunStudent[]>, DailyScheduleDayRunStudentQueryDTO>(ENDPOINTS.find_day_run_student, data);
};

export const createDailyScheduleDayRunStudent = async (data: DailyScheduleDayRunStudentDTO): Promise<SBR> => {
    return apiPost<SBR, DailyScheduleDayRunStudentDTO>(ENDPOINTS.create_day_run_student, data);
};

export const updateDailyScheduleDayRunStudent = async (id: string, data: DailyScheduleDayRunStudentDTO): Promise<SBR> => {
    return apiPatch<SBR, DailyScheduleDayRunStudentDTO>(ENDPOINTS.update_day_run_student(id), data);
};

export const deleteDailyScheduleDayRunStudent = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.delete_day_run_student(id));
};

export const generateDailyScheduleDayRun = async (data: GenerateDailyScheduleDayRunDTO): Promise<SBR> => {
    return apiPost<SBR, GenerateDailyScheduleDayRunDTO>(ENDPOINTS.generate_day_run, data);
};

export const startDailyScheduleDayRun = async (data: DailyScheduleDayRunIdDTO): Promise<SBR> => {
    return apiPost<SBR, DailyScheduleDayRunIdDTO>(ENDPOINTS.start_day_run, data);
};

export const endDailyScheduleDayRun = async (data: DailyScheduleDayRunIdDTO): Promise<SBR> => {
    return apiPost<SBR, DailyScheduleDayRunIdDTO>(ENDPOINTS.end_day_run, data);
};

export const cancelDailyScheduleDayRun = async (data: CancelDailyScheduleDayRunDTO): Promise<SBR> => {
    return apiPost<SBR, CancelDailyScheduleDayRunDTO>(ENDPOINTS.cancel_day_run, data);
};

export const updateDailyScheduleDayRunPlannedAbsent = async (data: DailyScheduleDayRunIdDTO): Promise<SBR> => {
    return apiPost<SBR, DailyScheduleDayRunIdDTO>(ENDPOINTS.update_planned_absent, data);
};

export const refreshDailyScheduleDayRunCounts = async (data: DailyScheduleDayRunIdDTO): Promise<SBR> => {
    return apiPost<SBR, DailyScheduleDayRunIdDTO>(ENDPOINTS.refresh_day_run_counts, data);
};

export const arriveDailyScheduleDayRunStop = async (data: DailyScheduleDayRunStopIdDTO): Promise<SBR> => {
    return apiPost<SBR, DailyScheduleDayRunStopIdDTO>(ENDPOINTS.arrive_stop, data);
};

export const departDailyScheduleDayRunStop = async (data: DailyScheduleDayRunStopIdDTO): Promise<SBR> => {
    return apiPost<SBR, DailyScheduleDayRunStopIdDTO>(ENDPOINTS.depart_stop, data);
};

export const skipDailyScheduleDayRunStop = async (data: DailyScheduleDayRunStopIdDTO): Promise<SBR> => {
    return apiPost<SBR, DailyScheduleDayRunStopIdDTO>(ENDPOINTS.skip_stop, data);
};

export const markDailyScheduleDayRunStudent = async (data: MarkDailyScheduleDayRunStudentDTO): Promise<SBR> => {
    return apiPost<SBR, MarkDailyScheduleDayRunStudentDTO>(ENDPOINTS.mark_student, data);
};
