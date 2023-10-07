// import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import contracts from "../generated/deployedContracts";
import { ipfsUploadImage, ipfsUploadMetadata } from "../utils/ipfsUpload";
// import Image from "next/image";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import { Box, Button, Container, MenuItem, Select, TextField } from "@mui/material";
import { styled } from "@mui/system";
import { providers } from "ethers";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { useDropzone } from "react-dropzone";
import { type HttpTransport } from "viem";
import { type PublicClient, type WalletClient, useAccount, usePublicClient, useWalletClient } from "wagmi";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

console.log(ethers);

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

  const { address, isConnecting, isDisconnected } = useAccount();

  console.log(address, isConnecting, isDisconnected);

  const { writeAsync, isLoading, isMining } = useScaffoldContractWrite({
    contractName: "ERC721Token",
    functionName: "mintNFT",
    args: [address, "https://bafkreifpmyqppgkyk5fpkvst2pubyfubtyxwiit37iosfrfce6svwpllhe.ipfs.nftstorage.link/", 0],
    // For payable functions, expressed in ETH
    value: "0",
    // The number of block confirmations to wait for before considering transaction to be confirmed (default : 1).
    blockConfirmations: 1,
    // The callback function to execute when the transaction is confirmed.
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });

  // const selectedCollection = useMinterLabStore(state => state.selectedCollection);

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

  function walletClientToSigner(walletClient: WalletClient) {
    const { account, chain, transport } = walletClient;
    const network = {
      chainId: chain.id,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address,
    };
    const provider = new providers.Web3Provider(transport, network);
    const signer = provider.getSigner(account.address);
    return signer;
  }

  /** Hook to convert a viem Wallet Client to an ethers.js Signer. */
  function useEthersSigner({ chainId }: { chainId?: number } = {}) {
    const { data: walletClient } = useWalletClient({ chainId });
    return () => (walletClient ? walletClientToSigner(walletClient) : undefined);
  }
  const signer = useEthersSigner();

  async function handleIpfs(e) {
    e.preventDefault();
    // console.log("handleIpfs");
    // console.log(files[0]);

    // const cid = await ipfsUploadImage(files);
    // // setImageCID(cid + "/" + files[0].name);

    // //`https://ipfs.io/ipfs/${imageCID}`

    // const imageCID = `${cid}`;

    // // const image = `https://ipfs.io/ipfs/${imageCID}`;
    // const image = `https://${imageCID}.ipfs.nftstorage.link`;
    // // const image = `https://${imageCID}`;
    // console.log(image);

    // // code to handle NFT metadata submission goes here
    // const metadataForUpload = {
    //   name: name,
    //   description: description,
    //   alertLevel: 0,
    //   type: "fire",
    //   image: image,
    //   lat: 10,
    //   lng: 10,
    //   createdAt: 0,
    // };
    // const tokenURI = await ipfsUploadMetadata(metadataForUpload);
    // const tokenURL = `https://${tokenURI}.ipfs.nftstorage.link`;
    // // console.log("NFT IPFS upload is completed, NFT is stored at : ", `https://ipfs.io/ipfs/${tokenURI}`);
    // console.log("NFT IPFS upload is completed, NFT is stored at : ", tokenURL);

    // token uri
    // address
    // 721 mint

    // ethers

    // const ERC721 = contracts[338][0]["contracts"]["ERC721Token"];

    // console.log(ERC721.address);

    // const ERC721Contract = new ethers.Contract(ERC721.address, ERC721.abi, signer);
    // const mintTx = await ERC721Contract.mintNFT(signer.address, " ", 0);
    // const mintRc = await mintTx.wait();

    // console.log(mintRc);

    const result = await writeAsync();

    console.log(result);
  }

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

      <form onSubmit={handleIpfs} style={{ display: "flex", flexDirection: "column" }}>
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
