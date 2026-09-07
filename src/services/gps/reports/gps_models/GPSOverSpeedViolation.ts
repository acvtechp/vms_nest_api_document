export interface GPSOverSpeedViolation extends Record<string, unknown> {
  si: number;

  date_f: string;
  day: string;

  org_id: string;
  db_i: string;
  db_g: string;

  v_id: string;
  vn_f: string;
  vt: string;

  fleet_name?: string;
  sub_company_name?: string;
  branch_name?: string;
  color_name?: string;
  tag_name?: string;

  vehicle_type?: string;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_sub_model?: string;
  status_type?: string;
  ownership_type?: string;
  associated_to?: string;
  fuel_type?: string;
  fuel_unit?: string;

  d_id: string;
  dr_f?: string;
  dr_url?: string;

  fdt: string;
  tdt: string;
  fdts: number;
  tdts: number;
  ms: number;
  as: number;
  ts: number;
  dm: number;
  dm_km: string;
  fdt_f: string;
  tdt_f: string;

  fdt_f_db: string;
  tdt_f_db: string;

  ts_f: string;

  s_la: number;
  s_lo: number;
  s_gl: string;
  s_lid: string;
  s_ll: string;
  s_ld: number;

  e_la: number;
  e_lo: number;
  e_gl: string;
  e_lid: string;
  e_ll: string;
  e_ld: number;
}
