import { useSwapCoinContext } from "@/providers/SwapCoinProvider";
import { InputAdornment } from "@mui/material";
import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { SelectCoinPopup } from "@/components/SelectCoinPopup/SelectCoinPopup";

export const CoinSelection = ({
  currency,
  typeInput,
}: {
  currency: string;
  typeInput: "to" | "from";
}) => {
  const [openModal, setOpenModal] = useState(false);
  const { coinsInfo, handleChangeInfo } = useSwapCoinContext();

  const handleChangeToken = (token: string) => {
    handleChangeInfo(typeInput, token);
    setOpenModal(false);
  };

  return (
    <>
      <InputAdornment position="end" onClick={() => setOpenModal(true)}>
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
      <SelectCoinPopup
        open={openModal}
        setOpen={setOpenModal}
        coinsInfo={coinsInfo}
        selectToken={handleChangeToken}
      />
    </>
  );
};
