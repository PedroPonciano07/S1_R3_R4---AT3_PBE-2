import axios from "axios";
import Cliente from "../models/Cliente.js";
import Telefone from "../models/Telefone.js";
import Endereco from "../models/Endereco.js";
import clienteRepository from "../repositories/clienteRepository.js";

const clienteController = {

    criar: async (req, res) => {
        try {
            const { nome, cpf, cep, numero, telefones, complemento } = req.body;

            // valida CEP
            const cepRegex = /^[0-9]{8}$/;
            if (!cepRegex.test(cep)) {
                return res.status(400).json({ message: 'Verifique o CEP informado' });
            }

            // busca ViaCEP
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            const viaCep = response.data;

            if (viaCep.erro) {
                return res.status(400).json({ message: "CEP não encontrado" });
            }

            // CLIENTE
            const cliente = new Cliente(nome, cpf);

            if (!cliente.validarNome()) {
                return res.status(400).json({ message: "Nome inválido" });
            }

            if (!cliente.validarCpf()) {
                return res.status(400).json({ message: "CPF inválido" });
            }

            // TELEFONES (aceita array ou único)
            let listaTelefones = [];

            if (Array.isArray(telefones)) {
                listaTelefones = telefones.map(t => {
                    const tel = new Telefone(t);
                    if (!tel.validarTelefone()) {
                        throw new Error("Telefone inválido");
                    }
                    return { telefone: tel.numero };
                });
            } else if (telefones) {
                const tel = new Telefone(telefones);
                if (!tel.validarTelefone()) {
                    return res.status(400).json({ message: "Telefone inválido" });
                }
                listaTelefones.push({ telefone: tel.numero });
            }

            // ENDEREÇO
            const endereco = new Endereco(
                cep,
                viaCep.logradouro,
                numero,
                complemento ?? null,
                viaCep.bairro,
                viaCep.localidade,
                viaCep.uf
            );

            if (!endereco.validarCep()) {
                return res.status(400).json({ message: "CEP inválido" });
            }

            // SALVAR
            const result = await clienteRepository.criar(
                cliente,
                listaTelefones,
                endereco
            );

            res.status(201).json({
                message: "Cliente criado com sucesso",
                data: result
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Erro no servidor",
                error: error.message
            });
        }
    },

    selecionar: async (req, res) => {
        try {
            const { id } = req.params;

            if (id) {
                const result = await clienteRepository.selecionarPorId(id);

                if (!result || result.length === 0) {
                    return res.status(404).json({ message: "Cliente não encontrado" });
                }

                return res.status(200).json(result);
            }

            const result = await clienteRepository.selecionarTodos();
            res.status(200).json(result);

        } catch (error) {
            res.status(500).json({
                message: "Erro ao buscar clientes",
                error: error.message
            });
        }
    },

    editar: async (req, res) => {
        try {
            const id = req.params.id;
            const { nome, cpf, cep, numero, telefones, complemento } = req.body;

            // valida CEP
            const cepRegex = /^[0-9]{8}$/;
            if (!cepRegex.test(cep)) {
                return res.status(400).json({ message: 'CEP inválido' });
            }

            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            const viaCep = response.data;

            if (viaCep.erro) {
                return res.status(400).json({ message: "CEP não encontrado" });
            }

            // CLIENTE
            const cliente = new Cliente(nome, cpf);
            cliente.id = id; // importante pro repository

            if (!cliente.validarNome()) {
                return res.status(400).json({ message: "Nome inválido" });
            }

            if (!cliente.validarCpf()) {
                return res.status(400).json({ message: "CPF inválido" });
            }

            // TELEFONES
            let listaTelefones = [];

            if (Array.isArray(telefones)) {
                listaTelefones = telefones.map(t => {
                    const tel = new Telefone(t);
                    if (!tel.validarTelefone()) {
                        throw new Error("Telefone inválido");
                    }
                    return { telefone: tel.numero };
                });
            }

            // ENDEREÇO
            const endereco = new Endereco(
                cep,
                viaCep.logradouro,
                numero,
                complemento ?? null,
                viaCep.bairro,
                viaCep.localidade,
                viaCep.uf
            );

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

    deletar: async (req, res) => {
        try {
            const id = req.params.id;

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

export default clienteController;