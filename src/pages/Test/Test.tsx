import React, { useState, useEffect } from "react";
import { ReactStateDeclaration, UISref } from "@uirouter/react";
import {
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Edit, File, Share2, Trash, Upload, Settings } from "react-feather";
import { FileType } from "../../types";
import { $crud } from "../../factories/CrudFactory";
import { ShareDialog } from "../../Dialogs/ShareDialog";
import { FileRenameDialog } from "../../Dialogs/FileRenameDialog";
import { generateFormData } from "../../helpers";
import { EmptyContainer } from "../EmptyContainer";
import { Loading } from "../Loading";

const Test = () => {
  let [limit] = useState(10);
  let [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<FileType[]>([]);
  let [searchValue, setSearchValue] = useState<string>("");
  const [file, setFile] = useState<FileType>(null);
  const [show, setShow] = useState(false);
  const [renameShow, setRenameShow] = useState(false);

  const retrieveFiles = async () => {
    try {
      setLoading(true);
      const { data } = await $crud.post("file/list-files", {
        limit,
        page,
        cond: { search: searchValue },
      });
      setFiles(data);
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (id) => {
    await $crud.confirm({
      textContent: "This file won't be revert.",
    });
    await $crud.put(`file/delete-file/${id}`);
    retrieveFiles();
  };

  const uploadFile = async () => {
    setLoading(true);
    try {
      const file = await $crud.chooseFile({ accept: "application/pdf" });
      await $crud.post(
        "file/add-file",
        generateFormData({
          filename: file,
          docname: file.name,
        })
      );
    } finally {
      retrieveFiles();
      setLoading(false);
    }
  };

  const searchData = async (e) => {
    searchValue = e.target.value;

    await setSearchValue(e.target.value);

    if (searchValue !== "") {
      retrieveFiles();
    } else {
      setSearchValue("");
      retrieveFiles();
    }
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
          PDF Files Without PDFTRON
        </Typography>

        <Grid>
          <TextField
            fullWidth
            label="Search"
            value={searchValue}
            onChange={searchData}
            variant="outlined"
            size="small"
            color="primary"
          />
        </Grid>
        <Grid>
          <Button variant="outlined" onClick={uploadFile}>
            <Upload size={16} className="mr-2" /> Upload
          </Button>
        </Grid>
      </Grid>
      {!loading ? (
        files.length !== 0 ? (
          <Grid container alignItems="center" className="p-2-all">
            {files &&
              files.map((file, i) => (
                <Grid item xs={6} md={4} lg={3} key={i}>
                  <Paper elevation={1}>
                    <Grid container alignItems="center">
                      <Grid
                        item
                        xs={12}
                        className="p-3 text-center position-relative"
                      >
                        <File size={180} className="text-success" />
                        <IconButton
                          style={{ top: 12, right: 40 }}
                          className="position-absolute"
                          onClick={() => {
                            setShow(true);
                            setFile(file);
                          }}
                        >
                          <Tooltip title="Share File For Signature">
                            <Share2 size={20} />
                          </Tooltip>
                        </IconButton>
                        <IconButton
                          style={{ top: 12, right: 0 }}
                          className="position-absolute"
                          onClick={() => {
                            setRenameShow(true);
                            setFile(file);
                          }}
                        >
                          <Tooltip title="Rename Files">
                            <Settings size={20} />
                          </Tooltip>
                        </IconButton>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        container
                        alignItems="center"
                        className="p-2"
                      >
                        <Typography
                          component={Grid}
                          item
                          xs
                          variant="body2"
                          className="p-1 font-weight-bold"
                        >
                          {file.docname}
                        </Typography>
                        <UISref
                          to="FileViewerTest"
                          params={{ fileId: file._id }}
                        >
                          <IconButton>
                            <Tooltip title="Edit PDF file">
                              <Edit size={16} />
                            </Tooltip>
                          </IconButton>
                        </UISref>
                        <IconButton onClick={() => deleteFile(file._id)}>
                          <Tooltip title="Delete PDF file">
                            <Trash className="text-danger" size={16} />
                          </Tooltip>
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}
          </Grid>
        ) : (
          <Grid className="p-md-5">
            <EmptyContainer content="You don't have any uploaded file" />
          </Grid>
        )
      ) : (
        <Loading />
      )}
      <ShareDialog
        fileId={file?._id}
        open={show}
        onClose={() => setShow(false)}
      />
      <FileRenameDialog
        fileId={file?._id}
        open={renameShow}
        retrieveFiles={retrieveFiles}
        onClose={() => setRenameShow(false)}
      />
    </Grid>
  );
};

export const states: ReactStateDeclaration[] = [
  {
    url: "/test",
    name: "test",
    data: {
      title: "Files",
      loggedIn: true,
    },
    component: Test,
  },
];
