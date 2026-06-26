export interface KilometerMonthly extends Record<string, unknown> {
  "01": string;
  "02": string;
  "03": string;
  "04": string;
  "05": string;
  "06": string;
  "07": string;
  "08": string;
  "09": string;
  "10": string;
  "11": string;
  "12": string;
  "13": string;
  "14": string;
  "15": string;
  "16": string;
  "17": string;
  "18": string;
  "19": string;
  "20": string;
  "21": string;
  "22": string;
  "23": string;
  "24": string;
  "25": string;
  "26": string;
  "27": string;
  "28": string;
  "29": string;
  "30": string;
  "31": string;

  si: number;
  year_month: string; // 2024-06-
  total_km: string;

  org_id: string;
  db_i: string;
  db_g: string;

  v_id: string;
  vn_f: string;
  vt: string;

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

  d_id: string;
  dr_f?: string;
  dr_url?: string;
}
