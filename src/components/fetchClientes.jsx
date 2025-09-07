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
          Categoria: clienteNovo.categoria,
          RM: clienteNovo.rm ? Number(clienteNovo.rm) : null,
          Tipo_curso: clienteNovo.tipoCurso,
          Curso: clienteNovo.curso,
          Serie: clienteNovo.serie ? Number(clienteNovo.serie) : null
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

export async function atualizarCliente(idCliente, clienteUpdate) {
  const { data, error } = await supabase
  .from('Clientes')
  .update({
    RM: clienteUpdate.rm,
    Tipo_curso: clienteUpdate.tipoCurso,
    Curso: clienteUpdate.curso,
    Serie: clienteUpdate.serie
  })
  .eq('id_cliente', idCliente)

  if (error || !data) {
      console.error('Erro ao atualizar cliente:', error);
      return [];
  }

  return data
}