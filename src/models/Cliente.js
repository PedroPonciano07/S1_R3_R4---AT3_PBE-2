// Classe que representa um Cliente
class Cliente {

  // Construtor: executado quando um novo cliente é criado
  constructor(nome, cpf) {
    this.nome = nome; // armazena o nome do cliente
    this.cpf = cpf; // armazena o CPF do cliente
    this.dataCad = new Date(); // salva a data atual como data de cadastro
  }

  // Método GET para retornar o nome
  getNome() {
    return this.nome;
  }

  // Método GET para retornar o CPF
  getCpf() {
    return this.cpf;
  }

  // Método GET para retornar a data de cadastro
  getDataCad() {
    return this.dataCad;
  }

  // Método SET para alterar o nome
  setNome(nome) {
    // valida se o nome existe e tem pelo menos 3 caracteres
    if (!nome || nome.length < 3) {
      throw new Error("Nome inválido"); // lança erro se for inválido
    }
    this.nome = nome; // atualiza o nome
  }

  // Método SET para alterar o CPF
  setCpf(cpf) {
    // valida o formato do CPF antes de salvar
    if (!this.validarCpfFormato(cpf)) {
      throw new Error("CPF inválido"); // erro se CPF inválido
    }
    this.cpf = cpf; // atualiza o CPF
  }

  // Método para validar o nome atual do objeto
  validarNome() {
    return typeof this.nome === "string" && this.nome.length >= 3;
  }

  // Método que valida o formato do CPF
  // (não valida cálculo oficial, apenas formato básico)
  validarCpfFormato(cpf) {
    if (!cpf) return false; // verifica se existe

    // verifica se tem exatamente 11 números
    const regex = /^[0-9]{11}$/;
    if (!regex.test(cpf)) return false;

    // impede CPFs com todos os números iguais (ex: 11111111111)
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    return true; // CPF válido no formato
  }

  // Valida o CPF do próprio objeto
  validarCpf() {
    return this.validarCpfFormato(this.cpf);
  }

  // Verifica se o CPF já existe em uma lista de clientes
  cpfJaExiste(listaClientes) {
    // percorre a lista e retorna true se encontrar CPF igual
    return listaClientes.some(c => c.cpf === this.cpf);
  }
}

// Exporta a classe para ser usada em outros arquivos
export default Cliente;