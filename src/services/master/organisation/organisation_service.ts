// Axios
import { apiGet } from '../../../core/apiCall';
import { FBR } from '../../../core/BaseResponse';

// Organisation Master Models
import { OrganisationSubCompany } from './organisation_sub_company_service';
import { OrganisationBranch } from './organisation_branch_service';
import { OrganisationColor } from './organisation_color_service';
import { OrganisationTag } from './organisation_tag_service';
import { OrganisationGroup } from './organisation_group_service';

const URL = 'master/organisation';

const ENDPOINTS = {
  // Cache APIs
  cache: (organisation_id: string): string => `${URL}/cache/${organisation_id}`,
  cache_count: (organisation_id: string): string => `${URL}/cache_count/${organisation_id}`,
  cache_child: (organisation_id: string): string => `${URL}/cache_child/${organisation_id}`,
};

// Master Organisation Cache Response
export interface MasterOrganisationCacheData
  extends Record<string, unknown> {
  OrganisationSubCompany: OrganisationSubCompany[];
  OrganisationBranch: OrganisationBranch[];
  OrganisationColor: OrganisationColor[];
  OrganisationTag: OrganisationTag[];
  OrganisationGroup: OrganisationGroup[];
}

// Cache APIs
export const getMasterOrganisationCache = async (organisation_id: string): Promise<FBR<MasterOrganisationCacheData>> => {
  return apiGet<FBR<MasterOrganisationCacheData>>(ENDPOINTS.cache(organisation_id));
};

export const getMasterOrganisationCacheCount = async (organisation_id: string): Promise<FBR<MasterOrganisationCacheData>> => {
  return apiGet<FBR<MasterOrganisationCacheData>>(ENDPOINTS.cache_count(organisation_id));
};

export const getMasterOrganisationCacheChild = async (organisation_id: string): Promise<FBR<MasterOrganisationCacheData>> => {
  return apiGet<FBR<MasterOrganisationCacheData>>(ENDPOINTS.cache_child(organisation_id));
};