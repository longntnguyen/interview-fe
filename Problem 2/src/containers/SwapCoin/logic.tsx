import axios from "axios";
import { useEffect, useState } from "react";

export const useSwapCoinLogic = () => {
  const [coinsInfo, setCoinsInfo] = useState<CoinsResponse>([]);
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
  const handleChangeInfo = (key: string, value: string | number) => {
    setFormInfo((prev) => ({ ...prev, [key]: value }));
  };
  return {
    handleChangeInfo,
    formInfo,
    coinsInfo,
  };
};
