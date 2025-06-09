import { createContext, useState } from 'react';
import ru from '../locales/ru';
import en from '../locales/en';

export const LocaleContext = createContext();

export const LocaleProvider = ({ children }) => {
  const [locale, setLocale] = useState(ru);

  const switchLocale = (lang) => {
    setLocale(lang === 'ru' ? ru : en);
  };

  return (
    <LocaleContext.Provider value={{ locale, switchLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};
