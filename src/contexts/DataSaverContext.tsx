import React, { createContext } from 'react';

export const DataSaverContext = createContext<{ dataSaver: boolean, toggleDataSaver: () => void }>({ dataSaver: false, toggleDataSaver: () => { } });
