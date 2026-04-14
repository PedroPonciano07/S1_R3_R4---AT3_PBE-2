import { connection } from "../configs/Database.js";

const clienteRepository = {
    
    criar: async (cliente, telefone, endereco) => {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();

           
            const sqlCliente = 'INSERT INTO clientes (nome, cpf) VALUES (?, ?)';
            const valuesCliente = [cliente.nome, cliente.cpf];
            const [rowsCliente] = await conn.execute(sqlCliente, valuesCliente);

            const idCliente = rowsCliente.insertId;

            
            const sqlEndereco = `
                INSERT INTO enderecos 
                (idCliente, cep, logradouro, numero, complemento, bairro, cidade, uf) 
                VALUES (?,?,?,?,?,?,?,?)
            `;
            const valuesEndereco = [
                idCliente,
                endereco.cep ?? null,
                endereco.logradouro ?? null,
                endereco.numero ?? null,
                endereco.complemento ?? null,
                endereco.bairro ?? null,
                endereco.cidade ?? null,
                endereco.uf ?? null
            ];
            const [rowsEndereco] = await conn.execute(sqlEndereco, valuesEndereco);

            
            const sqlTelefone = 'INSERT INTO telefones (idCliente, telefone) VALUES (?,?)';
            const valuesTelefone = [idCliente, telefone.numero];
            const [rowsTelefone] = await conn.execute(sqlTelefone, valuesTelefone);

            await conn.commit();

            return { idCliente, rowsEndereco, rowsTelefone };

        } catch (error) {
            await conn.rollback();
            throw error;

        } finally {
            conn.release();
        }
    },

 
    selecionarTodos: async () => {
        const [rows] = await connection.execute(`
            SELECT c.*, t.telefone, e.*
            FROM clientes c
            LEFT JOIN telefones t ON c.idCliente = t.idCliente
            LEFT JOIN enderecos e ON c.idCliente = e.idCliente
        `);
        return rows;
    },

    selecionarPorId: async (id) => {
        const [rows] = await connection.execute(
            `SELECT c.*, t.telefone, e.*
             FROM clientes c
             LEFT JOIN telefones t ON c.idCliente = t.idCliente
             LEFT JOIN enderecos e ON c.idCliente = e.idCliente
             WHERE c.idCliente = ?`,
            [id]
        );
        return rows;
    },

    
    editar: async (cliente, telefone, endereco) => {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();

            
            await conn.execute(
                "UPDATE clientes SET nome=?, cpf=? WHERE idCliente=?",
                [cliente.nome, cliente.cpf, cliente.id]
            );

          
            await conn.execute(
                "DELETE FROM telefones WHERE idCliente=?",
                [cliente.id]
            );

            await conn.execute(
                "INSERT INTO telefones (idCliente, telefone) VALUES (?, ?)",
                [cliente.id, telefone.numero]
            );

            
            await conn.execute(
                `UPDATE enderecos SET 
                    cep=?, logradouro=?, numero=?, complemento=?, bairro=?, cidade=?, uf=?
                 WHERE idCliente=?`,
                [
                    endereco.cep ?? null,
                    endereco.logradouro ?? null,
                    endereco.numero ?? null,
                    endereco.complemento ?? null,
                    endereco.bairro ?? null,
                    endereco.cidade ?? null,
                    endereco.uf ?? null,
                    cliente.id
                ]
            );

            await conn.commit();

            return { message: "Cliente atualizado com sucesso" };

        } catch (error) {
            await conn.rollback();
            throw error;

        } finally {
            conn.release();
        }
    },

    deletar: async (id) => {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();

            await conn.execute('DELETE FROM telefones WHERE idCliente = ?', [id]);
            await conn.execute('DELETE FROM enderecos WHERE idCliente = ?', [id]);
            await conn.execute('DELETE FROM clientes WHERE idCliente = ?', [id]);

            await conn.commit();

            return { message: "Cliente deletado com sucesso" };

        } catch (error) {
            await conn.rollback();
            throw error;

        } finally {
            conn.release();
        }
    }
}

export default clienteRepository;