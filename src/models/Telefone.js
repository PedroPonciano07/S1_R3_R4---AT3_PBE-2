// Classe que representa um Telefone
class Telefone {

  // Atributo privado (não pode ser acessado diretamente fora da classe)
  #numero;

  // Construtor: chamado ao criar um novo telefone
  constructor(pNumero) {
    this.numero = pNumero; // usa o setter (com validação)
  }

  // ========================
  // GETTER (retorna o número)
  // ========================
  get numero() {
    return this.#numero;
  }

  // ========================
  // SETTER (valida e define)
  // ========================
  set numero(value) {

    // Regex: aceita apenas números com 10 ou 11 dígitos
    // (ex: telefone fixo ou celular com DDD)
    const regex = /^[0-9]{10,11}$/;

    // Se não passar na validação, lança erro
    if (!regex.test(value)) {
      throw new Error("Telefone inválido");
    }

    // Se for válido, salva no atributo privado
    this.#numero = value;
  }

  // ========================
  // FACTORY METHOD
  // ========================
  // Método estático para criar um telefone sem usar "new" diretamente
  static criar(numero) {
    return new Telefone(numero);
  }
}

// Exporta a classe
export default Telefone;