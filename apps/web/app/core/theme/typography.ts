import { TypographyOptions } from '@mui/material/styles/createTypography';

export const typography: TypographyOptions = {
  fontFamily: ['"Inter"', '"Plus Jakarta Sans"', '-apple-system', 'sans-serif'].join(','),
  h1: { fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.25 },
  h2: { fontSize: '1.875rem', fontWeight: 700, lineHeight: 1.3 },
  h3: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.35 },
  h4: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 },
  h5: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.4 },
  h6: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.45 },
  subtitle1: { fontSize: '1rem', fontWeight: 500, lineHeight: 1.5 },
  subtitle2: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.5 },
  body1: { fontSize: '0.9375rem', fontWeight: 400, lineHeight: 1.5 },
  body2: { fontSize: '0.8125rem', fontWeight: 400, lineHeight: 1.5 },
  button: { fontSize: '0.875rem', fontWeight: 600, textTransform: 'none' },
  caption: { fontSize: '0.75rem', fontWeight: 400, lineHeight: 1.5 },
  overline: { fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase' },
};
