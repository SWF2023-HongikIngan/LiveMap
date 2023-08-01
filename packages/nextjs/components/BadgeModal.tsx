import { useState } from "react";
import Image from "next/image";
import styled from "@emotion/styled";

export default function BadgeModal({ clickedBadge, setClickedBadge }: any) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ModalWrapper onClick={() => setClickedBadge(-1)}>
      <ImageWrapper>
        <Image
          src={`https://bafybeifymhdsrm624idcn3zafq7c4qdppc5mhes2o62ygzc2kzfy7mkgqm.ipfs.nftstorage.link/${Number(
            clickedBadge,
          )}.png`}
          width={250}
          height={250}
          alt="badge"
          onLoad={() => {
            setIsLoading(false);
          }}
        />
        <BadgeTitle>
          {["침수/홍부 제보자", "사실이에요", "첫 제보자", "접수된 제보", "라이프 세이버"][Number(clickedBadge) - 1]}
        </BadgeTitle>
      </ImageWrapper>
    </ModalWrapper>
  );
}

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  z-index: 9999;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const ImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: white;
  border-radius: 30px;
  transform-style: preserve-3d;
  animation: flip 5s linear infinite;

  @keyframes flip {
    0% {
      transform: rotateY(0);
    }
    50% {
      transform: rotateY(180deg);
    }
    100% {
      transform: rotateY(360deg);
    }
  }
`;

const BadgeTitle = styled.div`
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  margin: 14px 0;
`;
