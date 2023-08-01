import { useEffect } from "react";
import styled from "@emotion/styled";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export default function Writer({ contractName, functionName, args, text }: any) {
  const { writeAsync, isSuccess } = useScaffoldContractWrite({
    contractName: contractName,
    functionName: functionName,
    args: [...args],
    // For payable functions, expressed in ETH
    value: "0",
    // The number of block confirmations to wait for before considering transaction to be confirmed (default : 1).
    blockConfirmations: 1,
    // The callback function to execute when the transaction is confirmed.
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });

  async function Write() {
    await writeAsync();
  }

  useEffect(() => {
    if (isSuccess === true) {
      alert("Succeed! It will be reflected in a moment.");
    }
  }, [isSuccess]);

  return <FactButton onClick={Write}>{text}</FactButton>;
}

const FactButton = styled.div`
  width: 126px;
  height: 36px;
  border-radius: 30px;
  background: #000;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  &:active {
    transform: scale(0.9);
  }
`;
