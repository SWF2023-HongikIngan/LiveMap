import Image from "next/image";
import styled from "@emotion/styled";

export default function ListPage() {
  return (
    <ListWrapper>
      <Image src="/community.png" alt="list" width={375} height={1289} />
    </ListWrapper>
  );
}

const ListWrapper = styled.div`
  padding: 64px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
