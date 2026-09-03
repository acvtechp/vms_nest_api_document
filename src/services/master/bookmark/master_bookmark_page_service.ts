// Axios
import { apiPost, apiPatch, apiDelete } from '../../../core/apiCall';
import { SBR, FBR } from '../../../core/BaseResponse';

// Zod
import { z } from 'zod';
import {
  stringMandatory,
  stringOptional,
  enumMandatory,
  single_select_mandatory,
  multi_select_optional,
  enumArrayOptional,
  getAllEnums,
  numberMandatory,
} from '../../../zod_utils/zod_utils';
import { BaseQuerySchema } from '../../../zod_utils/zod_base_schema';

// Enums
import { Status } from '../../../core/Enums';

// Other Models
import { MasterBookmarkModule } from '../../../services/master/bookmark/master_bookmark_module_service';
import { MasterBookmarkSubModule } from '../../../services/master/bookmark/master_bookmark_sub_module_service';
import { UserBookmark } from '../../account/user_bookmark_service';

// URL and Endpoints
const URL = 'master/bookmark/page';

const ENDPOINTS = {
  // MasterBookmarkPage APIs
  find: `${URL}/search`,
  create: URL,
  update: (id: string): string => `${URL}/${id}`,
  delete: (id: string): string => `${URL}/${id}`,
};

// MasterBookmarkPage Interface
export interface MasterBookmarkPage extends Record<string, unknown> {
  // Primary Fields
  bookmark_page_id: string;

  // Main Field Details
  page_name: string;
  page_icon_name?: string;
  page_url: string;
  sort_order: number;

  // Metadata
  status: Status;
  added_date_time: string;
  modified_date_time: string;

  // Relations - Parent
  bookmark_module_id: string;
  MasterBookmarkModule?: MasterBookmarkModule;
  module_name?: string;

  bookmark_sub_module_id: string;
  MasterBookmarkSubModule?: MasterBookmarkSubModule;
  sub_module_name?: string;

  // Relations - Child
  UserBookmark?: UserBookmark[];

  // Relations - Child Count
  _count?: {
    UserBookmark?: number;
  };
}

// MasterBookmarkPage Create/Update Schema
export const MasterBookmarkPageSchema = z.object({
  // Relations - Parent
  bookmark_module_id: single_select_mandatory('MasterBookmarkModule'),
  bookmark_sub_module_id: single_select_mandatory('MasterBookmarkSubModule'),

  // Main Field Details
  page_name: stringMandatory('Page Name', 1, 100),
  page_icon_name: stringOptional('Page Icon Name', 0, 100),
  page_url: stringMandatory('Page URL', 1, 300),
  sort_order: numberMandatory('Sort Order'),

  // Metadata
  status: enumMandatory('Status', Status, Status.Active),
});
export type MasterBookmarkPageDTO = z.infer<typeof MasterBookmarkPageSchema>;

// MasterBookmarkPage Query Schema
export const MasterBookmarkPageQuerySchema = BaseQuerySchema.extend({
  // Self Table
  bookmark_page_ids: multi_select_optional('MasterBookmarkPage'),

  // Relations - Parent
  bookmark_module_ids: multi_select_optional('MasterBookmarkModule'),
  bookmark_sub_module_ids: multi_select_optional('MasterBookmarkSubModule'),

  // Enums
  status: enumArrayOptional('Status', Status, getAllEnums(Status)),
});
export type MasterBookmarkPageQueryDTO = z.infer<typeof MasterBookmarkPageQuerySchema>;

// Convert MasterBookmarkPage Data to API Payload
export const toMasterBookmarkPagePayload = (row: MasterBookmarkPage): MasterBookmarkPageDTO => ({
  bookmark_module_id: row.bookmark_module_id || '',
  bookmark_sub_module_id: row.bookmark_sub_module_id || '',

  page_name: row.page_name || '',
  page_icon_name: row.page_icon_name || '',
  page_url: row.page_url || '',
  sort_order: row.sort_order || 0,

  status: row.status || Status.Active,
});

// Create New MasterBookmarkPage Payload
export const newMasterBookmarkPagePayload = (): MasterBookmarkPageDTO => ({
  bookmark_module_id: '',
  bookmark_sub_module_id: '',

  page_name: '',
  page_icon_name: '',
  page_url: '',
  sort_order: 0,

  status: Status.Active,
});

// MasterBookmarkPage APIs
export const findMasterBookmarkPages = async (data: MasterBookmarkPageQueryDTO): Promise<FBR<MasterBookmarkPage[]>> => {
  return apiPost<FBR<MasterBookmarkPage[]>,MasterBookmarkPageQueryDTO>(ENDPOINTS.find, data);
};

export const createMasterBookmarkPage = async (data: MasterBookmarkPageDTO): Promise<SBR> => {
  return apiPost<SBR, MasterBookmarkPageDTO>(ENDPOINTS.create, data);
};

export const updateMasterBookmarkPage = async (id: string, data: MasterBookmarkPageDTO): Promise<SBR> => {
  return apiPatch<SBR, MasterBookmarkPageDTO>(ENDPOINTS.update(id), data);
};

export const deleteMasterBookmarkPage = async (id: string): Promise<SBR> => {
  return apiDelete<SBR>(ENDPOINTS.delete(id));
};