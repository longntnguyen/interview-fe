import { Alert, CircularProgress, Dialog, Snackbar } from "@mui/material";
import React, { createContext, useState, useContext, ReactNode } from "react";

interface NotifyContextType {
  notification: NotifyMessage | null;
  loading: boolean;
  showNotification: (message: NotifyMessage) => void;
  showLoading: (isLoading: boolean) => void;
}

const NotifyContext = createContext<NotifyContextType>({
  notification: null,
  loading: false,
  showNotification: () => {},
  showLoading: () => {},
});

interface NotifyProviderProps {
  children: ReactNode;
}

type NotifyMessage = {
  message: string;
  severity: "success" | "error";
};

export const NotifyProvider: React.FC<NotifyProviderProps> = ({ children }) => {
  const [notification, setNotification] = useState<NotifyMessage | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const showNotification = (message: NotifyMessage) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const showLoading = (isLoading: boolean) => {
    setLoading(isLoading);
  };

  const handleClose = () => {
    setNotification(null);
  };

  return (
    <NotifyContext.Provider
      value={{ notification, loading, showNotification, showLoading }}
    >
      {children}
      {!!notification?.message && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={!!notification}
          onClose={handleClose}
          message={notification.message}
        >
          <Alert
            onClose={handleClose}
            severity={notification.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      )}
      {loading && (
        <Dialog open={loading} className="loading-dialog">
          <CircularProgress />
        </Dialog>
      )}
    </NotifyContext.Provider>
  );
};

export const useNotify = () => useContext(NotifyContext);
