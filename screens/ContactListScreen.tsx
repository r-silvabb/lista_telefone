import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Linking, Alert, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
// Importa as funções síncronas do banco de dados
import { getContatos, deleteContato, searchContatos, initDB } from '../database/database';
import { ContactListScreenProps, Contato } from '../types/types';
import { Ionicons } from '@expo/vector-icons';

/*
 * ======================================================================================
 * NOTA SOBRE A CORREÇÃO:
 * - A chamada a 'initDB' foi envolvida em um bloco try/catch, pois ela não retorna mais
 * uma Promise e, portanto, não possui o método '.catch()'.
 * - As funções 'loadContatos' e 'handleExcluir' foram ajustadas para chamar as
 * funções do banco de dados de forma síncrona, removendo 'async/await'.
 * ======================================================================================
 */

// A inicialização agora é síncrona e envolvida em um try-catch.
try {
  initDB();
} catch (err) {
  console.log('Erro ao inicializar o DB: ', err);
  // Em um app real, você poderia mostrar um alerta para o usuário aqui.
}

const ContactListScreen = ({ navigation }: ContactListScreenProps) => {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // A função não precisa mais ser 'async'
  const loadContatos = useCallback(() => {
    try {
      const data = searchQuery.trim() === ''
        ? getContatos()           // Chamada síncrona
        : searchContatos(searchQuery); // Chamada síncrona
      setContatos(data);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível carregar os contatos.");
    }
  }, [searchQuery]);

  useFocusEffect(useCallback(() => {
    loadContatos();
  }, [loadContatos]));

  const handleLigar = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleExcluir = (id: number) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Você tem certeza que deseja excluir este contato?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          // A função do onPress também não precisa mais ser 'async'
          onPress: () => {
            try {
              deleteContato(id); // Chamada síncrona
              loadContatos(); // Recarrega a lista
            } catch (error) {
              console.log(error);
              Alert.alert('Erro', 'Não foi possível excluir o contato.');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Contato }) => (
    <View style={styles.itemContainer}>
      <View style={styles.infoContainer}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.telefone}>{item.telefone}</Text>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={() => handleLigar(item.telefone)} style={styles.actionButton}>
            <Ionicons name="call" size={24} color="green" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleExcluir(item.id)} style={styles.actionButton}>
            <Ionicons name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar contatos..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList<Contato>
        data={contatos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum contato encontrado.</Text>}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddContact')}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  searchBar: {
    backgroundColor: 'white', padding: 10, margin: 10, borderRadius: 10,
    borderColor: '#ddd', borderWidth: 1,
  },
  itemContainer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc', backgroundColor: 'white',
  },
  infoContainer: { flex: 1 },
  nome: { fontSize: 18, fontWeight: 'bold' },
  telefone: { fontSize: 14, color: '#666' },
  actionsContainer: { flexDirection: 'row' },
  actionButton: { marginLeft: 15, padding: 5 },
  fab: {
    position: 'absolute', right: 30, bottom: 30, width: 60, height: 60, borderRadius: 30,
    backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center', elevation: 8,
  },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16 }
});

export default ContactListScreen;
