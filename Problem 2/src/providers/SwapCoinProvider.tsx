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

const SwapCoinContext = createContext({
  handleChangeInfo: (_key: string, _value: string | number) => {},
  formInfo: { from: "", to: "", fromAmount: 0, toAmount: 0 },
  coinsInfo: {} as CoinsResponse,
  tokenPrices: { fromPrice: 0, toPrice: 0 },
  handleSubmit: () => {},
  swapCoinValue: () => {},
});

export const SwapCoinProvider = ({ children }: { children: ReactNode }) => {
  const [coinsInfo, setCoinsInfo] = useState<CoinsResponse>([]);
  const { showLoading, showNotification } = useNotify();
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

  const swapCoinValue = () => {
    setFormInfo((prev) => ({
      ...prev,
      from: formInfo.to,
      to: formInfo.from,
      fromAmount: formInfo.toAmount,
      toAmount: formInfo.fromAmount,
    }));
  };

  const handleChangeInfo = (key: string, value: string | number) => {
    setFormInfo((prev) => ({ ...prev, [key]: value }));
  };

  const tokenPrices = useMemo(() => {
    let fromTokenPrice = 0;
    let toTokenPrice = 0;
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
      };
    }
    return { fromPrice: 0, toPrice: 0 };
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

  const value = {
    formInfo,
    coinsInfo,
    tokenPrices,
    handleSubmit,
    swapCoinValue,
    handleChangeInfo,
  };

  return (
    <SwapCoinContext.Provider value={value}>
      {children}
    </SwapCoinContext.Provider>
  );
};

export const useSwapCoinContext = () => useContext(SwapCoinContext);
