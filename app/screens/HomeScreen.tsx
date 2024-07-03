import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import ListFreelancer from '../components/ListFreelancer';
import Layout from '../components/Layout';

export default function HomeScreen() {
  const [selectedValue, setSelectedValue] = useState("A");
  const [isPickerVisible, setPickerVisible] = useState(false);
 

  const serviceTypes = [
    "A","Açougueiro", "Administrador de empresas", "Advogado Ambientalista", "Advogado Cível",
    "Advogado Criminalista", "Advogado do Consumidor", "Advogado Digital", "Advogado Geral",
    "Advogado Imobiliário", "Advogado Previdenciário", "Advogado Trabalhista", "Agricultor",
    "Ajudante geral", "Analista financeiro", "Apicultor", "Arquiteto", "Artesão", "Assistente social","B",
    "Ator/Atriz", "Auxiliar administrativo", "Auxiliar de cozinha", "Auxiliar de limpeza",
    "Babá", "Bancário", "Barbeiro", "Barbeiro móvel", "Bartender", "Biólogo", "Biomédico",
    "Bioquímico", "Borracheiro", "Borracheiro móvel", "C","Cabeleireiro", "Camareira", "Carpinteiro",
    "Cartógrafo", "Caseiro", "Cerqueiro", "Chaveiro", "Churrasqueiro", "Confeiteiro", "Contador",
    "Cozinheiro", "Cuidador de animais", "Cuidador de idosos", "D", "Decorador de festas", "Dentista",
    "Dermoconsultor", "Desenvolvedor de aplicativos", "Desenvolvedor de jogos", "Desenvolvedor de sites",
    "Designer de interiores", "Designer gráfico", "Diarista", "DJ", "Doméstica (o)", "E", "Eletricista",
    "Eletrônico", "Encanador", "Enfermeiro", "Engenheiro agrônomo", "Engenheiro civil",
    "Engenheiro de controle e automação", "Engenheiro de materiais", "Engenheiro de produção",
    "Engenheiro de segurança do trabalho", "Engenheiro de software", "Engenheiro eletricista",
    "Engenheiro mecânico", "Engenheiro químico", "Esteticista", "F", "Faxineiro (a)", "Farmacêutico",
    "Fisioterapeuta", "Fotógrafo", "Funileiro","G", "Garçom", "Geólogo (a)", "Gestor ambiental", "Gestor de projetos",
    "Guia turístico","I", "Influencer", "J", "Jardineiro", "L", "Lavador de carros", "Lavador de janelas", "Limpador de piscina",
    "M","Manicure", "Marceneiro", "Marido de aluguel", "Massagista", "Mecânico de bicicletas", "Mecânico de carros",
    "Mecânico de máquinas agrícolas", "Mecânico de motos", "Mecânico geral", "Mecânico industrial",
    "Médico Cardiologista", "Médico Clínico Geral", "Médico Dermatologista", "Médico Gástrico", "Médico Geriatra",
    "Médico Neurologista", "Médico Neurocirurgião", "Médico Oftalmologista", "Médico Oncologista",
    "Médico Ortopedista", "Médico Pediatra", "Médico Psiquiatra", "Médico Veterinário", "Montador de móveis",
    "Motorista", "Motorista de caminhão", "Motorista de corrida urbana", "Motorista de táxi", "Motoboy", 
    "Moto-táxi", "Músico","N", "Nutricionista","O", "Operador de caixa", "Operador de empilhadeira", 
    "Operador de máquina colheitadeira", "Operador de trator","P", "Padeiro", "Pedreiro", "Personal organizer", 
    "Personal trainer", "Pintor", "Pintor de automóveis", "Piscineiro", "Podólogo", "Professor particular de Biologia",
    "Professor particular de Física", "Professor particular de Matemática", "Professor particular de Português", 
    "Professor particular de Química", "Psicólogo","Q", "Quiropraxista","R", "Radialista", "Recepcionista", 
    "Revisor de textos","S", "Serralheiro", "Servente de pedreiro", "Serviços rurais gerais", "Soldador", 
    "T","Tapeceiro", "Técnico de informática", "Técnico de refrigeração", "Técnico de segurança do trabalho", 
    "Técnico em áudio e vídeo", "Técnico em automação", "Técnico em climatização", "Técnico em eletrônica", 
    "Técnico em manutenção de celulares", "Técnico em telecomunicações", "Topógrafo", "Tradutor", "Turismólogo",
    "V","Vaqueiro", "Vendedor", "Veterinário", "Videomaker", "Vidraceiro", "W","Web designer","Z", "Zelador de área rural",
    "Zelador para condomínios", "Zelador para empresas", "Zelador para escolas", "Zelador para prédios comerciais",
    "Zelador residencial"
  ];

  // ordem alfabética
  const sortedServiceTypes = serviceTypes.sort();
  //console.log(sortedServiceTypes)

  

  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.nomeMarca}>12pulo</Text>
        </View>

        <TouchableOpacity 
            style={styles.filterButton} 
            onPress={() => setPickerVisible(!isPickerVisible)}
          >
            <Text style={styles.filterButtonText}>Filtrar</Text>
          </TouchableOpacity>

        {isPickerVisible && (
          <View style={styles.pickerContainer}>
            <Text>TIPOS DE SERVIÇO</Text>
            
            <Picker
              selectedValue={selectedValue}
              style={styles.picker}
              
              onValueChange={(itemValue) => setSelectedValue(itemValue)}
            >
              {sortedServiceTypes.map((service, index) => (
                <Picker.Item key={index} label={service} value={service} />
              ))}
            </Picker>
          </View>
        )}
        </View>

    </Layout>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    //backgroundColor: '#FFF',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  nomeMarca: {
    fontSize: 25,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    letterSpacing:4,
   
  },
  filterButton: {
    backgroundColor: '#FFC88d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  filterButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  pickerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  searchBar: {
    height: 40,
    borderColor: '#CCC',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 10,
    width: '100%',
  },
  picker: {
    height: 50,
    width: '100%',
  },

});
