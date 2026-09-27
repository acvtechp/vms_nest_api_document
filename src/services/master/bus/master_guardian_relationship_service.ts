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
import { StudentGuardianLink } from 'src/services/fleet/school_management/student_service';

const URL = 'master/bus/relationship';

const ENDPOINTS = {
  // MasterGuardianRelationship APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
};

// MasterGuardianRelationship Interface
export interface MasterGuardianRelationship extends Record<string, unknown> {
  // Primary Fields
  guardian_relationship_id: string;

  // Main Field Details
  guardian_relationship: string;
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
  StudentGuardianLink?: StudentGuardianLink[];

  // Relations - Child Count
  _count?: {
    StudentGuardianLink?: number;
  };
}

// MasterGuardianRelationship Create/Update Schema
export const MasterGuardianRelationshipSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation

  // Main Field Details
  guardian_relationship: stringMandatory('Relationship Name', 3, 100),
  description: stringOptional('Description', 0, 300),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterGuardianRelationshipDTO = z.infer<typeof MasterGuardianRelationshipSchema>;

// MasterGuardianRelationship Query Schema
export const MasterGuardianRelationshipQuerySchema = BaseQuerySchema.extend({
  // Self Table
  guardian_relationship_ids: multi_select_optional('MasterGuardianRelationship'), // Multi-selection -> MasterGuardianRelationship

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation
});
export type MasterGuardianRelationshipQueryDTO = z.infer<
  typeof MasterGuardianRelationshipQuerySchema
>;

// Convert MasterGuardianRelationship Data to API Payload
export const toMasterGuardianRelationshipPayload = (row: MasterGuardianRelationship): MasterGuardianRelationshipDTO => ({
  organisation_id: row.organisation_id || '',

  guardian_relationship: row.guardian_relationship || '',
  description: row.description || '',

  status: row.status || Status.Active,
});

// Create New MasterGuardianRelationship Payload
export const newMasterGuardianRelationshipPayload = (): MasterGuardianRelationshipDTO => ({
  organisation_id: '',

  guardian_relationship: '',
  description: '',

  status: Status.Active
});

// MasterGuardianRelationship APIs
export const findMasterGuardianRelationship = async (data: MasterGuardianRelationshipQueryDTO): Promise<FBR<MasterGuardianRelationship[]>> => {
  return apiPost<FBR<MasterGuardianRelationship[]>, MasterGuardianRelationshipQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterGuardianRelationship = async (data: MasterGuardianRelationshipDTO): Promise<SBR> => {
  return apiPost<SBR, MasterGuardianRelationshipDTO>(ENDPOINTS.create, data);
};

export const updateMasterGuardianRelationship = async (id: string, data: MasterGuardianRelationshipDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterGuardianRelationshipDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterGuardianRelationship = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterGuardianRelationshipCache = async (organisation_id: string): Promise<FBR<MasterGuardianRelationship[]>> => {
  return apiGet<FBR<MasterGuardianRelationship[]>>(ENDPOINTS.cache(organisation_id));
};

export const getMasterGuardianRelationshipCacheCount = async (organisation_id: string): Promise<FBR<MasterGuardianRelationship[]>> => {
  return apiGet<FBR<MasterGuardianRelationship[]>>(ENDPOINTS.cache_count(organisation_id));
};

