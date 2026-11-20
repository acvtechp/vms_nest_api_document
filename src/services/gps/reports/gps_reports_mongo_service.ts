// Axios
import { apiPost } from '../../../core/apiCall';
import { FBR } from '../../../core/BaseResponse';
import { GpsAnalytics, GpsAnalyticsSummary } from '../../../services/gps/reports/gps_models/GpsAnalytics';
import { GpsPacket } from '../../../services/gps/reports/gps_models/GpsPacket';
import { GpsSensor } from '../../../services/gps/reports/gps_models/GpsSensor';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  single_select_mandatory,
  numberMandatory,
  multi_select_mandatory,
  dateMandatory,
  enumOptional,
  dateTimeMandatory,
  enumMandatory,
  multi_select_optional,
  enumArrayOptional,
  getAllEnums,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema, MongoBaseQuerySchema } from '../../../zod_utils/zod_base_schema';

import { TimeSlot, NightDriving, OverSpeed, GPSType, YesNo, BooleanType, Module, AlertType, AlertSubType } from '../../../core/Enums';
import { GPSOverSpeedViolation } from './gps_models/GPSOverSpeedViolation';
import { OverSpeedViolationMonthly } from './gps_models/OverSpeedViolationMonthly';
import { HourlyKmAnalysis } from './gps_models/HourlyKmAnalysis';
import { DashboardSummaryReport } from './gps_models/DashboardSummaryReport';
import { KilometerMonthly, KilometerYearly } from './gps_models/KilometerMonthly';
import { GpsAlert } from './gps_models/GpsAlert';

const URL = 'gps/reports';

const ENDPOINTS = {
  // FBR -> GpsAnalytics
  all_vehicles_24_hours_analysis_report: `${URL}/all_vehicles_24_hours_analysis_report`,
  all_vehicles_24_hours_analysis_summary_report: `${URL}/all_vehicles_24_hours_analysis_summary_report`,
  all_drivers_performance_report: `${URL}/all_drivers_performance_report`,
  monthly_kilometers_summary_report: `${URL}/monthly_kilometers_summary_report`,
  yearly_kilometers_summary_report: `${URL}/yearly_kilometers_summary_report`,
  vehicle_hourly_kilometers_report: `${URL}/vehicle_hourly_kilometers_report`,

  // FBR -> GpsAnalytics -> OverSpeed
  all_vehicles_over_speed_violation_report: `${URL}/all_vehicles_over_speed_violation_report`,
  all_drivers_over_speed_violation_report: `${URL}/all_drivers_over_speed_violation_report`,
  monthly_over_speed_summary_report: `${URL}/monthly_over_speed_summary_report`,

  // FBR -> GpsSensor
  vehicle_stoppage_track_report: `${URL}/vehicle_stoppage_track_report`,
  ignition_sensor_report: `${URL}/ignition_sensor_report`,
  genset_sensor_report: `${URL}/genset_sensor_report`,
  door_sensor_report: `${URL}/door_sensor_report`,

  // FBR -> GPSAlert
  gps_alert_notifications: `${URL}/gps_alert_notifications`,

  // FBR -> GpsPacket
  vehicle_gps_raw_data_report: `${URL}/vehicle_gps_raw_data_report`,
  vehicle_track_history_report: `${URL}/vehicle_track_history_report`,

  // SBR -> GpsPacket and GpsAnalytics
  vehicle_dashboard_summary_report: `${URL}/vehicle_dashboard_summary_report`,
};

// MultipleVehicleReportSchema
export const MultipleVehicleReportSchema = MongoBaseQuerySchema.extend({
  organisation_id: single_select_mandatory('Organisation'),
  db_instance: stringMandatory('DB Instance'),
  db_group: stringMandatory('DB Group'),
  vehicle_ids: multi_select_mandatory('Master Vehicle'),
  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
  time_slot: enumOptional(
    'Time Slot',
    TimeSlot,
    TimeSlot.TIME_SLOT_12AM_TO_12AM,
  ),
  night_driving: enumOptional(
    'Night Driving',
    NightDriving,
    NightDriving.Night_Driving_8PM_4AM,
  ),
  over_speed: enumOptional('Over Speed', OverSpeed, OverSpeed.Over_Speed_60KM),
  utilization_km: numberMandatory('Utilization KM'),
  raw_data: enumOptional('Raw Data', YesNo, YesNo.No),
  day_summary: enumOptional('Day Summary', YesNo, YesNo.No),
  vehicle_summary: enumOptional('Vehicle Summary', YesNo, YesNo.No),
  driver_summary: enumOptional('Driver Summary', YesNo, YesNo.No),
});
export type MultipleVehicleReportQueryDTO = z.infer<
  typeof MultipleVehicleReportSchema
