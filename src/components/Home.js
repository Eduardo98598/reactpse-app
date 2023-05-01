import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

import DataGrid, {
    Column,
    Export,
    Pager,
    Paging,
    SearchPanel, ExcelFilter, PdfExport, ExcelExport,
} from 'devextreme-react/data-grid';
import { Button } from 'devextreme-react/button';
import { TextField } from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiDataGrid-columnHeaderWrapper': {
            fontSize: '14px',
        },
        '@media (max-width: 767px)': {
            '& .MuiDataGrid-colCell, & .MuiDataGrid-cell': {
                width: '100%',
            },
            '& .MuiDataGrid-colCellTitle': {
                fontSize: '12px',
                fontWeight: 'bold',
            },
            '& .MuiDataGrid-columnsContainer': {
                display: 'none',
            },
            '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #ddd',
                padding: '8px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                '&::before': {
                    content: 'attr(data-field-name)',
                    fontWeight: 'bold',
                    marginRight: '8px',
                },
            },
        },
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        '& .dx-textbox': {
            width: '100%',
            marginBottom: theme.spacing(2),
            borderRadius: theme.spacing(1),
            border: '1px solid #ccc',
            padding: theme.spacing(1),
            fontSize: '2rem',
        },
        '& .dx-button': {
            background: '#007bff',
            color: '#fff',
            fontWeight: 'bold',
            letterSpacing: '1px',
            borderRadius: theme.spacing(1),
            padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
            textTransform: 'uppercase',
            '&:hover': {
                background: '#0069d9',
            },
        },
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        width: '100%',// Modificado para hacer más grande el formulario
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '100%',
        },
    },
    button: {
        margin: theme.spacing(2),
        color: '#fff',
        backgroundColor: '#4CAF50',
        '&:hover': {
            backgroundColor: '#388E3C',
        },
    },
    tableContainer: {
        '& .dx-datagrid-table': {
            borderCollapse: 'collapse',
            width: '100%',
            height: '100%',
            '& th': {
                background: '#f5f5f5',
                padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
                border: '1px solid #ccc',
                textAlign: 'center',
                fontWeight: 'bold',
            },
            '& td': {
                padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
                border: '1px solid #ccc',
            },
        },
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '20vh',
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
}));

const Home = () => {
    const [tableData, setTableData] = useState([]);
    const [licencia, setLicencia] = useState('');
    const [clave, setClave] = useState('');
    const [loading, setLoading] = useState(false);
    const [formValid, setFormValid] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');


    const pageSizes = [10, 25, 50, 100];



    const fetchData = () => {
        fetch(`http://localhost:3000/api/repse?search=${clave}&license=${licencia}`)
            .then(response => response.json())
            .then(data => {
                setTableData(data.data);
                setAlertMessage(data.message);
                setAlertSeverity(data.success ? 'success' : 'error');
            })
            .catch(error => console.error(error))
            .finally(() => setLoading(false));
    };

    const handleClick = () => {
        setLoading(true);
        fetchData();
    }

    const classes = useStyles();
    return (
        <div>
            {alertMessage && (
                <Alert severity={alertSeverity} onClose={() => setAlertMessage('')}>
                    {alertMessage}
                </Alert>
            )}
            <div className={classes.container}>
                <h2>Inicio</h2>
                <form className={classes.form}>
                    <TextField
                        id="licencia"
                        label="Licencia"
                        variant="outlined"
                        value={licencia}
                        onChange={(e) => {
                            setLicencia(e.target.value);
                            setFormValid(e.target.value !== '' && clave !== '');
                        }}
                        required // agrega la propiedad required
                        error={licencia === ''} // muestra un mensaje de error si el campo está vacío
                        helperText={licencia === '' ? 'Este campo es requerido' : ''}
                    />

                    <TextField
                        id="clave"
                        label="Clave"
                        variant="outlined"
                        value={clave}
                        onChange={(e) => {
                            setClave(e.target.value);
                            setFormValid(e.target.value !== '' && licencia !== '');
                        }}
                        required // agrega la propiedad required
                        error={clave === ''} // muestra un mensaje de error si el campo está vacío
                        helperText={clave === '' ? 'Este campo es requerido' : ''}
                    />
                    <Button text="Consultar" onClick={handleClick} className={classes.button} color="primary" disabled={!formValid} />
                </form>
            </div>
            <div className={classes.tableContainer}>
                {loading ? (
                    <div className={`${classes.loading} ${classes.center}`}>
                        <CircularProgress color="secondary" size={60} />
                    </div>
                ) : (
                    <div className={classes.root}>
                        <DataGrid dataSource={tableData} showBorders={true} autoExpandAllGroups={true} width={'100%'}>
                            <SearchPanel visible={true} width={'auto'} placeholder="Buscar..." />
                            <Paging pageSize={pageSizes} defaultPageIndex={0} />
                            <Column dataField="BusinessName" caption="Empresa" width={'auto'} />
                            <Column dataField="RegisterNumber" caption="No Registro" width={'auto'} />
                            <Column dataField="Folio" caption="Folio" width={'auto'} />
                            <Column dataField="PageInfo" caption="Página" width={'auto'} />
                            <Pager allowedPageSizes={pageSizes} showPageSizeSelector={true} />
                            <Paging defaultPageSize={pageSizes[0]} />
                            <Export enabled={true} allowExportSelectedData={true} texts={{
                                exportAll: 'Exportar a Excel (todos)',
                                exportSelectedRows: 'Exportar a Excel (seleccionados)',
                                exportTo: 'Exportar',
                                pdfExportOptions: 'Opciones de exportación PDF',
                                excelExportOptions: 'Opciones de exportación Excel'
                            }}>
                                <ExcelFilter enabled={true} />
                                <PdfExport fileName="reporte.pdf" title="Reporte" />
                                <ExcelExport fileName="reporte.xlsx" title="Reporte" />
                            </Export>
                        </DataGrid>
                    </div>
                )}
            </div>
        </div>
    );

};



export default Home;
