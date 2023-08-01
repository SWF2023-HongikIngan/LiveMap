import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Box, ImageList, ImageListItem } from "@mui/material";
import Writer from "~~/components/Writer";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const DetailPage = () => {
  const {
    query: { id },
  } = useRouter();

  const [detailData, setDetailData] = useState({
    alertLevel: -1,
    type: "",
    name: "",
    description: "",
    timestamp: 0,
    image: "",
  });

  const { data: reports } = useScaffoldContractRead({
    contractName: "ERC721Token",
    functionName: "getActiveNFT",
    args: [],
  });

  const { data: accountAddress6551 } = useScaffoldContractRead({
    contractName: "ERC721Token",
    functionName: "getAccountAddress",
    args: [id, 0],
  });

  const { data: trueCoin } = useScaffoldContractRead({
    contractName: "ERC20Token",
    functionName: "balanceOf",
    args: [accountAddress6551],
  });

  const { data: badges } = useScaffoldContractRead({
    contractName: "ERC1155Token",
    functionName: "getTokens",
    args: [id, 0],
  });

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);

    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${month}.${day} ${hours}:${minutes}`;
  };

  useEffect(() => {
    if (id === undefined) return;
    if (reports === undefined) return;

    console.log("reports", reports);
    console.log("accountAddress6551", accountAddress6551);
    console.log("trueCoin", trueCoin);
    const index = (reports[0] as any).findIndex((reports: any) => Number(reports) === Number(id));

    fetch((reports[1] as any)[index])
      .then(res => res.json())
      .then(data => {
        console.log("data", data);

        setDetailData({
          alertLevel: data.alertLevel,
          type: data.type,
          name: data.name,
          description: data.description,
          timestamp: Number(data.createdAt),
          image: data.image,
        });
      });
  }, [id, reports, accountAddress6551, trueCoin]);

  if (id === undefined) return null;
  return (
    <DetailWrapper>
      <DetailImage src={detailData.image} />
      <DetailBox>
        <DetailInfo>
          <DetailDate>{formatTimestamp(detailData.timestamp)}</DetailDate>
          <AlertLevel alertLevel={detailData.alertLevel}>{["정보", "주의", "경보"][detailData.alertLevel]}</AlertLevel>
          <AlertType>
            <AlertIcon type={detailData.type} />
            <span>
              {
                {
                  heavyrain: "호우",
                  fire: "화재",
                  flood: "침수",
                  collapse: "붕괴",
                }[detailData.type]
              }
            </span>
          </AlertType>
        </DetailInfo>
        <DetailTitle>{detailData.name}</DetailTitle>
        <DetailDescription>{detailData.description}</DetailDescription>
      </DetailBox>
      <FactBox>
        <FactStatus>
          <FactCount>{Number(trueCoin)}</FactCount>명이 사실이라 응답했어요.
        </FactStatus>
        <Writer contractName={"ERC20Token"} functionName={"mint"} args={[accountAddress6551]} text={"사실이에요!"} />
      </FactBox>

      <BadgeWrapper>
        <BadgeTitle>받은 뱃지 ✨</BadgeTitle>
        <Box
          sx={{
            width: "100%",
            height: 250, // set an appropriate height as per your requirements
            overflowY: "auto",
            display: "flex",
          }}
        >
          <ImageList variant="masonry" sx={{ width: 375 }}>
            {badges &&
              badges.map(item => (
                <ImageListItem key={Number(item)}>
                  <img
                    src={`https://bafybeibvb4l7i4noyonbsgau6tohlcmgms35sv2jf5ypvdbwa723hea45e.ipfs.nftstorage.link/${Number(
                      item,
                    )}.png`}
                    loading="lazy"
                  />
                </ImageListItem>
              ))}
          </ImageList>
        </Box>
      </BadgeWrapper>
    </DetailWrapper>
  );
};

export default DetailPage;

const DetailWrapper = styled.div`
  max-width: 375px;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 24px 24px 0;
  margin: 64px auto 0;
`;

const DetailImage = styled.img`
  border-radius: 30px;
  width: 100%;
`;

const DetailBox = styled.div`
  margin: 24px 0;
  width: 100%;
`;

const DetailInfo = styled.div`
  display: flex;
  align-items: center;
`;

const DetailDate = styled.div`
  flex: 1;
  color: #ff7d54;
`;

const AlertLevel = styled.div<{ alertLevel: number }>`
  border-radius: 100px;
  background: #ffac5f;
  color: #fff;
  font-size: 12px;
  font-weight: 400;
  width: 51px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  ${props => {
    switch (props.alertLevel) {
      case 0:
        return css`
          background: #5c90f7;
        `;
      case 1:
        return css`
          background: #f3b06c;
        `;
      case 2:
        return css`
          background: #eb585e;
        `;
    }
  }}
`;

const AlertType = styled.div`
  border-radius: 16px;
  border: 1px solid #ff7d54;
  background: #fff;
  width: 71px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 4px;
  color: #ff7d54;
  font-size: 12px;
  font-weight: 400;

  span {
    padding: 0 4px;
  }
`;

const AlertIcon = styled.div<{ type: string }>`
  width: 20px;
  height: 20px;
  background: url("/icn_${props => props.type}.png") no-repeat center center;
  background-size: cover;
`;

const DetailTitle = styled.div`
  font-size: 24px;
  font-weight: 600;
  margin: 4px 0;
`;

const DetailDescription = styled.div`
  font-size: 16px;
  font-weight: 400;
  margin: 12px 0;
`;

const FactBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`;

const FactStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 400;
`;

const FactCount = styled.div`
  width: 36px;
  height: 36px;
  background-color: #ff7d54;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-right: 4px;
  font-weight: 600;
`;

const BadgeWrapper = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  width: 100%;
  margin-top: 24px;
  padding-top: 20px;
`;

const BadgeTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
`;
