// Classe que representa um Endereço
class Endereco {

  // Atributos privados (não podem ser acessados diretamente fora da classe)
  #cep;
  #logradouro;
  #numero;
  #complemento;
  #bairro;
  #localidade;
  #uf;

  // Construtor: chamado quando um novo endereço é criado
  constructor(pCep, pLogradouro, pNumero, pComplemento, pBairro, pLocalidade, pUf) {
    this.cep = pCep; // usa o setter (com validação)
    this.logradouro = pLogradouro;
    this.numero = pNumero;
    this.complemento = pComplemento;
    this.bairro = pBairro;
    this.localidade = pLocalidade;
    this.uf = pUf;
  }

  // ========================
  // GETTERS (retornam valores)
  // ========================

  get cep() {
    return this.#cep;
  }

  get logradouro() {
    return this.#logradouro;
  }

  get numero() {
    return this.#numero;
  }

  get complemento() {
    return this.#complemento;
  }

  get bairro() {
    return this.#bairro;
  }

  get localidade() {
    return this.#localidade;
  }

  get uf() {
    return this.#uf;
  }

  // ========================
  // SETTERS (alteram valores)
  // ========================

  // Valida o CEP (deve ter exatamente 8 números)
  set cep(value) {
    const regex = /^[0-9]{8}$/;

    if (!regex.test(value)) {
      throw new Error("CEP inválido");
    }

    this.#cep = value;
  }

  // Remove espaços extras (trim) ou define vazio se não vier nada
  set logradouro(value) {
    this.#logradouro = value?.trim() || "";
  }

  // Define o número da residência
  set numero(value) {
    this.#numero = value;
  }

  // Define complemento (ex: ap, bloco)
  set complemento(value) {
    this.#complemento = value;
  }

  // Define bairro
  set bairro(value) {
    this.#bairro = value;
  }

  // Define cidade (localidade)
  set localidade(value) {
    this.#localidade = value;
  }

  // Define UF (estado)
  set uf(value) {
    this.#uf = value?.trim; // ⚠️ aqui tem um erro (explico abaixo)
  }
}

// Exporta a classe
export default Endereco;