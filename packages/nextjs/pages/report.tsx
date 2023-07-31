// import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
// import Image from "next/image";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import { Box, Button, Container, MenuItem, Select, TextField } from "@mui/material";
import { styled } from "@mui/system";
import type { NextPage } from "next";
import { useDropzone } from "react-dropzone";

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16,
};

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: 500,
  height: 500,
  padding: 4,
  boxSizing: "border-box",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
};

const img = {
  display: "block",
  width: "auto",
  height: "100%",
};

const test = {
  // width: '500px',
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: "2px",
  borderRadius: "2px",
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const getColor = props => {
  if (props.isDragAccept) {
    return "#00e676";
  }
  if (props.isDragReject) {
    return "#ff1744";
  }
  if (props.isFocused) {
    return "#2196f3";
  }
  return "#eeeeee";
};

const DropContainer = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  // border-width: 2px;
  border-radius: 2px;
  border-color: ${props => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
  height: 30vh;
  // marginTop: 0px;
`;

const StyledBox = styled(Box)(props => {
  console.log("styled props", props);
  return {
    "&   *": {
      margin: props.theme.spacing(1),
      // padding: props.theme.spacing(1),
    },
  };
});

const StyledMenuItem = styled(MenuItem)`
  // background-color: red;
  color: white;
`;

const ExampleUI: NextPage = () => {
  return (
    <>
      <div className=" flex items-center justify-center ">
        <Container maxWidth="xs">
          <Box style={{ backgroundColor: "#cfe8fc" }}>
            <CreateNFTWhenContractExist />
          </Box>
        </Container>
      </div>
    </>
  );
};

export default ExampleUI;

function CreateNFTWhenContractExist() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [alertLevel, setAlertLevel] = useState(0);
  const [type, setType] = useState(0);

  const [files, setFiles] = useState([]);

  // const selectedCollection = useMinterLabStore(state => state.selectedCollection);

  const [price, setPrice] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);

  // const { data: signer, isError, isLoading } = useSigner();
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
    maxFiles: 1,
    accept: {
      "image/*": [],
    },
    onDrop: acceptedFiles => {
      setFiles(
        acceptedFiles.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ),
      );
      console.log(acceptedFiles);
      console.log(acceptedFiles[0]);
    },
  });

  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          alt="hello"
          src={file.preview}
          style={img}
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <StyledBox>
      <div style={test}>
        <section className="container">
          <DropContainer {...getRootProps({ isFocused, isDragAccept, isDragReject })}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop a file here, or click to select a file</p>
          </DropContainer>
          <aside style={thumbsContainer}>{thumbs}</aside>
        </section>
      </div>

      <form
        // onSubmit={handleIpfs}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <TextField label="Name" variant="outlined" value={name} onChange={e => setName(e.target.value)} />

        <TextareaAutosize
          aria-label="minimum height"
          minRows={3}
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <h1>제보 종류</h1>

        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={alertLevel}
          label="alertLevel"
          onChange={e => setAlertLevel(e.target.value)}
        >
          <StyledMenuItem value={10}>Ten</StyledMenuItem>
          <StyledMenuItem value={20}>Twenty</StyledMenuItem>
          <StyledMenuItem value={30}>Thirty</StyledMenuItem>
        </Select>

        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={type}
          label="Age"
          onChange={e => setType(e.target.value)}
        >
          <StyledMenuItem value={10}>Ten</StyledMenuItem>
          <StyledMenuItem value={20}>Twenty</StyledMenuItem>
          <StyledMenuItem value={30}>Thirty</StyledMenuItem>
        </Select>
        <Button variant="contained" type="submit">
          Create NFT
        </Button>
      </form>
      {/* <Button variant='contained' onClick={getTokenId}>getID</Button> */}
    </StyledBox>
  );
}
