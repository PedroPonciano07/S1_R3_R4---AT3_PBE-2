import axios from "axios";
import Cliente from "../models/Cliente.js";
import Endereco from "../models/Endereco.js";
import Telefone from "../models/Telefone.js";
import clienteRepository from "../repositories/clienteRepository.js";

const clienteController = {

   
    criar: async (req, res) => {
        try {
            const { nome, cpf, telefone, cep, numero, complemento } = req.body;

            const cepRegex = /^[0-9]{8}$/;
            if (!cepRegex.test(cep)) {
                return res.status(400).json({ message: 'verifique o cep informado' });
            }

            const respApi = await axios.get(`http://viacep.com.br/ws/${cep}/json/`);

            if (respApi.data.erro) {
                return res.status(400).json({ message: 'CEP não encontrado' });
            }

            const cliente = new Cliente(nome, cpf);

            if (!cliente.validarNome()) {
                return res.status(400).json({ message: "Nome inválido" });
            }

            if (!cliente.validarCpf()) {
                return res.status(400).json({ message: "CPF inválido" });
            }

            const endereco = new Endereco(
                cep,
                respApi.data.logradouro,
                numero,
                complemento,
                respApi.data.bairro,
                respApi.data.localidade,
                respApi.data.uf
            );

            if (!endereco.validarCep()) {
                return res.status(400).json({ message: "CEP inválido" });
            }

            const tel = new Telefone(telefone);

            if (!tel.validarTelefone()) {
                return res.status(400).json({ message: "Telefone inválido" });
            }

            const resultado = await clienteRepository.create(
                cliente,
                endereco,
                tel
            );

            res.status(201).json({
                message: "Cliente criado com sucesso",
                data: resultado
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Erro no servidor',
                errorMessage: error.message
            });
        }
    },

    
    listar: async (req, res) => {
        try {
            const { id } = req.params;

            
            if (id) {
                const cliente = await clienteRepository.findById(id);

                if (!cliente) {
                    return res.status(404).json({ message: "Cliente não encontrado" });
                }

                return res.status(200).json(cliente);
            }

            
            const clientes = await clienteRepository.findAll();
            res.status(200).json(clientes);

        } catch (error) {
            res.status(500).json({
                message: "Erro ao buscar clientes",
                error: error.message
            });
        }
    },

  
    editar: async (req, res) => {
        try {
            const { id } = req.params;
            const { nome, cpf } = req.body;

            const clienteExistente = await clienteRepository.findById(id);

            if (!clienteExistente) {
                return res.status(404).json({ message: "Cliente não encontrado" });
            }

            const cliente = new Cliente(nome, cpf);

            if (!cliente.validarNome()) {
                return res.status(400).json({ message: "Nome inválido" });
            }

            if (!cliente.validarCpf()) {
                return res.status(400).json({ message: "CPF inválido" });
            }

            await clienteRepository.update(id, cliente);

            res.status(200).json({
                message: "Cliente atualizado com sucesso"
            });

        } catch (error) {
            res.status(500).json({
                message: "Erro ao atualizar cliente",
                error: error.message
            });
        }
    },


    deletar: async (req, res) => {
        try {
            const { id } = req.params;

            const clienteExistente = await clienteRepository.findById(id);

            if (!clienteExistente) {
                return res.status(404).json({ message: "Cliente não encontrado" });
            }

            await clienteRepository.delete(id);

            res.status(200).json({
                message: "Cliente deletado com sucesso"
            });

        } catch (error) {
            res.status(500).json({
                message: "Erro ao deletar cliente",
                error: error.message
            });
        }
    }

};

export default clienteController;

async function consultaCep(cep) {
    try {
        const respApi = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

        if(respApi.data.erro){
            throw new Error('CEP não encontrado');
        }

        return respApi.data;
    } catch (error) {
        console.error(error)
        throw new Error('Erro ao buscar CEP', error.message);
    }
}