// Classe que representa um Endereço
class Endereco {

  #cep;
  #logradouro;
  #numero;
  #complemento;
  #bairro;
  #localidade;
  #uf;

  constructor(pCep, pLogradouro, pNumero, pComplemento, pBairro, pLocalidade, pUf) {
    this.cep = pCep;
    this.logradouro = pLogradouro;
    this.numero = pNumero;
    this.complemento = pComplemento;
    this.bairro = pBairro;
    this.localidade = pLocalidade;
    this.uf = pUf;
  }

  // GETTERS
  get cep() { return this.#cep; }
  get logradouro() { return this.#logradouro; }
  get numero() { return this.#numero; }
  get complemento() { return this.#complemento; }
  get bairro() { return this.#bairro; }
  get localidade() { return this.#localidade; }
  get uf() { return this.#uf; }

  // SETTERS
  set cep(value) {
    const regex = /^[0-9]{8}$/;

    if (!regex.test(value)) {
      throw new Error("CEP inválido");
    }

    this.#cep = value;
  }

  set logradouro(value) {
    this.#logradouro = value?.trim() || "";
  }

  set numero(value) {
    this.#numero = value;
  }

  set complemento(value) {
    this.#complemento = value;
  }

  set bairro(value) {
    this.#bairro = value;
  }

  set localidade(value) {
    this.#localidade = value;
  }

  
  set uf(value) {
    this.#uf = value?.trim() || "";
  }
}

export default Endereco;