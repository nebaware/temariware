import React, { createContext } from 'react';

export const LanguageContext = createContext<{ lang: 'en' | 'am', toggleLang: () => void, t: (key: string) => string }>({ lang: 'en', toggleLang: () => { }, t: (k) => k });
