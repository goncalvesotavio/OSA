import { supabase } from '../supabase/supabaseClient.jsx'

export async function fetchClientes() {
    const { data, error } = await supabase
      .from('Clientes')
      .select(`*`);

    if (error || !data) {
        console.error('Erro ao buscar clientes:', error);
        return [];
    }

    return data;
}

export async function adicionarCliente(clienteNovo) {
    const { data, error } = await supabase
      .from('Clientes')
      .insert([
        { Nome: clienteNovo.nome,
          Email: clienteNovo.email,
          Categoria: clienteNovo.categoria 
        },
      ])
      .select(`id_cliente`)
    
    if (error || !data) {
        console.log("Erro ao adicionar novo cliente: ", error);
    }

    return data[0].id_cliente
}

export async function procurarEmail(idCliente){
  const { data, error} = await supabase
  .from('Clientes')
  .select("Email")
  .eq('id_cliente', idCliente);

  if (error || !data) {
      console.error('Erro ao buscar email:', error);
      return [];
  }

  return data
}