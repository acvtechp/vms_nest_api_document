// Axios
import { apiPost } from '../../../core/apiCall';
import { FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import { multi_select_optional } from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums

// Other Models
import { MasterMainTimeZone } from '../../master/main/master_main_timezone_service';
import { UserOrganisation } from '../../main/users/user_organisation_service';
import { MasterVehicle } from '../../main/vehicle/master_vehicle_service';

const URL = 'fleet/fuel_management/fleet_fuel_removal_live';

const ENDPOINTS = {
  // FleetFuelRemovalLive APIs
  find: `${URL}/search`,
};

// FleetFuelRemovalLive Interface
export interface FleetFuelRemovalLive extends Record<string, unknown> {
  // Primary Fields
  fleet_fuel_removal_live_id: string;

  // Relations - Parent
  time_zone_id?: string;
  MasterMainTimeZone?: MasterMainTimeZone;
  time_zone_code?: string;
  time_zone_identifier?: string;
  time_zone_offset?: string;

  organisation_id: string;
  UserOrganisation?: UserOrganisation;
  organisation_name?: string;
  organisation_code?: string;
  organisation_logo_url?: string;

  vehicle_id: string;
  MasterVehicle?: MasterVehicle;
  vehicle_number?: string;
  vehicle_type?: string;

  // Relations - Child Count
  _count?: {
  };
}

// FleetFuelRemovalLive Query Schema
export const FleetFuelRemovalLiveQuerySchema = BaseQuerySchema.extend({
  // Self Table
  fleet_fuel_removal_live_ids: multi_select_optional('FleetFuelRemovalLive'), // Multi-selection -> FleetFuelRemovalLive

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
  vehicle_ids: multi_select_optional('MasterVehicle'), // Multi-selection -> MasterVehicle
  time_zone_ids: multi_select_optional('MasterMainTimeZone'), // Multi-selection -> MasterMainTimeZone
});
export type FleetFuelRemovalLiveQueryDTO = z.infer<
  typeof FleetFuelRemovalLiveQuerySchema
>;

// FleetFuelRemovalLive APIs
export const findFleetFuelRemovalLive = async (data: FleetFuelRemovalLiveQueryDTO): Promise<FBR<FleetFuelRemovalLive[]>> => {
  return apiPost<FBR<FleetFuelRemovalLive[]>, FleetFuelRemovalLiveQueryDTO>(ENDPOINTS.find, data);
};