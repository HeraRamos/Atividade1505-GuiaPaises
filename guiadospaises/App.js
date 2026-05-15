import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  const [paisDigitado, setPaisDigitado] = useState('');
  const [pais, setPais] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  async function buscarPais(nome = paisDigitado) {
    if (nome.trim() === '') {
      setErro('Digite o nome de um país');
      setPais(null);
      return;
    }

    try {
      setCarregando(true);
      setErro('');
      setPais(null);

      const resposta = await fetch(
        `https://restcountries.com/v3.1/name/${nome.toLowerCase()}`
      );

      if (!resposta.ok) {
        throw new Error('País não encontrado');
      }

      const dados = await resposta.json();
      setPais(dados[0]);
    } catch {
      setErro(
        'País não encontrado. Tente em inglês (ex: brazil, japan, france)'
      );
    } finally {
      setCarregando(false);
    }
  }

  async function buscarPaisAleatorio() {
    const paises = [
      'brazil',
      'japan',
      'france',
      'canada',
      'argentina',
      'germany',
      'italy',
      'mexico',
      'india',
      'china',
      'australia',
      'spain',
    ];

    const aleatorio =
      paises[Math.floor(Math.random() * paises.length)];

    setPaisDigitado(aleatorio);
    buscarPais(aleatorio);
  }

  function formatarNumero(numero) {
    return Number(numero).toLocaleString('pt-BR');
  }

  function obterIdiomas() {
    if (!pais?.languages) return 'Não informado';
    return Object.values(pais.languages).join(', ');
  }

  function obterMoedas() {
    if (!pais?.currencies) return 'Não informado';

    return Object.values(pais.currencies)
      .map(
        (moeda) =>
          `${moeda.name} (${moeda.symbol || 'sem símbolo'})`
      )
      .join(', ');
  }

  function obterCuriosidade(nomePais) {
    const curiosidades = {
      Brazil: 'O Brasil abriga a maior floresta tropical do mundo.',
      Japan: 'O Japão possui mais de 6 mil ilhas.',
      France: 'A França é um dos países mais visitados do mundo.',
      Canada: 'O Canadá tem mais lagos do que qualquer outro país.',
      Australia: 'A Austrália é um país e um continente ao mesmo tempo.',
      Germany: 'A Alemanha possui mais de 1.500 tipos de salsicha.',
      India: 'A Índia é o país com maior diversidade linguística.',
    };

    return (
      curiosidades[nomePais] ||
      'Este país possui uma cultura muito interessante!'
    );
  }

  return (
    <LinearGradient
      colors={['#1E3A8A', '#2563EB', '#60A5FA']}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.titulo}>🌍 Guia de Países</Text>
        <Text style={styles.subtitulo}>
          Pesquise países e descubra curiosidades
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Digite em inglês (ex: brazil)"
          placeholderTextColor="#64748B"
          value={paisDigitado}
          onChangeText={setPaisDigitado}
        />

        <TouchableOpacity
          style={styles.botao}
          onPress={() => buscarPais()}
        >
          <Text style={styles.textoBotao}>
            Buscar País
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoAleatorio}
          onPress={buscarPaisAleatorio}
        >
          <Text style={styles.textoBotao}>
            🎲 País Aleatório
          </Text>
        </TouchableOpacity>

        {carregando && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color="#fff"
            />
            <Text style={styles.loadingText}>
              Buscando informações...
            </Text>
          </View>
        )}

        {erro !== '' && (
          <Text style={styles.erro}>{erro}</Text>
        )}

        {pais && (
          <View style={styles.card}>
            <Image
              source={{ uri: pais.flags.png }}
              style={styles.bandeira}
            />

            <Text style={styles.nomePais}>
              {pais.name.common}
            </Text>

            <Text style={styles.nomeOficial}>
              {pais.name.official}
            </Text>

            <View style={styles.infoBox}>
              <Text style={styles.info}>
                🏛 Capital:{' '}
                {pais.capital?.[0] || 'Não informado'}
              </Text>

              <Text style={styles.info}>
                🌎 Região: {pais.region}
              </Text>

              <Text style={styles.info}>
                👥 População:{' '}
                {formatarNumero(pais.population)}
              </Text>

              <Text style={styles.info}>
                📍 Latitude:{' '}
                {pais.latlng?.[0]}
              </Text>

              <Text style={styles.info}>
                📍 Longitude:{' '}
                {pais.latlng?.[1]}
              </Text>

              <Text style={styles.info}>
                📏 Área:{' '}
                {formatarNumero(pais.area)} km²
              </Text>

              <Text style={styles.info}>
                🗣 Idiomas:{' '}
                {obterIdiomas()}
              </Text>

              <Text style={styles.info}>
                💰 Moedas:{' '}
                {obterMoedas()}
              </Text>

              <Text style={styles.info}>
                🕒 Fuso horário:{' '}
                {pais.timezones?.join(', ')}
              </Text>
            </View>

            <View style={styles.curiosidadeBox}>
              <Text style={styles.curiosidadeTitulo}>
                Curiosidade 💡
              </Text>

              <Text style={styles.curiosidade}>
                {obterCuriosidade(
                  pais.name.common
                )}
              </Text>
            </View>

            {pais.maps?.googleMaps && (
              <TouchableOpacity
                style={styles.botaoMapa}
                onPress={() =>
                  Linking.openURL(
                    pais.maps.googleMaps
                  )
                }
              >
                <Text style={styles.textoBotao}>
                  Abrir no Google Maps
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F2FE',
  },

  scroll: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },

  titulo: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 6,
  },

  subtitulo: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 25,
    textAlign: 'center',
  },

  input: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#BAE6FD',
    marginBottom: 15,
    elevation: 3,
  },

  botao: {
    width: '100%',
    backgroundColor: '#2563EB',
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    marginBottom: 10,
  },

  botaoAleatorio: {
    width: '100%',
    backgroundColor: '#06B6D4',
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
    marginBottom: 20,
  },

  textoBotao: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 17,
  },

  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },

  loadingText: {
    color: '#334155',
    marginTop: 10,
    fontSize: 15,
  },

  erro: {
    color: '#DC2626',
    marginTop: 20,
    fontSize: 15,
    textAlign: 'center',
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 12,
  },

  card: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 30,
    padding: 22,
    marginTop: 15,
    elevation: 8,
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },

  bandeira: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    marginBottom: 18,
  },

  nomePais: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0F172A',
  },

  nomeOficial: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },

  infoBox: {
    gap: 12,
  },

  info: {
    fontSize: 16,
    color: '#1E293B',
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 16,
    borderLeftWidth: 5,
    borderLeftColor: '#2563EB',
  },

  curiosidadeBox: {
    backgroundColor: '#DBEAFE',
    borderRadius: 20,
    padding: 18,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#93C5FD',
  },

  curiosidadeTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 8,
  },

  curiosidade: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
  },

  botaoMapa: {
    backgroundColor: '#10B981',
    padding: 18,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 20,
    elevation: 5,
  },
});