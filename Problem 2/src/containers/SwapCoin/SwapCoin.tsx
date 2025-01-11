import { Button, OutlinedInput } from "@mui/material";
import "./styles.scss";
import {
  SwapCoinProvider,
  useSwapCoinContext,
} from "@/providers/SwapCoinProvider";
import SouthIcon from "@mui/icons-material/South";
import { formatPrice } from "@/utils/formatPrice";
import { CoinSelection } from "./components/CoinSelection";

export const SwapCoinContainer = () => {
  const {
    formInfo,
    tokenPrices,
    handleChangeInfo,
    swapCoinValue,
    handleSubmit,
  } = useSwapCoinContext();
  return (
    <div className="swap-coin-container">
      <h2>Swap Token</h2>
      <div className="actions-container">
        <div className="coin-input-container">
          <OutlinedInput
            className="coin-input"
            value={formInfo.fromAmount}
            placeholder="0"
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, "");
              handleChangeInfo("fromAmount", +value);
            }}
            endAdornment={
              <CoinSelection currency={formInfo.from} typeInput="from" />
            }
          />
          <span className="token-price">
            ${formatPrice(tokenPrices.fromPrice)}
          </span>
        </div>
        <Button className="swap-button" onClick={swapCoinValue}>
          <SouthIcon />
        </Button>
        <div className="coin-input-container">
          <OutlinedInput
            className="coin-input"
            placeholder="0"
            value={formInfo.toAmount}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, "");
              handleChangeInfo("toAmount", +value);
            }}
            endAdornment={
              <CoinSelection currency={formInfo.to} typeInput="to" />
            }
          />
          <span className="token-price">
            ${formatPrice(tokenPrices.toPrice)}
          </span>
        </div>
      </div>
      <Button
        variant="outlined"
        className="swap-token-btn"
        onClick={handleSubmit}
      >
        Swap Token
      </Button>
    </div>
  );
};

export const SwapCoin = () => {
  return (
    <SwapCoinProvider>
      <SwapCoinContainer />
    </SwapCoinProvider>
  );
};
