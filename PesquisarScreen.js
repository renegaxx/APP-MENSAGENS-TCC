// PesquisarScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebaseConfig';

const PesquisarScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setSearchResults([]);

        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('username', '>=', searchQuery), where('username', '<=', searchQuery + '\uf8ff'));
            const querySnapshot = await getDocs(q);

            const users = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setSearchResults(users);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
        } finally {
            setLoading(false);
        }
    };

    const openChatWithUser = (userId) => {
        navigation.navigate('MessagesScreen', { userId }); // Navega para a tela de mensagens com o ID do usuário
    };

    const renderResultItem = ({ item }) => (
        <TouchableOpacity onPress={() => openChatWithUser(item.id)} style={styles.resultItem}>
            <Text style={styles.resultText}>{item.fullName} ({item.username})</Text>
            <Text style={styles.resultEmail}>{item.email}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.tudo}>
                <Image source={require('./assets/black3.png')} style={StyleSheet.absoluteFill} />
                <Text style={styles.title}>Pesquisa de Usuários</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Digite o nome do usuário..."
                    placeholderTextColor="#ccc"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <TouchableOpacity style={styles.button} onPress={handleSearch}>
                    <Text style={styles.buttonText}>{loading ? 'Buscando...' : 'Buscar'}</Text>
                </TouchableOpacity>

                <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item.id}
                    renderItem={renderResultItem}
                    ListEmptyComponent={!loading && (
                        <Text style={styles.emptyText}>Nenhum usuário encontrado</Text>
                    )}
                />
            </View>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('PesquisarScreen')}>
                    <Image source={require('./assets/icons/pesquisarImg.png')} style={styles.botoesSecundarios} />
                </TouchableOpacity>
                <Image source={require('./assets/icons/slaImg.png')} style={styles.botoesSecundarios} />
                <Image source={require('./assets/icons/notificationImg.png')} style={styles.botoesSecundarios} />
                <TouchableOpacity onPress={() => navigation.navigate('UsuariosConversas')}>
                    <Image source={require('./assets/icons/messageImg.png')} style={styles.botoesSecundarios} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center', // Centraliza horizontalmente
        height: 50, // altura desejada do container
        width: '80%', // largura do container
        flexDirection: 'row',
        justifyContent: 'space-around', // espaçamento igual entre os ícones
        alignItems: 'center',
        paddingVertical: 20,
        borderTopWidth: 1,
        borderColor: '#ddd', // linha de separação com o conteúdo acima
        marginBottom: 10,
    },
    botoesSecundarios: {
        width: 34,
        height: 34,
        resizeMode: 'cover',

    },

    tudo: {
        width: '100%',
        paddingHorizontal: 30
    },


    container: {
        flex: 1,
        paddingTop: 60,
        backgroundColor: '#000',
    },
    title: {
        fontSize: 32, color: 'white',
        textAlign: 'center',
        marginBottom: 20
    },
    input: {
        height: 50, borderColor: '#fff',
        borderWidth: 1.5,
        borderRadius: 10,
        paddingHorizontal: 20,
        color: 'white',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#9F3EFC',
        height: 55, alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 17,
        marginTop: 10
    },
    buttonText: {
        color: '#fff',
        fontSize: 18
    },
    resultItem: {
        backgroundColor: '#1a1a1a',
        padding: 15,
        borderRadius: 10,
        marginTop: 10
    },
    resultText: {
        color: 'white',
        fontSize: 18
    },
    resultEmail: {
        color: '#ccc',
        fontSize: 14
    },
    emptyText: {
        color: '#ccc',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20
    },
});

export default PesquisarScreen;
