// Importa a conexão com o banco de dados
import { connection } from "../configs/Database.js";

// Objeto que contém todas as operações relacionadas ao cliente no banco
const clienteRepository = {

    // =========================
    // CRIAR CLIENTE
    // =========================
    criar: async (cliente, telefones, endereco) => {

        // Pega uma conexão do pool
        const conn = await connection.getConnection();

        try {
            // Inicia uma transação (garante consistência dos dados)
            await conn.beginTransaction();

            // Insere o cliente na tabela clientes
            const [clienteResult] = await conn.execute(
                'INSERT INTO clientes (nome, cpf) VALUES (?, ?)',
                [cliente.nome, cliente.cpf]
            );

            // Pega o ID do cliente recém inserido
            const idCliente = clienteResult.insertId;

            // =========================
            // INSERIR ENDEREÇO
            // =========================
            await conn.execute(
                `INSERT INTO enderecos 
                (idCliente, cep, logradouro, numero, complemento, bairro, cidade, uf) 
                VALUES (?,?,?,?,?,?,?,?)`,
                [
                    idCliente,
                    endereco.cep,
                    endereco.logradouro,
                    endereco.numero,
                    endereco.complemento,
                    endereco.bairro,
                    endereco.localidade, // cidade vem da API como "localidade"
                    endereco.uf
                ]
            );

            // =========================
            // INSERIR TELEFONES
            // =========================
            // Percorre todos os telefones e insere um por um
            for (let tel of telefones) {
                await conn.execute(
                    'INSERT INTO telefones (idCliente, telefone) VALUES (?, ?)',
                    [idCliente, tel.numero]
                );
            }

            // Confirma todas as operações no banco
            await conn.commit();

            // Retorna o ID do cliente criado
            return { idCliente };

        } catch (error) {
            // Em caso de erro, desfaz tudo (rollback)
            await conn.rollback();
            throw error;

        } finally {
            // Libera a conexão de volta para o pool
            conn.release();
        }
    },


    // =========================
    // LISTAR TODOS OS CLIENTES
    // =========================
    selecionarTodos: async () => {

        // Faz um SELECT com JOIN para trazer cliente + telefone + endereço
        const [rows] = await connection.execute(`
            SELECT c.*, t.telefone, e.*
            FROM clientes c
            INNER JOIN telefones t ON c.idCliente = t.idCliente
            INNER JOIN enderecos e ON c.idCliente = e.idCliente
        `);

        // Retorna os dados
        return rows;
    },


    // =========================
    // BUSCAR CLIENTE POR ID
    // =========================
    selecionarPorId: async (id) => {

        // Busca cliente específico pelo ID com JOIN
        const [rows] = await connection.execute(
            `SELECT c.*, t.telefone, e.*
             FROM clientes c
             INNER JOIN telefones t ON c.idCliente = t.idCliente
             INEER JOIN enderecos e ON c.idCliente = e.idCliente
             WHERE c.idCliente = ?`,
            [id]
        );

        return rows;
    },


    // =========================
    // EDITAR CLIENTE
    // =========================
    editar: async (cliente, telefones, endereco) => {

        const conn = await connection.getConnection();

        try {
            // Inicia transação
            await conn.beginTransaction();

            // Atualiza dados básicos do cliente
            await conn.execute(
                "UPDATE clientes SET nome=?, cpf=? WHERE idCliente=?",
                [cliente.nome, cliente.cpf, cliente.id]
            );

            // =========================
            // ATUALIZAR TELEFONES
            // =========================

            // Remove todos os telefones antigos
            await conn.execute(
                "DELETE FROM telefones WHERE idCliente=?",
                [cliente.id]
            );

            // Insere novamente os telefones atualizados
            for (let tel of telefones) {
                await conn.execute(
                    "INSERT INTO telefones (idCliente, telefone) VALUES (?, ?)",
                    [cliente.id, tel.numero]
                );
            }

            // =========================
            // ATUALIZAR ENDEREÇO
            // =========================
            await conn.execute(
                `UPDATE enderecos SET 
                cep=?, logradouro=?, numero=?, complemento=?, bairro=?, cidade=?, uf=?
                WHERE idCliente=?`,
                [
                    endereco.cep,
                    endereco.logradouro,
                    endereco.numero,
                    endereco.complemento,
                    endereco.bairro,
                    endereco.localidade, // corrigido para localidade
                    endereco.uf,
                    cliente.id
                ]
            );

            // Confirma alterações
            await conn.commit();

            return { message: "Cliente atualizado com sucesso" };

        } catch (error) {
            // Desfaz alterações em caso de erro
            await conn.rollback();
            throw error;

        } finally {
            // Libera conexão
            conn.release();
        }
    },


    // =========================
    // DELETAR CLIENTE
    // =========================
    deletar: async (id) => {

        const conn = await connection.getConnection();

        try {
            // Inicia transação
            await conn.beginTransaction();

            // Remove primeiro os dados dependentes (FK)
            await conn.execute('DELETE FROM telefones WHERE idCliente = ?', [id]);
            await conn.execute('DELETE FROM enderecos WHERE idCliente = ?', [id]);

            // Depois remove o cliente
            await conn.execute('DELETE FROM clientes WHERE idCliente = ?', [id]);

            // Confirma exclusão
            await conn.commit();

            return { message: "Cliente deletado com sucesso" };

        } catch (error) {
            // Desfaz em caso de erro
            await conn.rollback();
            throw error;

        } finally {
            // Libera conexão
            conn.release();
        }
    }
}

// Exporta o repository
export default clienteRepository;   