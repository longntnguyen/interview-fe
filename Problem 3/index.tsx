// Issues 1: Inefficient Filtering and Sorting
// - The useMemo hook is used to filter and sort the balances, but the filtering logic can be optimized.
// - The sorting logic can be simplified without the need for a separate function.
// Issues 2: Inefficient Rendering
// - The WalletRow component is rendered for each balance, but the rendering logic can be optimized.
// Issues 3: Redundant Mapping
// - The sortedBalances array is used directly in the rows mapping, but the mapping logic can be optimized.
// Issues 4: Unnecessary Recalculations
// - The rows array is recalculated on every render, even though it depends on sortedBalances which is already memoized.
// Issues 5: TypeScript Types
// - The `WalletBalance` interface is missing the blockchain property, which is used in the code.
// Solutions:
// - Update the WalletBalance interface to include the blockchain property.
// - Simplify the sorting logic.
// - Optimize the rows mapping logic.
// - Memoize the rows array to prevent unnecessary recalculations.

import React, { useMemo } from "react";
import { useWalletBalances, usePrices } from "@/hooks";
import WalletRow from "@/components/WalletRow";

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface Props extends BoxProps {
  children: React.ReactNode;
}

type TPrices = {
  [key: string]: number;
};
const priority = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices() as TPrices;

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => balance.amount > 0)
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        return (
          (priority[rhs.blockchain] || -99) - (priority[lhs.blockchain] || -99)
        );
      });
  }, [balances]);

  const rows = useMemo(() => {
    return sortedBalances.map((balance: WalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.amount.toFixed()}
        />
      );
    });
  }, [sortedBalances, prices]);

  return <div {...rest}>{rows}</div>;
};

export default WalletPage;
