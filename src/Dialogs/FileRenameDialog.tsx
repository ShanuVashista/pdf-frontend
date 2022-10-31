import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogProps,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import { X } from "react-feather";
import { $crud } from "../factories/CrudFactory";
import { $state } from "../router";
import { Loading } from "../pages/Loading";

interface FileRenameDialogInterface extends Partial<DialogProps> {
  fileId: any;
  retrieveFiles: any;
}

export function FileRenameDialog(props: FileRenameDialogInterface) {
  const { open, fileId, retrieveFiles, ...dialogProps } = props;
  const [loading, setLoading] = useState(false);
  const [docname1st, setDocname1st] = useState<any>("");
  const [docname2nd, setDocname2nd] = useState<any>("");

  const close = () => {
    dialogProps.onClose(null, null);
  };

  const retrieveFile = async () => {
    try {
      setLoading(true);
      const { data } = await $crud.get(`file/get-file/${fileId}`, {});
      setDocname1st(data[0].docname.split(".")[0]);
      setDocname2nd(data[0].docname.split(".")[1]);
    } finally {
      setLoading(false);
    }
  };

  const RenameFile = async () => {
    try {
      setLoading(true);
      await $crud.put("file/update-file", {
        fileId: fileId,
        docname: docname1st + "." + docname2nd,
      });
    } finally {
      setLoading(false);
      retrieveFiles();
      $state.go("files");
      close();
    }
  };

  useEffect(() => {
    if (fileId !== undefined) retrieveFile();
  }, [fileId]);

  return (
    <>
      {!loading ? (
        <Dialog open={open} maxWidth="xs" fullWidth {...dialogProps}>
          <Grid container alignItems="center">
            <Grid item xs>
              <Typography variant={"h6"} className="p-3 font-weight-bold">
                Rename PDF file
              </Typography>
            </Grid>
            <IconButton onClick={close}>
              <X />
            </IconButton>
          </Grid>
          <Divider />
          <Grid className="p-3">
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              color="primary"
              label="Rename PDF File"
              value={docname1st}
              onChange={(e) => setDocname1st(e.target.value)}
            />
          </Grid>
          <Divider />
          <Grid
            container
            alignItems="center"
            justifyContent="flex-end"
            className="p-2-all"
          >
            <Grid className="pr-3">
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={RenameFile}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Dialog>
      ) : (
        <Loading />
      )}
    </>
  );
}
