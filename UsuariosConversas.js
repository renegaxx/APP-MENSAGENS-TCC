import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, ActivityIndicator, TextInput } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const UsuariosConversas = ({ navigation }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const db = getFirestore();

    // Função para buscar todos os usuários
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const userId = getAuth().currentUser?.uid;
            if (!userId) return;

            const usersRef = collection(db, 'users');
            const userSnapshot = await getDocs(usersRef);

            const usersList = [];
            userSnapshot.forEach((doc) => {
                const data = doc.data();
                console.log(data); // Verifique aqui se lastMessage existe
                if (doc.id !== userId) {
                    usersList.push({ id: doc.id, ...data });
                }
            });

            setUsers(usersList);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchUsers();
    }, []);

    // Função para abrir a tela de mensagens com o usuário
    const openChat = (otherUserId) => {
        navigation.navigate('MessagesScreen', { userId: otherUserId });
    };

    // Função para limitar o número de palavras e adicionar "..."
    const formatMessage = (message) => {
        if (!message) return '';
        const words = message.split(' ');
        return words.length > 13 ? words.slice(0, 13).join(' ') + '...' : message;
    };

    // Renderização de cada item da lista de usuários
    const renderUserItem = ({ item }) => (
        <TouchableOpacity onPress={() => openChat(item.id)} style={styles.userItem}>
            <View style={styles.tudoUsuarios}>
                <Image source={require('./assets/mcigPerfil.jpg')} style={styles.perfil1} />
                <View style={styles.textConteudo}>
                    <Text style={styles.userText}>
                        {item.username || 'Usuário desconhecido'}
                    </Text>
                    <Text style={styles.lastMessageText}>
                        {formatMessage(item.lastMessage || "Nenhuma mensagem ainda")}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={style.topo}>
                    <TextInput
                        style={styles.input}
                        placeholder="Pesquisar conversas"
                        placeholderTextColor="#A1A0A0"
                    />
                    
                </View>

                <View style={styles.tabContainer}>
                    <Text style={[styles.tabText, styles.activeTab]}>Todos</Text>
                    <Text style={styles.tabText}>Favoritos</Text>
                    <Text style={styles.tabText}>Bloqueados</Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#9F3EFC" />
                ) : (
                    <FlatList
                        data={users}
                        keyExtractor={(item) => item.id}
                        renderItem={renderUserItem}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>Não há usuários disponíveis.</Text>
                        }
                    />
                )}
            </View>

            <View style={styles.footer}>
                <TouchableOpacity onPress={() => navigation.navigate('PesquisarScreen')}>
                    <Image source={require('./assets/icons/pesquisarImg.png')} style={styles.footerIcon} />
                </TouchableOpacity>
                <Image source={require('./assets/icons/slaImg.png')} style={styles.footerIcon} />
                <Image source={require('./assets/icons/notificationImg.png')} style={styles.footerIcon} />
                <TouchableOpacity onPress={() => navigation.navigate('UsuariosConversas')}>
                    <Image source={require('./assets/icons/messageImg.png')} style={styles.footerIcon} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: '#000',
    },
    tudoUsuarios: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    perfil1: {
        width: 53,
        height: 53,
        resizeMode: 'cover',
        borderRadius: 100,
    },
    textConteudo: {
        marginLeft: 10
    },
    content: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 10,
    },
    input: {
        backgroundColor: '#1a1a1a',
        color: 'white',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 30,
        marginBottom: 15,
        fontSize: 16,
    },
    title: {
        fontSize: 32,
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
        alignItems: 'center'
    },
    tabText: {
        fontFamily: 'Raleway-SemiBold',
        fontSize: 17,
        color: '#A1A0A0',
    },
    activeTab: {
        color: '#fff',
        backgroundColor: '#9F3EFC',
        paddingVertical: 7,
        paddingHorizontal: 20,
        borderRadius: 30
    },
    userItem: {
        backgroundColor: '#1a1a1a',
        padding: 13,
        borderRadius: 30,
        marginTop: 10,
    },
    userText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Raleway-SemiBold'
    },
    lastMessageText: {
        color: '#A1A0A0',
        fontSize: 14,
        marginTop: 5,
        fontFamily: 'Inter-Regular'
    },
    emptyText: {
        color: '#A1A0A0',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        height: 70,
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: '#1a1a1a',
        borderTopWidth: 1,
        borderColor: '#333',
        borderRadius: 50,
    },
    footerIcon: {
        width: 34,
        height: 34,
        resizeMode: 'contain',
    },
});

export default UsuariosConversas;
