import React, { useState, useEffect } from 'react';
import { Button, LinearProgress } from '@material-ui/core';
import { DataGrid, GridOverlay } from '@material-ui/data-grid';

const SponsorsList = (props) => {

    function LinearLoadingOverlay() {
      return (
        <GridOverlay>
          <div style={{
            position: 'absolute',
            top: 0,
            width: '100%',
          }}>
            <LinearProgress />
          </div>
        </GridOverlay>
      )
    }
  
    const col = [
      // { field: '_id', headerName: 'ID', flex: 1, },
      { field: 'name', headerName: 'Full Name', flex: 1, },
      { field: 'email', headerName: 'Email', flex: 2, },
    //   { field: 'customer', headerName: 'Customer', flex: 1.5 },
    //   { field: 'type', headerName: 'Job Type', flex: 1.5 },
    //   { field: 'description', headerName: 'Job Description', flex: 2 },
    //   // { field: 'isAnalysis', headerName: 'Analysis', type: 'boolean', flex: 1 },
    //   { field: 'invoiced', headerName: 'Invoiced', type: 'boolean', flex: 1 },
    //   { field: 'rate', headerName: 'Rate', flex: 1 },
    //   { field: 'quantity', headerName: 'Quantity', flex: 1 },
    //   { field: 'note', headerName: 'Note', flex: 1 },
    //   // { field: 'status', headerName: 'Status', flex: 1 },
      {
        field: 'action',
        type: 'number',
        sortable: false,
        selectable: false,
        flex: 1,
        renderCell: (params) => (
          <div style={{
              display: 'table',
              paddingRight: 5,
              overflow: 'auto',
          }}>
            <Button
              // disabled
              variant="text"
              color="primary"
              onClick={e=>params.value.detail_fn(`./sponsors/detail/${params.value.sponsor_id}`)}>
                Details
            </Button>
          </div>
        ),
      },
    ];

    const [rows, setRows] = useState(props.data);

    useEffect(() => {
      setRows(props.data);
    }, [props.loading, props.refresh, props]);

    return (
    
            <DataGrid 
              getRowId={(row)=>row._id}
              loading={props.loading}
              autoHeight
              rows={rows} 
              columns={col} 
              density='standard'
              autoPageSize
              disableColumnMenu
              disableSelectionOnClick
              components={{
                LoadingOverlay: LinearLoadingOverlay,
              }}
               />
    );
    
}

export default SponsorsList;