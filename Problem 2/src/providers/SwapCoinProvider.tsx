import axios from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNotify } from "./NotifyProvider";

const formatTokenPrices = (
  amount: number,
  originFromPrice: number,
  originToPrice: number
) => {
  return (
    parseFloat(
      ((amount * originToPrice) / (originFromPrice || 1)).toFixed(4)
    ) || 0
  );
};

const SwapCoinContext = createContext({
  handleChangeInfo: (_key: string, _value: string | number) => {},
  formInfo: { from: "", to: "", fromAmount: 0, toAmount: 0 },
  coinsInfo: {} as CoinsResponse,
  tokenPrices: { fromPrice: 0, toPrice: 0 },
  openTypeTokenModal: null as "to" | "from" | null,
  // open select token modal if user have not selected token
  onFocusInput: (_type: "from" | "to") => {},
  // recalculate token price when user blur input
  recalculatePrice: (_type: "from" | "to") => {},
  handleSubmit: () => {},
  // set open modal for select from or to token field
  setOpenTypeTokenModal: (_type: "to" | "from" | null) => {},
  // swap coin between from and to token
  handleSwapCoinValue: () => {},
  // handle change token when user select token in modal
  handleChangeToken: (_token: string) => {},
});

export const SwapCoinProvider = ({ children }: { children: ReactNode }) => {
  const [coinsInfo, setCoinsInfo] = useState<CoinsResponse>([]);
  const { showLoading, showNotification } = useNotify();
  const [openTypeTokenModal, setOpenTypeTokenModal] = useState<
    "to" | "from" | null
  >(null);
  const [formInfo, setFormInfo] = useState({
    from: "",
    to: "",
    fromAmount: 0,
    toAmount: 0,
  });

  useEffect(() => {
    axios.get("https://interview.switcheo.com/prices.json").then((res) => {
      setCoinsInfo(res.data);
    });
  }, []);

  const handleSwapCoinValue = () => {
    setFormInfo((prev) => ({
      ...prev,
      from: formInfo.to,
      to: formInfo.from,
      fromAmount: formInfo.toAmount,
      toAmount: formInfo.fromAmount,
    }));
  };

  const handleChangeInfo = (key: string, value: string | number) => {
    if (
      (key === "fromAmount" && !formInfo.from) ||
      (key === "toAmount" && !formInfo.to)
    ) {
      return;
    }
    setFormInfo((prev) => ({ ...prev, [key]: value }));
  };

  // calculate token price
  const tokenPrices = useMemo(() => {
    let fromTokenPrice = 0;
    let toTokenPrice = 0;
    // get token price for from and to token
    coinsInfo.forEach((coin) => {
      if (coin.currency === formInfo.from) {
        fromTokenPrice = coin.price;
      }
      if (coin.currency === formInfo.to) {
        toTokenPrice = coin.price;
      }
    });
    if (fromTokenPrice || toTokenPrice) {
      return {
        fromPrice: fromTokenPrice * formInfo.fromAmount,
        toPrice: toTokenPrice * formInfo.toAmount,
        originToTokenPrice: toTokenPrice,
        originFromTokenPrice: fromTokenPrice,
      };
    }
    return {
      fromPrice: 0,
      toPrice: 0,
      originToTokenPrice: 0,
      originFromTokenPrice: 0,
    };
  }, [formInfo, coinsInfo]);

  const handleSubmit = async () => {
    if (!formInfo.to || !formInfo.from) {
      showNotification({ message: "Please select token", severity: "error" });
      return;
    }
    if (formInfo.fromAmount === 0 || formInfo.toAmount === 0) {
      showNotification({
        message: "Please fill the amount",
        severity: "error",
      });
      return;
    }
    if (formInfo.from === formInfo.to) {
      showNotification({
        message: "Please select different token",
        severity: "error",
      });
      return;
    }
    showLoading(true);
    await setTimeout(() => {
      showLoading(false);
      showNotification({ message: "Swap success", severity: "success" });
      setFormInfo({ from: "", to: "", fromAmount: 0, toAmount: 0 });
    }, 1000);
  };

  const onFocusInput = (type: "from" | "to") => {
    if (type === "from" && !formInfo.from) {
      setOpenTypeTokenModal("from");
    } else if (type === "to" && !formInfo.to) {
      setOpenTypeTokenModal("to");
    }
  };

  const recalculatePrice = (type: "from" | "to") => {
    if (type === "from" && formInfo.fromAmount) {
      setFormInfo((prev) => ({
        ...prev,
        toAmount: formatTokenPrices(
          formInfo.fromAmount,
          tokenPrices.originToTokenPrice,
          tokenPrices.originFromTokenPrice
        ),
      }));
    } else if (type === "to" && formInfo.toAmount) {
      setFormInfo((prev) => ({
        ...prev,
        fromAmount: formatTokenPrices(
          formInfo.toAmount,
          tokenPrices.originFromTokenPrice,
          tokenPrices.originToTokenPrice
        ),
      }));
    }
  };

  const handleChangeToken = (token: string) => {
    if (openTypeTokenModal) {
      handleChangeInfo(openTypeTokenModal, token);
      setOpenTypeTokenModal(null);
    }
  };

  const value = {
    formInfo,
    coinsInfo,
    tokenPrices,
    handleSubmit,
    handleSwapCoinValue,
    handleChangeInfo,
    onFocusInput,
    setOpenTypeTokenModal,
    recalculatePrice,
    openTypeTokenModal,
    handleChangeToken,
  };

  return (
    <SwapCoinContext.Provider value={value}>
      {children}
    </SwapCoinContext.Provider>
  );
};

export const useSwapCoinContext = () => useContext(SwapCoinContext);
