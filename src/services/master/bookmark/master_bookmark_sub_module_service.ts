// Axios
import { apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  enumMandatory,
  single_select_mandatory,
  multi_select_optional,
  numberMandatory,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { MasterBookmarkModule } from '../../../services/master/bookmark/master_bookmark_module_service';
import { MasterBookmarkPage } from '../../../services/master/bookmark/master_bookmark_page_service';
import { UserBookmark } from '../../account/user_bookmark_service';

// URL and Endpoints
const URL = 'master/bookmark/sub_module';

const ENDPOINTS = {
  // MasterBookmarkSubModule APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// MasterBookmarkSubModule Interface
export interface MasterBookmarkSubModule extends Record<string, unknown> {
  // Primary Fields
  bookmark_sub_module_id: string;

  // Main Field Details
  sub_module_name: string;
  sort_order: number;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  bookmark_module_id: string;
  MasterBookmarkModule?: MasterBookmarkModule;
  module_name?: string;

  // Relations - Child
  MasterBookmarkPage?: MasterBookmarkPage[];
  UserBookmark?: UserBookmark[];

  // Relations - Child Count
  _count?: {
    MasterBookmarkPage?: number;
    UserBookmark?: number;
  };
}

// MasterBookmarkSubModule Create Schema
export const MasterBookmarkSubModuleSchema = z.object({
  // Relations - Parent
  bookmark_module_id: single_select_mandatory('MasterBookmarkModule'),

  // Main Field Details
  sub_module_name: stringMandatory('Sub Module Name', 1, 100),
  sort_order: numberMandatory('Sort Order'),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterBookmarkSubModuleDTO = z.infer<
  typeof MasterBookmarkSubModuleSchema
>;

// MasterBookmarkSubModule Query Schema
export const MasterBookmarkSubModuleQuerySchema = BaseQuerySchema.extend({
  // Self Table
  bookmark_sub_module_ids: multi_select_optional('MasterBookmarkSubModule'),

  // Relations - Parent
  bookmark_module_ids: multi_select_optional('MasterBookmarkModule'),
});
export type MasterBookmarkSubModuleQueryDTO = z.infer<
  typeof MasterBookmarkSubModuleQuerySchema
>;

// Convert MasterBookmarkSubModule Data to API Payload
export const toMasterBookmarkSubModulePayload = (row: MasterBookmarkSubModule): MasterBookmarkSubModuleDTO => ({
  bookmark_module_id: row.bookmark_module_id || '',

  sub_module_name: row.sub_module_name || '',
  sort_order: row.sort_order || 0,

  status: row.status || Status.Active,
});

// Create New MasterBookmarkSubModule Payload
export const newMasterBookmarkSubModulePayload = (): MasterBookmarkSubModuleDTO => ({
  bookmark_module_id: '',

  sub_module_name: '',
  sort_order: 0,

  status: Status.Active,
});

// MasterBookmarkSubModule APIs
export const findMasterBookmarkSubModules = async (data: MasterBookmarkSubModuleQueryDTO): Promise<FBR<MasterBookmarkSubModule[]>> => {
  return apiPost<FBR<MasterBookmarkSubModule[]>,MasterBookmarkSubModuleQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterBookmarkSubModule = async (data: MasterBookmarkSubModuleDTO): Promise<SBR> => {
  return apiPost<SBR, MasterBookmarkSubModuleDTO>(ENDPOINTS.create, data);
};

export const updateMasterBookmarkSubModule = async (id: string, data: MasterBookmarkSubModuleDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterBookmarkSubModuleDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterBookmarkSubModule = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};