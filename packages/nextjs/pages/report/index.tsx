import { CSSProperties, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Box, Button, Container, FormControl, InputLabel, MenuItem, Select, TextField, css } from "@mui/material";
import { styled } from "@mui/system";
import type { NextPage } from "next";
import { useDropzone } from "react-dropzone";
import { useAccount } from "wagmi";
import Writer from "~~/components/Writer";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { ipfsUploadImage, ipfsUploadMetadata } from "~~/utils/ipfsUpload";

let ipfsCid = "bad";

const ExampleUI: NextPage = () => {
  return (
    <>
      <ReportWrapper>
        <Container>
          <Box>
            <CreateNFTWhenContractExist />
          </Box>
        </Container>
      </ReportWrapper>
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
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);

  const [cid, setCid] = useState("");

  const { address, isConnecting, isDisconnected } = useAccount();
  // const cidRef = useRef("");

  // const { writeAsync, isLoading, isMining } = useScaffoldContractWrite({
  //   contractName: "ERC721Token",
  //   functionName: "mintNFT",
  //   args: [address, cidRef.current, 0],
  //   // For payable functions, expressed in ETH
  //   value: "0",
  //   // The number of block confirmations to wait for before considering transaction to be confirmed (default : 1).
  //   blockConfirmations: 1,
  //   // The callback function to execute when the transaction is confirmed.
  //   onBlockConfirmation: txnReceipt => {
  //     console.log("Transaction blockHash", txnReceipt.blockHash);
  //   },
  // });

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
      // console.log(acceptedFiles);
      // console.log(acceptedFiles[0]);
    },
  });

  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          alt="thumbnail"
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

  const changeAlertLevel = (level: 0 | 1 | 2) => {
    setAlertLevel(level);
  };

  async function handleIpfs(e) {
    e.preventDefault();

    // alert(JSON.stringify(json));

    const cid = await ipfsUploadImage(files);
    // setImageCID(cid + "/" + files[0].name);

    //`https://ipfs.io/ipfs/${imageCID}`

    const imageCID = `${cid}`;

    // const image = `https://ipfs.io/ipfs/${imageCID}`;
    const image = `https://${imageCID}.ipfs.nftstorage.link`;
    // const image = `https://${imageCID}`;
    console.log(image);

    // code to handle NFT metadata submission goes here

    const metadataForUpload = {
      alertLevel,
      type,
      name,
      description,
      image: image,
      createdAt: Date.now(),
      lat,
      lng,
    };

    const tokenURI = await ipfsUploadMetadata(metadataForUpload);
    const tokenURL = `https://${tokenURI}.ipfs.nftstorage.link`;
    // console.log("NFT IPFS upload is completed, NFT is stored at : ", `https://ipfs.io/ipfs/${tokenURI}`);
    console.log("NFT IPFS upload is completed, NFT is stored at : ", tokenURL);

    setCid(tokenURL);
    // cidRef.current = tokenURL;
    // ipfsCid = tokenURL;
    // const result = await writeAsync();

    // console.log(result);
  }

  useEffect(() => {
    const { geolocation } = navigator;

    geolocation.getCurrentPosition(
      position => {
        // success.
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
      },
      error => {
        console.warn("Fail to fetch current location", error);
        setLat(37);
        setLng(127);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 0,
        timeout: Infinity,
      },
    );
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <StyledBox>
      <ReportTitle>
        <Image src="/icn_report.png" width={36} height={36} alt="icn_report" />
        제보하기
      </ReportTitle>
      <UploadTitle>사진 업로드</UploadTitle>
      <div style={test}>
        <UploadSection className="container">
          {thumbs.length === 0 ? (
            <DropContainer {...getRootProps({ isFocused, isDragAccept, isDragReject })}>
              <input {...getInputProps()} />
              <p>Drag `n` drop a file here, or click to select a file</p>
            </DropContainer>
          ) : (
            <aside style={thumbsContainer}>{thumbs}</aside>
          )}
        </UploadSection>
      </div>

      <form
        onSubmit={handleIpfs}
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TextField
          label="제목"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{
            marginTop: "16px",
          }}
        />

        <TextField
          multiline={true}
          label="신고 내용"
          minRows={3}
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={{
            marginTop: "20px",
          }}
        />

        <ReportCategoryTitle>제보 종류</ReportCategoryTitle>

        <ButtonBox>
          <InfoButton active={alertLevel === 0} onClick={() => changeAlertLevel(0)}>
            정보
          </InfoButton>
          <ButtonCaution active={alertLevel === 1} onClick={() => changeAlertLevel(1)}>
            주의
          </ButtonCaution>
          <AlertButton active={alertLevel === 2} onClick={() => changeAlertLevel(2)}>
            경보
          </AlertButton>
        </ButtonBox>

        <FormControl
          style={{
            margin: "29px 0",
          }}
        >
          <InputLabel shrink htmlFor="uncontrolled-native">
            재난 종류
          </InputLabel>
          <Select
            inputProps={{
              id: "uncontrolled-native",
            }}
            label="재난 종류"
            value={type}
            onChange={(e: any) => setType(e.target.value)}
          >
            <StyledMenuItem value={"heavyrain"}>호우</StyledMenuItem>
            <StyledMenuItem value={"fire"}>화재</StyledMenuItem>
            <StyledMenuItem value={"flood"}>홍수/침수</StyledMenuItem>
            <StyledMenuItem value={"collapse"}>붕괴</StyledMenuItem>
          </Select>
        </FormControl>

        <Button
          style={{
            padding: "10px 0",
            borderRadius: 30,
          }}
          variant="contained"
          type="submit"
        >
          제보하기
        </Button>
        <Writer contractName={"ERC721Token"} functionName={"mintNFT"} args={[address, cid, 0]} />
      </form>
      {/* <Button variant='contained' onClick={getTokenId}>getID</Button> */}
    </StyledBox>
  );
}

