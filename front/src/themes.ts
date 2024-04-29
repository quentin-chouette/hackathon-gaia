import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    ch_blue: Palette['primary'];
  }

  interface PaletteOptions {
    ch_blue?: PaletteOptions['primary'];
  }
}

export const chouetteTheme = createTheme({
  palette: {
    primary: {
      main: '#a6c318',
      light: '#c4e425',
      dark: '#5C6E0C',
      contrastText: '#031c26',
    },
    secondary: {
      main: '#08465E',
      light: '#0D6F96',
      dark: '#031C26',
      contrastText: '#ECF9FD',
    },
    error: {
      main: '#FC9419',
      contrastText: '#ECF9FD',
    },
    info: {
      main: '#b5e8f7',
      dark: '#7ba3b2',
      contrastText: '#031c26',
    },
    ch_blue: {
      main: '#0D6F96',
      light: '#B5E8F7',
      dark: '#031C26',
    },
  },
  typography: {
    fontFamily: 'Satoshi, Arial',
  },
  components: {
    
    MuiButton: {
      variants: [
        {
          props: { size: 'small' },
          style: {
            height: '32px',
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: '16px',
            textTransform: 'none',
            marginBottom: 2,
          },
        },
        {
          props: { size: 'medium' },
          style: {
            height: '56px',
            fontSize: '16px',
            fontWeight: 700,
            lineHeight: '24px',
            textTransform: 'none',
            marginBottom: 2,
          },
        },
      ],
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          '--InputLabel-labelColor': '#ecf9fd',
          '--InputLabel-disabledColor': '#7ba3b2',
          color: 'var(----InputLabel-labelColor)',
          margin: '4px',
          fontSize: '16px',
          fontWeight: 700,
          '&.MuiInputLabel-root.Mui-disabled': {
            color: 'var(--InputLabel-disabledColor)',
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          margin: '4px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '--TextField-backGroundColor': '#08465E',
          '--TextField-disabledBackGroundColor': '#031c26',
          '--TextField-textColor': '#ecf9fd',
          '--TextField-disabledTextColor': '#7ba3b2',
          '--TextField-brandBorderColor': '#0d6f96',
          '--TextField-brandBorderHoverColor': '#ecf9fd',
          '--TextField-brandBorderErrorColor': '#fe9696',
          '--TextField-brandBorderDisabledColor': '#08465e',
          '--TextField-brandBorderFocusedColor': '#7ba3b2',
          '& label.Mui-focused': {
            color: 'var(--TextField-brandBorderFocusedColor)',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: 'var(--TextField-brandBorderColor)',
        },
        root: {
          [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: 'var(--TextField-brandBorderHoverColor)',
          },
          [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: 'var(--TextField-brandBorderFocusedColor)',
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--TextField-backGroundColor)',
          color: 'var(--TextField-textColor)',
          borderRadius: 8,
          border: '1px solid var(--TextField-brandBorderColor)',

          '& .MuiInputBase-input': {
            padding: '8px',
          },
          '&:focus': {
            backgroundColor: 'var(--TextField-backGroundColor)',
            color: 'var(--TextField-textColor)',
          },
          '&::before, &::after': {
            borderBottom: '0',
          },
          '&:hover:not(.Mui-disabled, .Mui-error)': {
            border: '1px solid var(--TextField-brandBorderHoverColor)',
            backgroundColor: 'var(--TextField-backGroundColor)',
          },
          '&:hover:not(.Mui-disabled, .Mui-error):before': {
            borderBottom: '0',
          },
          '&.Mui-error': {
            border: '1px solid var(--TextField-brandBorderErrorColor)',
            backgroundColor: 'var(--TextField-backGroundColor)',
          },
          '&.Mui-focused': {
            backgroundColor: 'var(--TextField-backGroundColor)',
            borderBottom: '0',
            border: '1px solid var(--TextField-brandBorderHoverColor)',
          },
          '&.Mui-disabled': {
            border: '1px solid var(--TextField-brandBorderDisabledColor)',
            backgroundColor: 'var(--TextField-disabledBackGroundColor)',
          },
        },
      },
    },
  },
});
