import type { StackScreenProps } from '@react-navigation/stack';

// Define a estrutura do nosso objeto de contato
export interface Contato {
  id: number;
  nome: string;
  telefone: string;
}

// Define os parâmetros para cada tela no nosso Stack Navigator
// 'undefined' significa que a rota não espera parâmetros
export type RootStackParamList = {
  ContactList: undefined;
  AddContact: undefined;
};

// Define o tipo das props para cada tela, para termos um 'navigation' tipado
export type ContactListScreenProps = StackScreenProps<RootStackParamList, 'ContactList'>;
export type AddContactScreenProps = StackScreenProps<RootStackParamList, 'AddContact'>;