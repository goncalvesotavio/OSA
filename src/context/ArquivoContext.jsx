import React, { createContext, useState, useEffect } from 'react'

export const ArquivoContext = createContext()

export const ArquivoProvider = ({ children }) => {
    const [Arquivo, setArquivo] = useState(null)
    const [infos, setInfos] = useState({})
    const [armarios, setArmarios] = useState([])

    const adicionarInfosContext = (novasInfos) => {
      setInfos((prev) => ({ ...prev, ...novasInfos }))
    }

    useEffect(() => {
        console.log("infos atualizado:", infos)
    }, [infos])

    const adicionarArmariosContext = (armario) => {
        setArmarios((prev) => [...prev, armario])
    }

    useEffect(() => {
        console.log("armarios atualizado:", armarios)
    }, [armarios])

    return (
        <ArquivoContext.Provider value={{ adicionarInfosContext, infos, adicionarArmariosContext, armarios, setArmarios }}>
            {children}
        </ArquivoContext.Provider>
    )
}