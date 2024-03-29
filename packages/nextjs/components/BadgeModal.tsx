import { useState } from "react";
import Image from "next/image";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

// keyframes를 사용해 회전 및 확대 애니메이션을 정의합니다.
const appear = keyframes`
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  80% {
    transform: scale(1) rotate(3600deg);
    opacity: 1;
  }
  85% {
    transform: scale(1) rotate(3600deg);
    opacity: 1;
  }
  90% {
    transform: scale(1.2) rotate(3600deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(3600deg);
  }
`;

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
          {["침수/홍수 제보자", "사실이에요", "첫 제보자", "접수된 제보", "라이프 세이버"][Number(clickedBadge) - 1]}
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
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);

  animation: ${appear} 1.5s ease-out forwards;

  /* animation: float 2s ease-in-out infinite;

  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-30px);
    }
  } */
`;

const BadgeTitle = styled.div`
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  margin: 14px 0;
`;
