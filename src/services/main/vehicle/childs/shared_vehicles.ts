// Axios
import { apiPost, apiDelete } from '../../../../core/apiCall';
import { SBR, FBR } from '../../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
    multi_select_optional,
    single_select_mandatory,
    enumMandatory,
} from '../../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../../../services/main/users/user_organisation_service';
import { MasterVehicle } from '../../../../services/main/vehicle/master_vehicle_service';

const URL = 'main/vehicle/shared_vehicles';

const ENDPOINTS = {
    // SharedVehicles APIs
    create_update: URL,
    shared_with_me: (organisation_id: string): string =>   `${URL}/shared_with_me/${organisation_id}`,
    shared_by_me: (organisation_id: string): string =>  `${URL}/shared_by_me/${organisation_id}`,
    delete: (id: string): string => `${URL}/${id}`,
};

// MasterVehicleShare Interface
export interface MasterVehicleShare extends Record<string, unknown> {
    // Primary Field
    vehicle_share_id: string;

    // Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;
    added_date_time_f?: string;
    modified_date_time_f?: string;

    // Relations - From Organisation
    from_organisation_id: string;
    FromUserOrganisation?: UserOrganisation;
    from_organisation_name?: string;
    from_organisation_code?: string;
    from_organisation_logo_url?: string;

    // Relations - To Organisation
    to_organisation_id: string;
    ToUserOrganisation?: UserOrganisation;
    to_organisation_name?: string;
    to_organisation_code?: string;
    to_organisation_logo_url?: string;

    // Relations - Vehicle
    vehicle_id: string;
    MasterVehicle?: MasterVehicle;
    vehicle_number?: string;
    vehicle_type?: string;
}

// SharedVehicles With Me Interface
export interface SharedVehiclesWithMe extends Record<string, unknown> {
    // Primary Field
    vehicle_share_id: string;

    // Relations - From Organisation
    from_organisation_id: string;
    from_organisation_name?: string;

    // Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;
    added_date_time_f?: string;
    modified_date_time_f?: string;

    // Relations - Vehicle
    vehicle_id: string;
    vehicle_number?: string;
    vehicle_type?: string;
}

// SharedVehicles Vehicle Interface
export interface SharedVehiclesVehicle extends Record<string, unknown> {
    // Primary Field
    vehicle_share_id: string;

    // Metadata
    status: Status;
    added_date_time: string;
    modified_date_time: string;
    added_date_time_f?: string;
    modified_date_time_f?: string;

    // Relations - Vehicle
    vehicle_id: string;
    vehicle_number?: string;
    vehicle_type?: string;
}

// SharedVehicles By Me Interface
export interface SharedVehiclesByMe extends Record<string, unknown> {
    // Relations - To Organisation
    to_organisation_id: string;
    to_organisation_name: string;

    // Relations - Vehicle
    vehicles_count: number;
    vehicles: SharedVehiclesVehicle[];
}

// SharedVehicles Create/Update Schema
export const SharedVehiclesSchema = z.object({
    // Relations - From Organisation
    from_organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation

    // Relations - To Organisation
    to_organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation

    // Relations - Vehicle
    vehicle_ids: multi_select_optional('MasterVehicle'), // Multi-selection -> MasterVehicle

    // Metadata
    status: enumMandatory('Status', Status, Status.Active),
});
export type SharedVehiclesDTO = z.infer<typeof SharedVehiclesSchema>;

// SharedVehicles Query Schema
export const SharedVehiclesQuerySchema = BaseQuerySchema;
export type SharedVehiclesQueryDTO = z.infer<
    typeof SharedVehiclesQuerySchema
>;

// Convert SharedVehicles Data to API Payload
export const toSharedVehiclesPayload = (
    row: SharedVehiclesByMe,
    from_organisation_id: string,
): SharedVehiclesDTO => ({
    from_organisation_id: from_organisation_id,
    to_organisation_id: row.to_organisation_id,
    vehicle_ids: row.vehicles.map((vehicle) => vehicle.vehicle_id),

    status: row.vehicles[0]?.status || Status.Active,
});

// Create New SharedVehicles Payload
export const newSharedVehiclesPayload = (): SharedVehiclesDTO => ({
    from_organisation_id: '',
    to_organisation_id: '',
    vehicle_ids: [],

    status: Status.Active,
});

// SharedVehicles APIs
export const createUpdateSharedVehicles = async (data: SharedVehiclesDTO,): Promise<SBR> => {
    return apiPost<SBR, SharedVehiclesDTO>(ENDPOINTS.create_update, data,);
};

export const findSharedVehiclesWithMe = async (organisation_id: string, data: SharedVehiclesQueryDTO,): Promise<FBR<SharedVehiclesWithMe[]>> => {
    return apiPost<FBR<SharedVehiclesWithMe[]>, SharedVehiclesQueryDTO>(ENDPOINTS.shared_with_me(organisation_id), data);
};

export const findSharedVehiclesByMe = async (organisation_id: string, data: SharedVehiclesQueryDTO,): Promise<FBR<SharedVehiclesByMe[]>> => {
    return apiPost<FBR<SharedVehiclesByMe[]>, SharedVehiclesQueryDTO>(ENDPOINTS.shared_by_me(organisation_id), data);
};

export const deleteSharedVehicle = async (id: string): Promise<SBR> => {
    return apiDelete<SBR>(ENDPOINTS.delete(id));
};