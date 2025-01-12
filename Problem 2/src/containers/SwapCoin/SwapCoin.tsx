import { Button, OutlinedInput } from "@mui/material";
import "./styles.scss";
import {
  SwapCoinProvider,
  useSwapCoinContext,
} from "@/providers/SwapCoinProvider";
import SouthIcon from "@mui/icons-material/South";
import { formatPrice } from "@/utils/formatPrice";
import { CoinSelection } from "./components/CoinSelection";
import { SelectCoinPopup } from "@/components/SelectCoinPopup/SelectCoinPopup";

export const SwapCoinContainer = () => {
  const {
    formInfo,
    tokenPrices,
    openTypeTokenModal,
    coinsInfo,
    recalculatePrice,
    handleChangeToken,
    setOpenTypeTokenModal,
    handleChangeInfo,
    handleSwapCoinValue,
    handleSubmit,
    onFocusInput,
  } = useSwapCoinContext();

  return (
    <div className="swap-coin-container">
      <h2>Swap Token</h2>
      <div className="actions-container">
        <div
          className="coin-input-container"
          onClick={() => onFocusInput("from")}
        >
          <OutlinedInput
            className="coin-input"
            value={formInfo.fromAmount}
            placeholder="0"
            onBlur={() => recalculatePrice("from")}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, "");
              handleChangeInfo(
                "fromAmount",
                Math.round(+value * 10000) / 10000
              );
            }}
            endAdornment={
              <CoinSelection currency={formInfo.from} typeInput="from" />
            }
          />
          <span className="token-price">
            ${formatPrice(tokenPrices.fromPrice)}
          </span>
        </div>
        <Button className="swap-button" onClick={handleSwapCoinValue}>
          <SouthIcon />
        </Button>
        <div
          className="coin-input-container"
          onClick={() => onFocusInput("to")}
        >
          <OutlinedInput
            className="coin-input"
            placeholder="0"
            value={formInfo.toAmount}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, "");
              handleChangeInfo("toAmount", Math.round(+value * 10000) / 10000);
            }}
            onBlur={() => recalculatePrice("to")}
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

      <SelectCoinPopup
        open={!!openTypeTokenModal}
        setOpen={() => setOpenTypeTokenModal(null)}
        coinsInfo={coinsInfo}
        selectToken={handleChangeToken}
      />
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
