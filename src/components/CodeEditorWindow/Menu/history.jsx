import React, { useEffect, useState } from "react";
import { SwipeableDrawer, Button, Box, Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditorCommon from '../../EditorCommon';
import PropTypes from "prop-types";

function History({ state, code, handleEditorChange, toggleDrawer }) {
  const [viewCode, setViewCode] = React.useState("//Selected Code");
  const [history, setHistory] = useState(
    localStorage.getItem("history")
      ? JSON.parse(localStorage.getItem("history"))
      : []
  );

  useEffect(() => {
    setHistory(
      localStorage.getItem("history")
        ? JSON.parse(localStorage.getItem("history"))
        : []
    );
  }, [state]);

  function formatJSON(val = {}) {
    if (val && Object.keys(val).length !== 0) {
      try {
        return JSON.stringify(val, null, 2);
      } catch {
        const errorJson = {
          error: `HERE ${val}`,
        };
        return JSON.stringify(errorJson, null, 2);
      }
    } else {
      return "";
    }
  }

  const columns = [
    {
      field: "method",
      headerName: "Method",
      width: 100,
      valueGetter: (params) => params.row.code.method,
    },
    {
      field: "endpoint",
      headerName: "Endpoint",
      minWidth: 100,
      valueGetter: (params) => params.row.code.endpoint,
      flex: 1,
    },
    {
      field: "time",
      headerName: "Time",
      width: 100,
      valueGetter: (params) => params.row.time,
    },
    {
      field: "date",
      headerName: "Date",
      width: 100,
      valueGetter: (params) => params.row.date,
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => deleteIcon(params.row),
    },
  ];
  function deleteIcon(data) {
    return (
      <Button
        color="error"
        onClick={() => {
          const updatedHistory = history.filter((item) => item.idx != data.idx);

          localStorage.setItem("history", JSON.stringify(updatedHistory));
          setHistory(JSON.parse(localStorage.getItem("history")));
          return;
        }}
      >
        <DeleteIcon />
      </Button>
    );
  }
  return (
    <React.Fragment key={"History"}>
      <SwipeableDrawer
        anchor="top"
        open={state}
        onClose={toggleDrawer("history", false)}
        onOpen={toggleDrawer("history", true)}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
          }}
        >
          <Box
            sx={{
              width: "60%",
              height: "100%",
              overflow: "hidden",
              overflowY: "scroll",
            }}
          >
            <Stack direction="row" spacing={2}>
              <Typography variant="h5" m={2} gutterBottom>
                History Mode
              </Typography>
            </Stack>
            {history.length === 0 && (
              <Stack direction="row" spacing={2}>
                <Typography variant="h6" m={2} gutterBottom>
                  No history available
                </Typography>
              </Stack>
            )}
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="stretch"
              spacing={2}
              m={2}
            >
              {history.length > 0 && (
                <div style={{ height: "375px", width: "100%" }}>
                  <DataGrid
                    sx={{
                      "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                        outline: "none !important",
                      },
                      "& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-columnHeader:focus":
                        {
                          outline: "none !important",
                        },
                    }}
                    rows={history}
                    columns={columns}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 5,
                        },
                      },
                    }}
                    pageSizeOptions={[5, 10, 15]}
                    rowsPerPageOptions={[5, 10]}
                    getRowId={(row) => `${row.idx}`}
                    onRowClick={(params) => {
                      setViewCode(
                        `${params.row.code.method} ${
                          params.row.code.endpoint
                        } \n${formatJSON(params.row.code.reqBody)} \n`
                      );
                    }}
                  />
                </div>
              )}
            </Stack>
          </Box>
          <Box
            sx={{
              width: "40%",
              height: "100%",
            }}
            m={2}
          >
            <EditorCommon
              height="400px"
              value={viewCode}
              options={{
                scrollBeyondLastLine: false,
                fontSize: 12,
                wordWrap: "on",
                minimap: { enabled: false },
                automaticLayout: true,
                readOnly: true,
                mouseWheelZoom: true,
              }}
            />

            <Stack direction="row" spacing={2} mt={2}>
              <Button
                key={"apply"}
                variant="outlined"
                color="success"
                onClick={() => {
                  handleEditorChange("code", `${viewCode} \n${code}`);
                  toggleDrawer("history", false)();
                }}
              >
                Apply Code
              </Button>
              <Button
                key={"close"}
                variant="outlined"
                color="error"
                onClick={toggleDrawer("history", false)}
              >
                Close
              </Button>
            </Stack>
          </Box>
        </Box>
      </SwipeableDrawer>
    </React.Fragment>
  );
}
History.propTypes = {
  state: PropTypes.bool,
  toggleDrawer: PropTypes.func,
  handleEditorChange: PropTypes.func,
  code: PropTypes.string,
};

export default History;
