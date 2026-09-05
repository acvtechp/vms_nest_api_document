// Axios
import { apiPost, apiPatch, apiDelete, apiGet } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  enumMandatory,
  multi_select_optional,
  numberMandatory,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { MasterBookmarkSubModule } from '../../../services/master/bookmark/master_bookmark_sub_module_service';
import { MasterBookmarkPage } from '../../../services/master/bookmark/master_bookmark_page_service';
import { UserBookmark } from '../../account/user_bookmark_service';

// URL and Endpoints
const URL = 'master/bookmark/module';

const ENDPOINTS = {
  // MasterBookmarkModule APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,

  // Cache APIs
  cache: `${URL}/cache`,
  cache_count: `${URL}/cache_count`,
  cache_child: `${URL}/cache_child`,
};

// MasterBookmarkModule Interface
export interface MasterBookmarkModule extends Record<string, unknown> {
  // Primary Fields
  bookmark_module_id: string;

  // Main Field Details
  module_name: string;
  sort_order: number;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Child
  MasterBookmarkSubModule?: MasterBookmarkSubModule[];
  MasterBookmarkPage?: MasterBookmarkPage[];
  UserBookmark?: UserBookmark[];

  // Relations - Child Count
  _count?: {
    MasterBookmarkSubModule?: number;
    MasterBookmarkPage?: number;
    UserBookmark?: number;
  };
}

// MasterBookmarkModule Create Schema
export const MasterBookmarkModuleSchema = z.object({
  // Main Field Details
  module_name: stringMandatory('Module Name', 1, 100),
  sort_order: numberMandatory('Sort Order'),
  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterBookmarkModuleDTO = z.infer<
  typeof MasterBookmarkModuleSchema
>;

// MasterBookmarkModule Query Schema
export const MasterBookmarkModuleQuerySchema = BaseQuerySchema.extend({
  // Self Table
  bookmark_module_ids: multi_select_optional('MasterBookmarkModule'),
});
export type MasterBookmarkModuleQueryDTO = z.infer<
  typeof MasterBookmarkModuleQuerySchema
>;

// Convert MasterBookmarkModule Data to API Payload
export const toMasterBookmarkModulePayload = (row: MasterBookmarkModule): MasterBookmarkModuleDTO => ({
  module_name: row.module_name || '',
  sort_order: row.sort_order || 0,

  status: row.status || Status.Active,
});

// Create New MasterBookmarkModule Payload
export const newMasterBookmarkModulePayload = (): MasterBookmarkModuleDTO => ({
  module_name: '',
  sort_order: 0,

  status: Status.Active,
});

// MasterBookmarkModule APIs
export const findMasterBookmarkModules = async (data: MasterBookmarkModuleQueryDTO): Promise<FBR<MasterBookmarkModule[]>> => {
  return apiPost<FBR<MasterBookmarkModule[]>, MasterBookmarkModuleQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterBookmarkModule = async (data: MasterBookmarkModuleDTO): Promise<SBR> => {
  return apiPost<SBR, MasterBookmarkModuleDTO>(ENDPOINTS.create, data);
};

export const updateMasterBookmarkModule = async (id: string, data: MasterBookmarkModuleDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterBookmarkModuleDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterBookmarkModule = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};

// Cache APIs
export const getMasterBookmarkModuleCache = async (): Promise<FBR<MasterBookmarkModule[]>> => {
  return apiGet<FBR<MasterBookmarkModule[]>>(ENDPOINTS.cache);
};

export const getMasterBookmarkModuleCacheCount = async (): Promise<FBR<MasterBookmarkModule[]>> => {
  return apiGet<FBR<MasterBookmarkModule[]>>(ENDPOINTS.cache_count);
};

export const getMasterBookmarkModuleCacheChild = async (): Promise<FBR<MasterBookmarkModule[]>> => {
  return apiGet<FBR<MasterBookmarkModule[]>>(ENDPOINTS.cache_child);
};