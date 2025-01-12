import { Modal, OutlinedInput } from "@mui/material";
import { FC, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import "./styles.scss";
import { formatPrice } from "@/utils/formatPrice";
import CloseIcon from "@mui/icons-material/Close";

type SelectCoinPopupProps = {
  open: boolean;
  setOpen: (open: string | null) => void;
  coinsInfo: CoinsResponse;
  selectToken: (token: string) => void;
};

export const SelectCoinPopup: FC<SelectCoinPopupProps> = ({
  open,
  coinsInfo,
  setOpen,
  selectToken,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const filteredCoins = coinsInfo.filter((coin) =>
    coin.currency.includes(searchValue)
  );
  return (
    <Modal
      className="select-coin-popup-container"
      open={!!open}
      onClose={() => setOpen(null)}
    >
      <div className="select-coin-popup">
        <div className="close-btn" onClick={() => setOpen(null)}>
          <CloseIcon />
        </div>
        <h4>Select Token</h4>
        <OutlinedInput
          startAdornment={<SearchIcon />}
          className="search-input"
          placeholder="Search Tokens"
          onChange={(e) => setSearchValue(e.target.value)}
          value={searchValue}
        />
        <p style={{ marginLeft: "10px" }}>Tokens</p>
        <div className="tokens-container">
          {filteredCoins.map((coin, index) => (
            <div
              key={`${coin.currency} ${index}`}
              className="token-item"
              onClick={() => selectToken(coin.currency)}
            >
              <img src={`/src/assets/tokens/${coin.currency}.svg`} alt="coin" />
              <div className="token-info">
                <p>{coin.currency}</p>{" "}
                <p className="token-price">${formatPrice(coin.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
