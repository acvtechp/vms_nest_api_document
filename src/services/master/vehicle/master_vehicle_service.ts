// Axios
import { apiGet } from '../../../core/apiCall';
import { FBR } from '../../../core/BaseResponse';

// Vehicle Master Models
import { MasterVehicleType } from './master_vehicle_type_service';
import { MasterVehicleMake } from './master_vehicle_make_service';
import { MasterVehicleSubModel } from './master_vehicle_sub_model_service';
import { MasterVehicleStatus } from './master_vehicle_status_service';
import { MasterVehicleOwnership } from './master_vehicle_ownership_service';
import { MasterVehicleAssociated } from './master_vehicle_associated_service';
import { MasterVehicleFuelType } from './master_vehicle_fuel_type_service';
import { MasterVehicleFuelUnit } from './master_vehicle_fuel_unit_service';

const URL = 'master/vehicle';

const ENDPOINTS = {
  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
  cache_child: (organisation_id: string): string => `${URL}/cache_child/${organisation_id}`,
};

// Master Vehicles Cache Response
export interface MasterVehiclesCacheData
  extends Record<string, unknown> {
  MasterVehicleType: MasterVehicleType[];
  MasterVehicleMake: MasterVehicleMake[];
  MasterVehicleSubModel: MasterVehicleSubModel[];
  MasterVehicleStatus: MasterVehicleStatus[];
  MasterVehicleOwnership: MasterVehicleOwnership[];
  MasterVehicleAssociated: MasterVehicleAssociated[];
  MasterVehicleFuelType: MasterVehicleFuelType[];
  MasterVehicleFuelUnit: MasterVehicleFuelUnit[];
}

// Cache APIs
export const getMasterVehicleCache = async (organisation_id: string): Promise<FBR<MasterVehiclesCacheData>> => {
  return apiGet<FBR<MasterVehiclesCacheData>>(ENDPOINTS.cache(organisation_id));
};

export const getMasterVehicleCacheCount = async (organisation_id: string): Promise<FBR<MasterVehiclesCacheData>> => {
  return apiGet<FBR<MasterVehiclesCacheData>>(ENDPOINTS.cache_count(organisation_id));
};

export const getMasterVehicleCacheChild = async (organisation_id: string): Promise<FBR<MasterVehiclesCacheData>> => {
  return apiGet<FBR<MasterVehiclesCacheData>>(ENDPOINTS.cache_child(organisation_id));
};


