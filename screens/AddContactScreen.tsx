import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { addContato } from '../database/database';
import { AddContactScreenProps } from '../types/types';

const AddContactScreen = ({ navigation }: AddContactScreenProps) => {
  const [nome, setNome] = useState<string>('');
  const [telefone, setTelefone] = useState<string>('');

  const handleSave = async () => {
    if (!nome.trim() || !telefone.trim()) {
      Alert.alert('Erro', 'Nome e telefone são obrigatórios.');
      return;
    }
    try {
      await addContato(nome, telefone);
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível salvar o contato.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nome do Contato"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />
      <Button title="Salvar Contato" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default AddContactScreen;