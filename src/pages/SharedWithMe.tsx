import React, { useEffect, useState } from "react";
import { ReactStateDeclaration, UISref } from "@uirouter/react";
import {
  Divider,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@material-ui/core";
import { Edit, File } from "react-feather";
import { SharedWithMeFileType } from "../types";
import { $crud } from "../factories/CrudFactory";
import { EmptyContainer } from "./EmptyContainer";
import { Loading } from "./Loading";

export function SharedWithMeFiles() {
  const [files, setFiles] = useState<SharedWithMeFileType[]>([]);
  const [loading, setLoading] = useState(false);

  const retrieveFiles = async () => {
    try {
      setLoading(true);
      const { data } = await $crud.post("files/receive-files-list", {
        paginate: true,
        limit: "10",
        page: "1",
      });
      setFiles(data);
    } finally {
      setLoading(false);
    }
  };

  const handleDocId = (id) => {
    localStorage.setItem("fileDocId", id);
  };

  useEffect(() => {
    retrieveFiles();
  }, []);

  return (
    <Grid className="p-2 p-2-all">
      <Grid container alignItems="center" className="p-2-all">
        <Typography
          component={Grid}
          item
          xs
          variant="h5"
          className="font-weight-bold"
        >
          Shared PDF Files With Me For Signature
        </Typography>
      </Grid>
      {!loading ? (
        files.length !== 0 ? (
          <Grid container alignItems="center" className="p-2-all">
            {files.map((file, index) => (
              <Grid item xs={6} md={4} lg={3} key={index}>
                <Paper elevation={1}>
                  <Grid container alignItems="center">
                    <Grid
                      item
                      xs={12}
                      className="p-3 text-center position-relative"
                    >
                      <File size={180} className="text-success" />
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      container
                      wrap="nowrap"
                      alignItems="center"
                      className="p-2"
                    >
                      <Grid container direction="column">
                        <Typography variant="body2" className="p-1">
                          {file.fileId.docname}
                        </Typography>
                        <Typography
                          className="p-1 font-weight-bold text-primary"
                          style={{ fontSize: 11 }}
                        >
                          Shared By {file.senderId.fullname}
                        </Typography>
                      </Grid>
                      <UISref
                        to="fileViewer"
                        params={{
                          fileId: file.fileId._id,
                        }}
                      >
                        <IconButton onClick={() => handleDocId(file._id)}>
                          <Edit size={16} />
                        </IconButton>
                      </UISref>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid className="p-md-5">
            <EmptyContainer content="You don't have any shared file for signature" />
          </Grid>
        )
      ) : (
        <Loading />
      )}
    </Grid>
  );
}

export const states: ReactStateDeclaration[] = [
  {
    url: "/shared-with-me-files",
    name: "sharedWithMeFiles",
    data: {
      title: "Shared With Me Files",
      loggedIn: true,
    },
    component: SharedWithMeFiles,
  },
];
