export const environment = {
  production: true,
  recaptchaSiteKey: '6LcvkXEUAAAAAMJBOmTtyfAfnpX2Dssn8MWWd_sO',
  googleAnalyticsMeasurementId: 'G-JTGNKHGT46',
  googleAdsMeasurementId: 'AW-17721144829',
  googleAdsConversionLabel: 'UT4lCOzr_L0bEP3rjIJC',
  googleAdsConversionValue: 30.0,
  googleAdsConversionCurrency: 'BGN',
  supabase: {
    url: process.env['SUPABASE_URL'] || '',
    anonKey: process.env['SUPABASE_ANON_KEY'] || '',
  },
};
