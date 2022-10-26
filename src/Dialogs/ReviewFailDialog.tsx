import React, { useState } from "react";
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

interface ReviewFailDialogInterface extends Partial<DialogProps> {
  fileId: any;
}

export function ReviewFailDialog(props: ReviewFailDialogInterface) {
  const { open, fileId, ...dialogProps } = props;
  const [reason, setReason] = useState<any>("");
  const [loading, setLoading] = useState(false);

  const close = () => {
    dialogProps.onClose(null, null);
  };

  const failReview = async () => {
    try {
      setLoading(true);
      await $crud.put("file/review-file", {
        fileId: fileId,
        isReviewd: false,
        fail_reason: reason,
      });
    } finally {
      setLoading(false);
      $state.go("files");
      close();
    }
  };

  return (
    <Dialog open={open} maxWidth="xs" fullWidth {...dialogProps}>
      <Grid container alignItems="center">
        <Grid item xs>
          <Typography variant={"h6"} className="p-3 font-weight-bold">
            PDF file review fail
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
          label="Reason for review fail"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
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
            onClick={failReview}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  );
}
