import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { css, keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { CircularProgress } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import BadgeModal from "~~/components/BadgeModal";
import Writer from "~~/components/Writer";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const DetailPage = () => {
  const {
    query: { id },
  } = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [clickedBadge, setClickedBadge] = useState(-1);

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
      {clickedBadge !== -1 && <BadgeModal clickedBadge={clickedBadge} setClickedBadge={setClickedBadge} />}
      {isLoading && (
        <SkeletonElement>
          <CircularProgress />
        </SkeletonElement>
      )}
      <DetailImage
        src={detailData.image}
        onLoad={() => {
          setIsLoading(false);
        }}
        style={{ display: isLoading ? "none" : "block" }}
      />
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
        <Title>Earned Badges ✨</Title>
        <Swiper spaceBetween={10} slidesPerView={"auto"}>
          {badges?.length > 0 ? (
            badges.map((item, index) => {
              return (
                <SwiperSlide key={index} style={{ width: 108, padding: "20px 0 10px" }}>
                  <Badge
                    delay={index / 3}
                    onClick={() => {
                      setClickedBadge(Number(item));
                    }}
                  >
                    <Image
                      src={`https://bafybeifymhdsrm624idcn3zafq7c4qdppc5mhes2o62ygzc2kzfy7mkgqm.ipfs.nftstorage.link/${Number(
                        item,
                      )}.png`}
                      width={107}
                      height={107}
                      alt="badge"
                    />
                    <BadgeTitle>
                      {
                        ["침수/홍수 제보자", "사실이에요", "첫 제보자", "접수된 제보", "라이프 세이버"][
                          Number(item) - 1
                        ]
                      }
                    </BadgeTitle>
                  </Badge>
                </SwiperSlide>
              );
            })
          ) : (
            <NoBadge>Haven't earned any badges yet.</NoBadge>
          )}
        </Swiper>
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

const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 15px;
`;

const BadgeTitle = styled.div`
  text-align: center;
  font-size: 12px;
  font-weight: 400;
  margin-top: 3px;
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
`;

const Badge = styled.div<{ delay: number }>`
  width: 108px;
  height: 138px;
  border-radius: 10px;
  border: 1px solid var(--light-action-focus-12-p, rgba(0, 0, 0, 0.12));
  background: #fff;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  animation: ${floatAnimation} 2s infinite ease-in-out;
  animation-delay: ${props => props.delay}s;
`;

const SkeletonElement = styled.div`
  border-radius: 30px;
  width: 100%;
  height: 327px;
  background-color: #ccc; /* 스켈레톤의 배경색 */
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NoBadge = styled.div``;