>;

// MultipleVehicleReportSummarySchema
export const MultipleVehicleReportSummarySchema = MongoBaseQuerySchema.extend({
  organisation_id: single_select_mandatory('Organisation'),
  db_instance: stringMandatory('DB Instance'),
  db_group: stringMandatory('DB Group'),
  vehicle_ids: multi_select_mandatory('Master Vehicle'),
  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
  time_slot: enumOptional(
    'Time Slot',
    TimeSlot,
    TimeSlot.TIME_SLOT_12AM_TO_12AM,
  ),
});
export type MultipleVehicleReportSummaryQueryDTO = z.infer<
  typeof MultipleVehicleReportSummarySchema
>;

// MultipleDriverReportSchema
export const MultipleDriverReportSchema = MongoBaseQuerySchema.extend({
  organisation_id: single_select_mandatory('Organisation'),
  db_instance: stringMandatory('DB Instance'),
  db_group: stringMandatory('DB Group'),
  driver_ids: multi_select_mandatory('Master Driver'),
  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
  time_slot: enumOptional(
    'Time Slot',
    TimeSlot,
    TimeSlot.TIME_SLOT_12AM_TO_12AM,
  ),
  night_driving: enumOptional(
    'Night Driving',
    NightDriving,
    NightDriving.Night_Driving_8PM_4AM,
  ),
  over_speed: enumOptional('Over Speed', OverSpeed, OverSpeed.Over_Speed_60KM),
  utilization_km: numberMandatory('Utilization KM'),
  raw_data: enumOptional('Raw Data', YesNo, YesNo.No),
  day_summary: enumOptional('Day Summary', YesNo, YesNo.No),
  vehicle_summary: enumOptional('Vehicle Summary', YesNo, YesNo.No),
  driver_summary: enumOptional('Driver Summary', YesNo, YesNo.No),
});
export type MultipleDriverReportQueryDTO = z.infer<
  typeof MultipleDriverReportSchema
>;

// SimpleReportSchema
export const SimpleReportSchema = MongoBaseQuerySchema.extend({
  organisation_id: single_select_mandatory('Organisation'),
  db_instance: stringMandatory('DB Instance'),
  db_group: stringMandatory('DB Group'),
  vehicle_ids: multi_select_mandatory('Master Vehicle'),
  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
  gps_type: enumMandatory('GPS Type', GPSType, GPSType.Ignition),
  interval_seconds: numberMandatory('Interval Seconds', 0, 100000),
  boolean_type: enumMandatory('Boolean Type', BooleanType, BooleanType.Both),
});
export type SimpleReportQueryDTO = z.infer<typeof SimpleReportSchema>;

// AlertReportSchema
export const AlertReportSchema = MongoBaseQuerySchema.extend({
  organisation_id: single_select_mandatory('UserOrganisation'),
  db_instance: stringMandatory('DBInstance'),
  db_group: stringMandatory('DBGroup'),

  user_ids: multi_select_optional('User'), // Multi-selection -> User
  vehicle_ids: multi_select_optional('MasterVehicle'), // Multi-selection -> MasterVehicle
  driver_ids: multi_select_optional('MasterDriver'), // Multi-selection -> MasterDriver
  gps_geofence_ids: multi_select_optional('GPSGeofence'), // Multi-selection -> GPSGeofence

  modules: enumArrayOptional('Modules', Module, getAllEnums(Module)),
  alert_types: enumArrayOptional(
    'Alert Types',
    AlertType,
    getAllEnums(AlertType),
  ),
  alert_sub_types: enumArrayOptional(
    'Alert Sub Types',
    AlertSubType,
    getAllEnums(AlertSubType),
  ),

  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
});
export type AlertReportQueryDTO = z.infer<typeof AlertReportSchema>;

