import { createTheme } from "@material-ui/core";
import { colors } from '@material-ui/core';

const mainTheme = createTheme ({
    palette: {
        primary: {
            contrastText: '#FFFFFF',
            dark: "#820000",
            main: '#940000',
            light: "#b02a2a"
        },
        secondary: {
            contrastText: '#FFFFFF',
            dark: "#000000",
            main: '#333333',
            light: "#777777"
        },
        action: {
          disabledBackground: '#333333',
          disabled: '#777777',
        }
    },
    typography: {
        fontFamily: [
            'Inter',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        h5: {
            fontSize: '1.2rem',
            fontWeight: '600',
        },
        subtitle1: {
            fontWeight: '600',
        }
    },
    overrides: {
        MuiButton: {
            contained: {
                borderRadius: '0',
                textTransform: 'none',
                letterSpacing: '-0.15px',
            },
            outlined: {
                borderRadius: '0',
                textTransform: 'none',
                letterSpacing: '-0.15px',
                '&.large-button.Mui-disabled': {
                    borderColor: '#EEE',
                }
            },
            text: {
                borderRadius: '0',
                textTransform: 'none',
                letterSpacing: '-0.15px',
            },
        },
        MuiAppBar: {
            root: {
                background: 'hsla(0,0%,100%,.85)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 0 10px rgb(0 0 0 / 5%)',
            },
            colorDefault: {
                backgroundColor: "#FFFFFF",
            }
        },
        MuiTextField: {
            root: {
                [`& fieldset`]: {
                    borderRadius: '0',
                },
            },
        },
        MuiFormControl: {
            root: {
                [`& fieldset`]: {
                    borderRadius: '0',
                }
            },
        },
        MuiFormControlLabel: {
            root: {
                fontSize: '0.875rem',
            }
        },
        MuiFormLabel: {
            root: {
                color: '#000000',
                fontWeight: '500',
            }
        },
        MuiDialogTitle: {
            root: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }
        },
        MuiDialogActions: {
            root: {
                padding: '24px',
            }
        },
        MuiDialogContent: {
            root: {
                padding: '0px',
            }
        },
        MuiFab: {
            extended: {
                background: 'rgb(245, 248, 255)',
                border: 'none',
                boxShadow: 'none',
                fontSize: '1rem',
                color: '#0053FF',
                textTransform: 'none',
                '&:hover': {
                    border: 'none',
                    background: 'rgba(0, 83, 255, 0.2)',
                },
                '&:active': {
                    border: 'none',
                    boxShadow: 'none',
                }
            },
        },
        MuiDataGrid: {
            root: {
                border: '1px solid #EEEEEE',
                borderRadius: 0,
                '& .MuiDataGrid-iconSeparator': {
                  display: 'none',
                },
                '& .MuiDataGrid-colCellTitle': {
                    marginRight:'5px',
                    color: '#777',
                    fontWeight: 400,
                },
                '& .MuiDataGrid-cell:focus-within': {
                    outline:'none',
                },
                '& .MuiDataGrid-columnHeader--alignRight': {
                    display: 'none',
                },
                '& .MuiDataGrid-cellRight': {
                    paddingRight:0,
                },
                '& .MuiDataGrid-columnHeaderTitleContainer' : {
                    padding: 0,
                }
            }
        },
        MuiPaper: {
            rounded: {
                borderRadius: '0',
            },
            outlined: {
                borderColor: '#EEEEEE',
            }
        },
        MuiList: {
            root: {
                padding:'0 !important',
            },
        },
        MuiAlert: {
            root: {
                borderRadius: 0,
            }
        }
    },
});

export { mainTheme };