const ReportWrapper = styled("div")`
  max-width: 375px;
  width: 100%;
  margin: 0 auto;
  padding-top: 64px;
`;

const ReportTitle = styled("div")`
  margin: 18px 0;
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
`;

const UploadTitle = styled("div")`
  font-size: 16px;
  margin: 8px 0;
  font-weight: 700;
`;

const UploadSection = styled("section")`
  border: none;
  margin: 0;
  width: 100%;

  * {
    margin: 0;
  }

  aside {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const ReportCategoryTitle = styled("div")`
  font-size: 16px;
  font-weight: 700;
  margin: 20px 0;
`;

const ButtonBox = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;

  div {
    width: 101px;
    height: 48px;
    border-radius: 30px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const InfoButton = styled("div")`
  ${({ active }: { active: boolean }) =>
    active
      ? css`
          background-color: #5c90f7;
          color: #fff;
        `
      : css`
          background-color: #e0e0e0;
          color: rgba(0, 0, 0, 0.54);
        `}
`;

const ButtonCaution = styled("div")`
  ${({ active }: { active: boolean }) =>
    active
      ? css`
          background-color: #f3b06c;
          color: #fff;
        `
      : css`
          background-color: #e0e0e0;
          color: rgba(0, 0, 0, 0.54);
        `}
`;

const AlertButton = styled("div")`
  ${({ active }: { active: boolean }) =>
    active
      ? css`
          background-color: #eb585e;
          color: #fff;
        `
      : css`
          background-color: #e0e0e0;
          color: rgba(0, 0, 0, 0.54);
        `}
`;

const thumbsContainer: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
};

const thumb: CSSProperties = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  boxSizing: "border-box",
};

const thumbInner: CSSProperties = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
};

const img: CSSProperties = {
  display: "block",
  width: "100%",
  margin: "0 auto",
  objectFit: "cover",
};

const test: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: "1px",
  borderRadius: "10px",
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fff",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
  margin: "10px 0",
};

const DropContainer = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
`;

const StyledBox = styled(Box)``;

const StyledMenuItem = styled(MenuItem)`
  color: white;
`;