// SingleVehicleReportSchema
export const SingleVehicleReportSchema = MongoBaseQuerySchema.extend({
  organisation_id: single_select_mandatory('Organisation'),
  db_instance: stringMandatory('DB Instance'),
  db_group: stringMandatory('DB Group'),
  vehicle_id: single_select_mandatory('Master Vehicle'),
  from_date_time: dateTimeMandatory('From Date Time'),
  to_date_time: dateTimeMandatory('To Date Time'),
  interval_seconds: numberMandatory('Interval Seconds'),
});
export type SingleVehicleReportQueryDTO = z.infer<
  typeof SingleVehicleReportSchema
>;

// SingleVehicleReportSchema
export const VehicleDashboardSummaryQuerySchema = MongoBaseQuerySchema.extend({
  organisation_id: single_select_mandatory('Organisation'),
  db_instance: stringMandatory('DB Instance'),
  db_group: stringMandatory('DB Group'),
  vehicle_id: single_select_mandatory('Master Vehicle'),
});
export type VehicleDashboardSummaryQueryDTO = z.infer<
  typeof VehicleDashboardSummaryQuerySchema
>;

// UserOrganisationVehicleGPSResyncSchema
export const UserOrganisationVehicleGPSResyncSchema = BaseQuerySchema.extend({
  organisation_id: single_select_mandatory('UserOrganisation'),
  vehicle_ids: multi_select_optional('MasterVehicle'),
  is_all_vehicles: enumMandatory('Is All Vehicles', YesNo, YesNo.No),
  from_date: dateMandatory('From Date'),
  to_date: dateMandatory('To Date'),
});
export type UserOrganisationVehicleGPSResyncDTO = z.infer<
  typeof UserOrganisationVehicleGPSResyncSchema
>;

// YearlyVehicleReportSchema
export const YearlyVehicleReportSchema = MongoBaseQuerySchema.extend({
  organisation_id: single_select_mandatory('Organisation'),
  db_instance: stringMandatory('DB Instance'),
  db_group: stringMandatory('DB Group'),
  vehicle_ids: multi_select_mandatory('Master Vehicle'),
  year: numberMandatory('Year', 2000, 2100),
  time_slot: enumOptional(
    'Time Slot',
    TimeSlot,
    TimeSlot.TIME_SLOT_12AM_TO_12AM,
  ),
});
export type YearlyVehicleReportQueryDTO = z.infer<
  typeof YearlyVehicleReportSchema
>;

// FBR -> GpsAnalytics
export const all_vehicles_24_hours_analysis_report = async (data: MultipleVehicleReportQueryDTO): Promise<FBR<GpsAnalytics[]>> => {
  return apiPost<FBR<GpsAnalytics[]>, MultipleVehicleReportQueryDTO>(ENDPOINTS.all_vehicles_24_hours_analysis_report, data);
};

export const all_vehicles_24_hours_analysis_summary_report = async (data: MultipleVehicleReportSummaryQueryDTO): Promise<FBR<GpsAnalyticsSummary[]>> => {
  return apiPost<FBR<GpsAnalyticsSummary[]>, MultipleVehicleReportSummaryQueryDTO>(ENDPOINTS.all_vehicles_24_hours_analysis_summary_report, data);
};

export const driver_performance_report = async (data: MultipleDriverReportQueryDTO): Promise<FBR<GpsAnalytics[]>> => {
  return apiPost<FBR<GpsAnalytics[]>, MultipleDriverReportQueryDTO>(ENDPOINTS.all_drivers_performance_report, data);
};

export const monthly_kilometers_summary = async (data: MultipleVehicleReportQueryDTO): Promise<FBR<KilometerMonthly[]>> => {
  return apiPost<FBR<KilometerMonthly[]>, MultipleVehicleReportQueryDTO>(ENDPOINTS.monthly_kilometers_summary_report, data);
};

