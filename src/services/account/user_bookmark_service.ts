// Axios
import { apiPost } from '../../core/apiCall';
import { SBR, FBR } from '../../core/BaseResponse';

// Zod
import { z } from 'zod';
import { numberMandatory, single_select_mandatory, stringMandatory } from '../../zod_utils/zod_utils';

// Enums
import { Status } from '../../core/Enums';

// Other Models
import { UserOrganisation } from '../main/users/user_organisation_service';
import { User } from '../main/users/user_service';
import { MasterBookmarkModule } from '../master/bookmark/master_bookmark_module_service';
import { MasterBookmarkSubModule } from '../master/bookmark/master_bookmark_sub_module_service';
import { MasterBookmarkPage } from '../master/bookmark/master_bookmark_page_service';

// URL and Endpoints
const URL = 'account/user_bookmarks';

const ENDPOINTS = {
  selection_list: `${URL}/selection_list`,
  save_selection: `${URL}/save_selection`,
  selected_list: `${URL}/selected_list`,
  bookmark_page_by_url_add: `${URL}/bookmark_page_by_url_add`,
  bookmark_page_by_url_remove: `${URL}/bookmark_page_by_url_remove`,
};

// UserBookmark Interface
export interface UserBookmark {
  user_bookmark_id: string;

  sort_order: number;
  is_selected: boolean;

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

  user_id: string;
  User?: User;
  user_details?: string;
  user_image_url?: string;

  bookmark_module_id: string;
  MasterBookmarkModule?: MasterBookmarkModule;
  module_name?: string;

  bookmark_sub_module_id: string;
  MasterBookmarkSubModule?: MasterBookmarkSubModule;
  sub_module_name?: string;

  bookmark_page_id: string;
  MasterBookmarkPage?: MasterBookmarkPage;
  page_name?: string;
  page_icon_name?: string;
  page_url?: string;
}

export const UserBookmarkSelectionQuerySchema = z.object({
  organisation_id: single_select_mandatory('UserOrganisation'),
  user_id: single_select_mandatory('User'),
});
export type UserBookmarkSelectionQueryDTO = z.infer<typeof UserBookmarkSelectionQuerySchema>;

export const UserBookmarkSaveSelectionItemSchema = z.object({
  bookmark_page_id: single_select_mandatory('MasterBookmarkPage'),
  sort_order: numberMandatory('Sort Order'),
});

export const UserBookmarkSaveSelectionSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'),
  user_id: single_select_mandatory('User'),

  pages: z.array(UserBookmarkSaveSelectionItemSchema).default([]),
});
export type UserBookmarkSaveSelectionDTO = z.infer<typeof UserBookmarkSaveSelectionSchema>;

export const UserBookmarkPageURLSchema = z.object({
  // Relations - Parent
  organisation_id: single_select_mandatory('UserOrganisation'),
  user_id: single_select_mandatory('User'),
  page_url: stringMandatory('Page URL', 1, 300),
});
export type UserBookmarkPageURLDTO = z.infer<typeof UserBookmarkPageURLSchema>;

// API Methods
export const user_bookmark_get_selection_list = async (data: UserBookmarkSelectionQueryDTO): Promise<FBR<UserBookmark[]>> => {
  return apiPost<FBR<UserBookmark[]>, UserBookmarkSelectionQueryDTO>(ENDPOINTS.selection_list, data);
};

export const user_bookmark_save_selection = async (data: UserBookmarkSaveSelectionDTO): Promise<SBR> => {
  return apiPost<SBR, UserBookmarkSaveSelectionDTO>(ENDPOINTS.save_selection, data);
};

export const user_bookmark_get_selected_list = async (data: UserBookmarkSelectionQueryDTO): Promise<FBR<UserBookmark[]>> => {
  return apiPost<FBR<UserBookmark[]>, UserBookmarkSelectionQueryDTO>(ENDPOINTS.selected_list, data);
};

export const user_bookmark_page_by_url_add = async (data: UserBookmarkPageURLDTO): Promise<SBR> => {
  return apiPost<SBR, UserBookmarkPageURLDTO>(ENDPOINTS.bookmark_page_by_url_add, data);
};

export const user_bookmark_page_by_url_remove = async (data: UserBookmarkPageURLDTO): Promise<SBR> => {
  return apiPost<SBR, UserBookmarkPageURLDTO>(ENDPOINTS.bookmark_page_by_url_remove, data);
};
