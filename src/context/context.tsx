'use client'
import { createContext } from 'react';

interface RecipesContext {
  getVideos: () => void,
  showRegister: boolean,
  setShowRegister: (state: boolean) => void,
}

const initialValue: RecipesContext = {
  getVideos: () => {},
  showRegister: false,
  setShowRegister: () => {},
}

const contexto = createContext(initialValue);
export default contexto;