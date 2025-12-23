// Telegram WebApp Integration
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
        };
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
        };
      };
    };
  }
}

export const TelegramWebApp = {
  isAvailable: () => !!window.Telegram?.WebApp,
  
  init: () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  },
  
  getUser: () => {
    return window.Telegram?.WebApp?.initDataUnsafe?.user || null;
  },
  
  close: () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.close();
    }
  },
  
  showMainButton: (text: string, callback: () => void) => {
    if (window.Telegram?.WebApp?.MainButton) {
      window.Telegram.WebApp.MainButton.text = text;
      window.Telegram.WebApp.MainButton.onClick(callback);
      window.Telegram.WebApp.MainButton.show();
    }
  },
  
  hideMainButton: () => {
    if (window.Telegram?.WebApp?.MainButton) {
      window.Telegram.WebApp.MainButton.hide();
    }
  }
};