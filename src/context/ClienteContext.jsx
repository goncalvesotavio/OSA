import React, { createContext, useState, useEffect } from 'react';

export const ClienteContext = createContext();

export const ClienteProvider = ({ children }) => {
    const [cliente, setCliente] = useState(null)

    useEffect(() => {
            console.log("Cliente atualizado:", cliente)
        }, [cliente]);

    const adicionarClienteContext = (id_cliente) => {
        setCliente(id_cliente);
    };

    return (
        <ClienteContext.Provider value={{ cliente, setCliente, adicionarClienteContext }}>
            {children}
        </ClienteContext.Provider>
    )
}