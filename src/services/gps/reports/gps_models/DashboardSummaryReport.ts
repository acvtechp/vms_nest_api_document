export interface DashboardSummaryReport extends Record<string, unknown> {
    today: DashboardSummaryReportChild;
    last_24: DashboardSummaryReportChild;
    this_week_sunday: DashboardSummaryReportChild;
    this_week_monday: DashboardSummaryReportChild;
    last_7_days: DashboardSummaryReportChild;
    last_30_days: DashboardSummaryReportChild;
    this_month: DashboardSummaryReportChild;
    last_3_months: DashboardSummaryReportChild;
    this_year: DashboardSummaryReportChild;
}

export interface DashboardSummaryReportChild extends Record<string, unknown> {
    label: string;

    km: number;
    dm: number;
    dm_km: string;

    m_on_ts: number;
    m_off_ts: number;
    i_on_ts: number;
    i_off_ts: number;

    ms: number;
    as: number;

    m_on_ts_f: string;
    m_off_ts_f: string;
    i_on_ts_f: string;
    i_off_ts_f: string;
}
