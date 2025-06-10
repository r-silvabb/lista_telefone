import * as SQLite from 'expo-sqlite';
import { Contato } from '../types/types'; // Certifique-se que este caminho está correto

/*
 * ======================================================================================
 * NOTA SOBRE A CORREÇÃO (API SÍNCRONA):
 * - O método de abertura do banco de dados foi alterado para 'openDatabaseSync',
 * que retorna um objeto de banco de dados que opera de forma síncrona.
 * - Este objeto não possui o método '.transaction()'. As operações são executadas diretamente.
 * - Todas as funções foram reescritas para operar de forma síncrona, removendo as
 * Promises e callbacks, e usando métodos como 'runSync()' e 'getAllSync()'.
 * Isso simplifica o código e resolve o erro 'Property 'transaction' does not exist'.
 * ======================================================================================
 */

// Abre o banco de dados 'contatos.db' de forma síncrona.
const db = SQLite.openDatabaseSync('contatos.db');

/**
 * Inicia o banco de dados, criando a tabela 'contatos' se ela não existir.
 * Executa a operação de forma síncrona.
 */
export const initDB = () => {
  try {
    db.execSync(
      `CREATE TABLE IF NOT EXISTS contatos (
        id INTEGER PRIMARY KEY NOT NULL,
        nome TEXT NOT NULL,
        telefone TEXT NOT NULL
      );`
    );
    console.log("Banco de dados inicializado com sucesso.");
  } catch (error) {
    console.error("Erro ao inicializar o BD:", error);
    throw error; // Propaga o erro para que o chamador possa tratá-lo
  }
};

/**
 * Adiciona um novo contato ao banco de dados.
 * @param nome O nome do contato.
 * @param telefone O telefone do contato.
 * @returns O resultado da operação de inserção.
 */
export const addContato = (nome: string, telefone: string): SQLite.SQLiteRunResult => {
  try {
    return db.runSync('INSERT INTO contatos (nome, telefone) VALUES (?, ?);', nome, telefone);
  } catch (error) {
    console.error("Erro ao adicionar contato:", error);
    throw error;
  }
};

/**
 * Busca todos os contatos do banco de dados, ordenados por nome.
 * @returns Um array de Contatos.
 */
export const getContatos = (): Contato[] => {
  try {
    // O 'getAllSync' já retorna os resultados tipados se a query for bem sucedida.
    // Fazemos um type assertion para garantir a forma do objeto.
    return db.getAllSync<Contato>('SELECT * FROM contatos ORDER BY nome ASC;');
  } catch (error) {
    console.error("Erro ao buscar contatos:", error);
    throw error;
  }
};

/**
 * Procura por contatos cujo nome corresponda à query de busca.
 * @param query O termo a ser buscado no nome dos contatos.
 * @returns Um array de Contatos que correspondem à busca.
 */
export const searchContatos = (query: string): Contato[] => {
  try {
    return db.getAllSync<Contato>("SELECT * FROM contatos WHERE nome LIKE ? ORDER BY nome ASC;", `%${query}%`);
  } catch (error) {
    console.error("Erro ao pesquisar contatos:", error);
    throw error;
  }
};

/**
 * Deleta um contato do banco de dados pelo seu ID.
 * @param id O ID do contato a ser deletado.
 * @returns O resultado da operação de exclusão.
 */
export const deleteContato = (id: number): SQLite.SQLiteRunResult => {
  try {
    return db.runSync('DELETE FROM contatos WHERE id = ?;', id);
  } catch (error) {
    console.error("Erro ao deletar contato:", error);
    throw error;
  }
};
