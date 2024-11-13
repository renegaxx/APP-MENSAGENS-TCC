import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { auth, db } from './firebaseConfig';  // Importe a configuração do Firebase
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; // Para pegar o documento do Firestore
import { useNavigation } from '@react-navigation/native';  // Importação do hook de navegação

const TelaInicial = () => {
  const navigation = useNavigation();  // Usando o hook de navegação
  const [user, setUser] = useState(null); // Armazenar dados do usuário
  const [fullName, setFullName] = useState(''); // Nome completo do usuário
  const [username, setUsername] = useState(''); // Nome de usuário
  const [email, setEmail] = useState(''); // Email do usuário

  // Monitorar estado de autenticação do usuário
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Usuário logado, buscar dados do Firestore
        const userRef = doc(db, "users", user.uid); // Acessa o documento do usuário no Firestore
        getDoc(userRef)
          .then((docSnap) => {
            if (docSnap.exists()) {
              const userData = docSnap.data();
              // Atualizar os estados com as informações do usuário
              setFullName(userData.fullName);
              setUsername(userData.username);
              setEmail(userData.email);
            } else {
              console.log("Usuário não encontrado no Firestore");
            }
          })
          .catch((error) => {
            console.log("Erro ao recuperar dados do Firestore:", error);
          });
      } else {
        console.log("Usuário não está logado.");
      }
    });

    return () => unsubscribe(); // Limpeza do listener quando o componente for desmontado
  }, []);

  // Array de eventos com imagens e informações (adicione seus dados aqui)
  const eventsData = [
    { id: '1', image: require('./assets/mcigPerfil.jpg'), title: 'Display Expo', description: '' },
    { id: '2', image: require('./assets/mcigPerfil.jpg'), title: 'Belo horzizjisj mas bem de verdade', description: '' },
    { id: '3', image: require('./assets/mcigPerfil.jpg'), title: 'Evento 3', description: '' },
    { id: '4', image: require('./assets/mcigPerfil.jpg'), title: 'Evento 4', description: '' },
    { id: '5', image: require('./assets/mcigPerfil.jpg'), title: 'Evento 5', description: '' },
    { id: '6', image: require('./assets/mcigPerfil.jpg'), title: 'Evento 6', description: '' },
    { id: '7', image: require('./assets/mcigPerfil.jpg'), title: 'Evento 7', description: '' },
  ];

  return (
    <View style={styles.container}>
      {/* CONTEÚDO DE BOAS VINDAS */}
      <View style={styles.cimas}>
        <View style={styles.bolaMenu}>
          <Image source={require('./assets/menuInicial.png')} style={styles.MenuInicial} />
        </View>
        {/* Exibir as informações do usuário */}
        <Text style={styles.textoCima}>
          Olá, {fullName || 'Usuário'}
        </Text>
        {/* Ao clicar na foto de perfil, navega para a tela de perfil */}
        <View style={styles.bolaMenu2}>
          <TouchableOpacity
            onPress={() => navigation.navigate('PerfilScreen', { fullName, username, email })} // Passando os parâmetros
          >
            <Image source={require('./assets/mcigPerfil.jpg')} style={styles.perfil1} />
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTEÚDO DOS EVENTOS */}
      <View style={styles.eventsContainer}>
        <Text style={styles.eventsTitle}>Eventos</Text>
        <FlatList
          data={eventsData}
          horizontal
          renderItem={({ item }) => (
            <View style={styles.eventItem}>
              <TouchableOpacity>
                <Image source={item.image} style={styles.eventImage} />
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.eventDescription}>{item.description}</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false} // Desabilita a barra de rolagem
        />
      </View>

      {/* CONTEÚDO DE MARCAR PRESENÇA */}
      <View style={styles.marcar}>
        <View style={styles.escreverCodigo}>
          <Image source={require('./assets/codeImg.png')} style={styles.botaoMarca} />
          <Text style={styles.escreverTexto}>Escrever Código</Text>
        </View>
        <View style={styles.QRcode}>
          <Image source={require('./assets/QRcodeImg.png')} style={styles.botaoMarca} />
          <Text style={styles.escreverTexto2}>QR code</Text>
        </View>
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
    marginBottom: 20,
  },
  botoesSecundarios: {
    width: 34,
    height: 34,
    resizeMode: 'cover',

  },
  cimas: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%', // Garante que ocupe a largura da tela
    paddingHorizontal: 30,
  },
  bolaMenu: {
    width: 47,
    height: 47,
    borderRadius: 1000, // Deixa a borda circular
    backgroundColor: '#171717',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 'auto',
    borderWidth: 0.5, // Espessura da borda
    borderColor: '#fff', // Cor da borda (por exemplo, branco)
  },
  bolaMenu2: {
    width: 55,
    height: 55,
    borderRadius: 1000,
    backgroundColor: '#171717',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  perfil1: {
    width: 45,
    height: 45,
    resizeMode: 'cover',
    borderRadius: 100,
  },
  botaoMarca: {
    width: 25,
    height: 25,
    resizeMode: 'cover',
  },
  MenuInicial: {
    width: 25,
    height: 25,
    resizeMode: 'cover',
  },
  textoCima: {
    fontSize: 14,
    fontFamily: 'Raleway-SemiBold',
    color: 'white',
    marginLeft: 10, // Ajusta a distância do texto em relação à foto
  },
  // Estilos para o Carrossel de Eventos
  eventsContainer: {
    marginTop: 20,
    width: '100%',
  },
  eventsTitle: {
    fontSize: 22,
    fontFamily: 'Raleway-SemiBold',
    color: 'white',
    marginBottom: 10,
    paddingHorizontal: 30,
  },
  eventItem: {
    marginRight: 10,
    marginTop: 10,
  },
  eventImage: {
    width: 95,
    height: 95,
    borderRadius: 1000, // Deixa a borda circular
    resizeMode: 'cover',
    marginHorizontal: 10,
  },
  eventTitle: {
    color: 'white',
    fontSize: 11,
    fontFamily: 'Raleway-Regular',
    marginTop: 5,
    textAlign: 'center',
    justifyContent: 'center',
    width: 100,
  },
  eventDescription: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Raleway-Regular',
    textAlign: 'center',
    marginTop: 3,
  },
  // Estilos para a marcação de presença
  marcar: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center', // Alinha o conteúdo ao centro
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  escreverCodigo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#171717',
    width: 150,
    height: 43,
    padding: 10,
    borderRadius: 30,
    marginRight: 'auto',
  },
  QRcode: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    justifyContent: 'center',
    width: 150,
    height: 40,
    borderRadius: 30,
    color: 'black',
    marginLeft: 'auto',
  },

  escreverTexto: {
    color: 'white',
    fontSize: 11,
    fontFamily: 'Raleway-SemiBold',
    marginLeft: 10, // Ajusta o espaço entre o ícone e o texto
  },
  escreverTexto2: {
    color: 'black',
    fontSize: 11,
    fontFamily: 'Raleway-Bold',
    marginLeft: 10, // Ajusta o espaço entre o ícone e o texto
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

export default TelaInicial;
