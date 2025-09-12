import React, { createContext, useState } from 'react'

export const ArquivoContext = createContext()

export const ArquivoProvider = ({ children }) => {
    const [Arquivo, setArquivo] = useState(null)

    const adicionarArquivoContext = (url) => {
        setArquivo(url);
    }

    return (
        <ArquivoContext.Provider value={{ Arquivo, setArquivo, adicionarArquivoContext }}>
            {children}
        </ArquivoContext.Provider>
    )
}