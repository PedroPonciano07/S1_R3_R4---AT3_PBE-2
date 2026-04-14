// Importa o axios para fazer requisições HTTP (usado no ViaCEP)
import axios from "axios";

// Importa os models (regras de negócio/validação)
import Cliente from "../models/Cliente.js";
import Telefone from "../models/Telefone.js";
import Endereco from "../models/Endereco.js";

// Importa o repository (acesso ao banco)
import clienteRepository from "../repositories/clienteRepository.js";

// Objeto controller que lida com requisições HTTP
const clienteController = {

    // =========================
    // CRIAR CLIENTE
    // =========================
    criar: async (req, res) => {
        try {
            // Pega os dados enviados no body
            const { nome, cpf, cep, numero, telefones, complemento } = req.body;

            // Validação do CEP (deve ter 8 números)
            if (!cep || !/^[0-9]{8}$/.test(cep)) {
                return res.status(400).json({ message: 'CEP inválido' });
            }

            let viaCep;

            // Consulta API do ViaCEP
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                viaCep = response.data;
            } catch {
                return res.status(500).json({ message: "Erro ao consultar ViaCEP" });
            }

            // Verifica se o CEP existe
            if (viaCep.erro) {
                return res.status(400).json({ message: "CEP não encontrado" });
            }

            // Cria objeto Cliente
            const cliente = new Cliente(nome, cpf);

            // Validação do nome
            if (!cliente.validarNome()) {
                return res.status(400).json({ message: "Nome inválido" });
            }

            // Validação do CPF
            if (!cliente.validarCpf()) {
                return res.status(400).json({ message: "CPF inválido" });
            }

            // =========================
            // TELEFONES
            // =========================
            let listaTelefones = [];

            // Verifica se veio um array de telefones
            if (Array.isArray(telefones)) {
                for (let t of telefones) {
                    // Cria objeto Telefone
                    const tel = new Telefone(t);

                    // Adiciona na lista
                    listaTelefones.push(tel);
                }
            }

            // =========================
            // ENDEREÇO
            // =========================
            const endereco = new Endereco(
                cep,
                viaCep.logradouro,
                numero,
                complemento ?? null, // se não vier, salva null
                viaCep.bairro,
                viaCep.localidade,
                viaCep.uf
            );

            // Chama o repository para salvar tudo no banco
            const result = await clienteRepository.criar(
                cliente,
                listaTelefones,
                endereco
            );

            // Retorna sucesso (201 = criado)
            res.status(201).json(result);

        } catch (error) {
            // Erro genérico
            res.status(500).json({
                message: "Erro no servidor",
                error: error.message
            });
        }
    },


    // =========================
    // SELECIONAR CLIENTES
    // =========================
    selecionar: async (req, res) => {
        try {
            // Pega o ID da URL (se existir)
            const { id } = req.params;

            // Se vier ID → busca específico
            if (id) {
                const result = await clienteRepository.selecionarPorId(id);

                // Se não encontrou
                if (!result || result.length === 0) {
                    return res.status(404).json({ message: "Cliente não encontrado" });
                }

                return res.status(200).json(result);
            }

            // Se não veio ID → lista todos
            const result = await clienteRepository.selecionarTodos();
            res.status(200).json(result);

        } catch (error) {
            res.status(500).json({
                message: "Erro ao buscar clientes",
                error: error.message
            });
        }
    },


    // =========================
    // EDITAR CLIENTE
    // =========================
    editar: async (req, res) => {
        try {
            // ID vindo da URL
            const id = req.params.id;

            // Dados do body
            const { nome, cpf, cep, numero, telefones, complemento } = req.body;

            // Validação do CEP
            const cepRegex = /^[0-9]{8}$/;
            if (!cepRegex.test(cep)) {
                return res.status(400).json({ message: 'CEP inválido' });
            }

            // Consulta ViaCEP
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            const viaCep = response.data;

            if (viaCep.erro) {
                return res.status(400).json({ message: "CEP não encontrado" });
            }

            // Cria cliente e define ID
            const cliente = new Cliente(nome, cpf);
            cliente.id = id;

            // Valida nome
            if (!cliente.validarNome()) {
                return res.status(400).json({ message: "Nome inválido" });
            }

            // Valida CPF
            if (!cliente.validarCpf()) {
                return res.status(400).json({ message: "CPF inválido" });
            }

            // =========================
            // TELEFONES
            // =========================
            let listaTelefones = [];

            if (Array.isArray(telefones)) {
                listaTelefones = telefones.map(t => {
                    const tel = new Telefone(t);

                    // Validação do telefone
                    if (!tel.validarTelefone()) {
                        throw new Error("Telefone inválido");
                    }

                    // Retorna no formato esperado pelo repository
                    return { telefone: tel.numero };
                });
            }

            // =========================
            // ENDEREÇO
            // =========================
            const endereco = new Endereco(
                cep,
                viaCep.logradouro,
                numero,
                complemento ?? null,
                viaCep.bairro,
                viaCep.localidade,
                viaCep.uf
            );

            // Chama o repository para atualizar
            const result = await clienteRepository.editar(
                cliente,
                listaTelefones,
                endereco
            );

            res.status(200).json(result);

        } catch (error) {
            console.log(error);

            res.status(500).json({
                message: "Erro ao atualizar cliente",
                error: error.message
            });
        }
    },


    // =========================
    // DELETAR CLIENTE
    // =========================
    deletar: async (req, res) => {
        try {
            // ID vindo da URL
            const id = req.params.id;

            // Chama o repository para deletar
            const result = await clienteRepository.deletar(id);

            res.status(200).json(result);

        } catch (error) {
            console.log(error);

            res.status(500).json({
                message: "Erro ao deletar cliente",
                error: error.message
            });
        }
    }
};

// Exporta o controller
export default clienteController;