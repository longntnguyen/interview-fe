import { useSwapCoinContext } from "@/providers/SwapCoinProvider";
import { InputAdornment } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export const CoinSelection = ({
  currency,
  typeInput,
}: {
  currency: string;
  typeInput: "to" | "from";
}) => {
  const { setOpenTypeTokenModal } = useSwapCoinContext();

  return (
    <InputAdornment
      position="end"
      onClick={() => setOpenTypeTokenModal(typeInput)}
    >
      <div className={`coin-selection ${!currency ? "empty" : ""}`}>
        {currency ? (
          <>
            <img src={`/src/assets/tokens/${currency}.svg`} alt="coin" />
            <span>{currency}</span>
            <KeyboardArrowDownIcon />
          </>
        ) : (
          <>
            <span>Select Token</span>
            <KeyboardArrowDownIcon />
          </>
        )}
      </div>
    </InputAdornment>
  );
};
