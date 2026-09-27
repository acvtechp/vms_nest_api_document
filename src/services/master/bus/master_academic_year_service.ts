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
  enumArrayOptional,
  getAllEnums,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status, YesNo } from '../../../core/Enums';

// Other Models
import { UserOrganisation } from '../../main/users/user_organisation_service';
import { Student } from 'src/services/fleet/school_management/student_service';

const URL = 'master/bus/year';

const ENDPOINTS = {
  // MasterAcademicYear APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
};

// MasterAcademicYear Interface
export interface MasterAcademicYear extends Record<string, unknown> {
  // Primary Fields
  academic_year_id: string;

  // Main Field Details
  academic_year: string;
  is_current: YesNo;
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
  Student?: Student[];

  // Relations - Child Count
  _count?: {
    Student?: number;
  };
}

// MasterAcademicYear Create/Update Schema
export const MasterAcademicYearSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'), // Single-Selection -> UserOrganisation

  // Main Field Details
  academic_year: stringMandatory('Academic Year', 3, 100),
  is_current: enumMandatory('Is Current', YesNo, YesNo.No),
  description: stringOptional('Description', 0, 300),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterAcademicYearDTO = z.infer<typeof MasterAcademicYearSchema>;

// MasterAcademicYear Query Schema
export const MasterAcademicYearQuerySchema = BaseQuerySchema.extend({
  // Self Table
  academic_year_ids: multi_select_optional('MasterAcademicYear'), // Multi-selection -> MasterAcademicYear

  // Relations - Parent
  organisation_ids: multi_select_optional('UserOrganisation'), // Multi-selection -> UserOrganisation

  // Enums
  is_current: enumArrayOptional('Is Current', YesNo, getAllEnums(YesNo)),
});
export type MasterAcademicYearQueryDTO = z.infer<
  typeof MasterAcademicYearQuerySchema
>;

// Convert MasterAcademicYear Data to API Payload
export const toMasterAcademicYearPayload = (row: MasterAcademicYear): MasterAcademicYearDTO => ({
  organisation_id: row.organisation_id || '',

  academic_year: row.academic_year || '',
  is_current: row.is_current || YesNo.No,
  description: row.description || '',

  status: row.status || Status.Active,
});

// Create New MasterAcademicYear Payload
export const newMasterAcademicYearPayload = (): MasterAcademicYearDTO => ({
  organisation_id: '',

  academic_year: '',
  is_current: YesNo.No,
  description: '',

  status: Status.Active
});

// MasterAcademicYear APIs
export const findMasterAcademicYear = async (data: MasterAcademicYearQueryDTO): Promise<FBR<MasterAcademicYear[]>> => {
  return apiPost<FBR<MasterAcademicYear[]>, MasterAcademicYearQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterAcademicYear = async (data: MasterAcademicYearDTO): Promise<SBR> => {
  return apiPost<SBR, MasterAcademicYearDTO>(ENDPOINTS.create, data);
};

export const updateMasterAcademicYear = async (id: string, data: MasterAcademicYearDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterAcademicYearDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterAcademicYear = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterAcademicYearCache = async (organisation_id: string): Promise<FBR<MasterAcademicYear[]>> => {
  return apiGet<FBR<MasterAcademicYear[]>>(ENDPOINTS.cache(organisation_id));
};

export const getMasterAcademicYearCacheCount = async (organisation_id: string): Promise<FBR<MasterAcademicYear[]>> => {
  return apiGet<FBR<MasterAcademicYear[]>>(ENDPOINTS.cache_count(organisation_id));
};

