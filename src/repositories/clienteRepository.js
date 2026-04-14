import { connection } from "../configs/Database.js";

const clienteRepository = {
    
    criar: async (cliente, telefone, endereco) => {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();

            const sqlCliente = 'INSERT INTO clientes (nome, cpf) VALUES (?, ?)';
            const valuesCliente = [cliente.nome, cliente.cpf];
            const [rowsCliente] = await conn.execute(sqlCliente, valuesCliente);

            const sqlEndereco = 'INSERT INTO enderecos (idCliente, cep, logradouro, numero, complemento, bairro, cidade, uf) VALUES (?,?,?,?,?,?,?,?)';
            const valuesEndereco = [
                rowsCliente.insertId,
                endereco.cep,
                endereco.logradouro,
                endereco.numero,
                endereco.complemento,
                endereco.bairro,
                endereco.cidade,
                endereco.uf
            ];
            const [rowsEndereco] = await conn.execute(sqlEndereco, valuesEndereco);

            const sqlTelefone = 'INSERT INTO telefones (clienteId, telefone) VALUES (?,?)';
            const valuesTelefone = [rowsCliente.insertId, telefone.numero];
            const [rowsTelefone] = await conn.execute(sqlTelefone, valuesTelefone);

            await conn.commit();

            return { rowsCliente, rowsEndereco, rowsTelefone };

        } catch (error) {
            await conn.rollback();
            throw error;

        } finally {
            conn.release();
        }
    },

    
    selecionarTodos: async () => {
        const [rows] = await connection.execute('SELECT * FROM clientes');
        return rows;
    },

    
    selecionarPorId: async (id) => {
        const [rows] = await connection.execute(
            'SELECT * FROM clientes WHERE id = ?',
            [id]
        );
        return rows[0];
    },


    
    deletar: async (id) => {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();

            await conn.execute('DELETE FROM telefones WHERE clienteId = ?', [id]);
            await conn.execute('DELETE FROM enderecos WHERE idCliente = ?', [id]);
            await conn.execute('DELETE FROM clientes WHERE id = ?', [id]);

            await conn.commit();

        } catch (error) {
            await conn.rollback();
            throw error;

        } finally {
            conn.release();
        }
    }
}

export default clienteRepository;