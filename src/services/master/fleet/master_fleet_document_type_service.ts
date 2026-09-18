// Axios
import { apiGet, apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  single_select_mandatory,
  multi_select_optional,
  enumMandatory,
  stringOptional,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../main/users/user_organisation_service';
import { FleetDocument, FleetDocumentExpiry } from 'src/services/fleet/document_management/document_management_service';

const URL = 'master/vehicle/vehicle_document_type';

const ENDPOINTS = {
  // MasterFleetDocumentType APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
};

//  MasterFleetDocumentType Interface
export interface MasterFleetDocumentType extends Record<string, unknown> {
  // Primary Fields
  fleet_document_type_id: string;

  // Main Field Details
  document_type: string;
  description?: string;

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
  // Child - Main
  FleetDocument?: FleetDocument[];
  FleetDocumentExpiry?: FleetDocumentExpiry[];

  // Relations - Child Count
  _count?: {
    FleetDocument?: number;
    FleetDocumentExpiry?: number;
  };
}

// MasterFleetDocumentType Create/Update Schema
export const MasterFleetDocumentTypeSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation

  // Main Field Details
  document_type: stringMandatory('Document Type', 3, 100),
  description: stringOptional('Description', 0, 300),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterFleetDocumentTypeDTO = z.infer<
  typeof MasterFleetDocumentTypeSchema
>;

// MasterFleetDocumentType Query Schema
export const MasterFleetDocumentTypeQuerySchema = BaseQuerySchema.extend({
  // Self Table
  fleet_document_type_ids: multi_select_optional('MasterFleetDocumentType'), // Multi-selection -> MasterFleetDocumentType

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
});
export type MasterFleetDocumentTypeQueryDTO = z.infer<
  typeof MasterFleetDocumentTypeQuerySchema
>;

// Convert MasterFleetDocumentType Data to API Payload
export const toMasterFleetDocumentTypePayload = (row: MasterFleetDocumentType): MasterFleetDocumentTypeDTO => ({
  organisation_id: row.organisation_id || '',

  document_type: row.document_type || '',
  description: row.description || '',

  status: row.status || Status.Active,
});

// Create New MasterFleetDocumentType Payload
export const newMasterFleetDocumentTypePayload = (): MasterFleetDocumentTypeDTO => ({
  organisation_id: '',

  document_type: '',
  description: '',

  status: Status.Active,
});

// MasterFleetDocumentType APIs
export const findMasterFleetDocumentTypes = async (data: MasterFleetDocumentTypeQueryDTO): Promise<FBR<MasterFleetDocumentType[]>> => {
  return apiPost<FBR<MasterFleetDocumentType[]>, MasterFleetDocumentTypeQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterFleetDocumentType = async (data: MasterFleetDocumentTypeDTO): Promise<SBR> => {
  return apiPost<SBR, MasterFleetDocumentTypeDTO>(ENDPOINTS.create, data);
};

export const updateMasterFleetDocumentType = async (id: string, data: MasterFleetDocumentTypeDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterFleetDocumentTypeDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterFleetDocumentType = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterFleetDocumentTypeCache = async (organisation_id: string): Promise<FBR<MasterFleetDocumentType[]>> => {
  return apiGet<FBR<MasterFleetDocumentType[]>>(ENDPOINTS.cache(organisation_id));
};