export const yearly_kilometers_summary_report = async (data: YearlyVehicleReportQueryDTO): Promise<FBR<KilometerYearly[]>> => {
  return apiPost<FBR<KilometerYearly[]>, YearlyVehicleReportQueryDTO>(ENDPOINTS.yearly_kilometers_summary_report, data);
};

export const vehicle_hourly_km_report = async (data: MultipleVehicleReportQueryDTO): Promise<FBR<HourlyKmAnalysis[]>> => {
  return apiPost<FBR<HourlyKmAnalysis[]>, MultipleVehicleReportQueryDTO>(ENDPOINTS.vehicle_hourly_kilometers_report, data);
};

// FBR -> GpsAnalytics -> OverSpeed
export const all_vehicles_over_speed_violation_report = async (data: MultipleVehicleReportQueryDTO): Promise<FBR<GPSOverSpeedViolation[]>> => {
  return apiPost<FBR<GPSOverSpeedViolation[]>, MultipleVehicleReportQueryDTO>(ENDPOINTS.all_vehicles_over_speed_violation_report, data);
};

export const all_drivers_over_speed_violation_report = async (data: MultipleDriverReportQueryDTO): Promise<FBR<GPSOverSpeedViolation[]>> => {
  return apiPost<FBR<GPSOverSpeedViolation[]>, MultipleDriverReportQueryDTO>(ENDPOINTS.all_drivers_over_speed_violation_report, data);
};

export const monthly_over_speed_summary_report = async (data: MultipleVehicleReportQueryDTO): Promise<FBR<OverSpeedViolationMonthly[]>> => {
  return apiPost<FBR<OverSpeedViolationMonthly[]>, MultipleVehicleReportQueryDTO>(ENDPOINTS.monthly_over_speed_summary_report, data);
};

// FBR -> GpsSensor
export const vehicle_stoppage_track_report = async (data: SimpleReportQueryDTO): Promise<FBR<GpsSensor[]>> => {
  return apiPost<FBR<GpsSensor[]>, SimpleReportQueryDTO>(ENDPOINTS.vehicle_stoppage_track_report, data);
};

export const ignition_sensor_report = async (data: SimpleReportQueryDTO): Promise<FBR<GpsSensor[]>> => {
  return apiPost<FBR<GpsSensor[]>, SimpleReportQueryDTO>(ENDPOINTS.ignition_sensor_report, data);
};

export const genset_sensor_report = async (data: SimpleReportQueryDTO): Promise<FBR<GpsSensor[]>> => {
  return apiPost<FBR<GpsSensor[]>, SimpleReportQueryDTO>(ENDPOINTS.genset_sensor_report, data);
};

export const door_sensor_report = async (data: SimpleReportQueryDTO): Promise<FBR<GpsSensor[]>> => {
  return apiPost<FBR<GpsSensor[]>, SimpleReportQueryDTO>(ENDPOINTS.door_sensor_report, data);
};

// FBR -> GPSAlert
export const gps_alert_notifications = async (data: AlertReportQueryDTO): Promise<FBR<GpsAlert[]>> => {
  return apiPost<FBR<GpsAlert[]>, AlertReportQueryDTO>(ENDPOINTS.gps_alert_notifications, data);
};

// FBR -> GpsPacket
export const vehicle_gps_raw_data_report = async (data: SingleVehicleReportQueryDTO): Promise<FBR<GpsPacket[]>> => {
  return apiPost<FBR<GpsPacket[]>, SingleVehicleReportQueryDTO>(ENDPOINTS.vehicle_gps_raw_data_report, data);
};

export const vehicle_track_history_report = async (data: SingleVehicleReportQueryDTO): Promise<FBR<GpsPacket[]>> => {
  return apiPost<FBR<GpsPacket[]>, SingleVehicleReportQueryDTO>(ENDPOINTS.vehicle_track_history_report, data);
};

// SBR -> GpsPacket and GpsAnalytics
export const vehicle_dashboard_summary_report = async (data: VehicleDashboardSummaryQueryDTO): Promise<FBR<DashboardSummaryReport[]>> => {
  return apiPost<FBR<DashboardSummaryReport[]>, VehicleDashboardSummaryQueryDTO>(ENDPOINTS.vehicle_dashboard_summary_report, data);
};
