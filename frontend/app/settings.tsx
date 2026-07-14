import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, SafeAreaView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Globe, 
  Mail, 
  Star, 
  FileText, 
  ShieldCheck, 
  Scale, 
  Info, 
  ChevronRight,
  X 
} from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

  const openURL = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  const openLegalModal = (title: string, content: string) => {
    setModalTitle(title);
    setModalContent(content);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#090d16' }}>
      <View style={{ flex: 1, backgroundColor: '#090d16' }}>
        
        {/* Header Navigation */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.08)' }}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={{ padding: 8, borderRadius: 12, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color="#ffffff" />
          </TouchableOpacity>
          <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '700' }}>Definições</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 24 }}>
          
          {/* App Branding */}
          <View style={{ alignItems: 'center', marginBottom: 28 }}>
            <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: '800', letterSpacing: -0.5 }}>RideTune</Text>
            <Text style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>Suspension Setup Advisor</Text>
          </View>

          {/* Section: Comunidade & Suporte */}
          <Text style={{ color: '#38bdf8', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginLeft: 4 }}>
            Comunidade & Suporte
          </Text>
          
          <View style={{ backgroundColor: '#111827', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', marginBottom: 24 }}>
            <TouchableOpacity 
              onPress={() => openURL('https://ridetune.app')}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' }}
            >
              <Globe size={20} color="#38bdf8" />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '600' }}>Website Oficial</Text>
                <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>Visita o nosso site</Text>
              </View>
              <ChevronRight size={18} color="#64748b" />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => openURL('mailto:support@ridetune.app')}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' }}
            >
              <Mail size={20} color="#38bdf8" />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '600' }}>Apoio ao Cliente</Text>
                <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>Dúvidas ou sugestões</Text>
              </View>
              <ChevronRight size={18} color="#64748b" />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => openURL('https://ridetune.app/review')}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}
            >
              <Star size={20} color="#38bdf8" />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '600' }}>Avaliar a RideTune</Text>
                <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>Deixa a tua opinião na loja</Text>
              </View>
              <ChevronRight size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Section: Informações & Legal */}
          <Text style={{ color: '#38bdf8', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginLeft: 4 }}>
            Informações & Legal
          </Text>

          <View style={{ backgroundColor: '#111827', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', marginBottom: 24 }}>
            <TouchableOpacity 
              onPress={() => openLegalModal(
                'Termos de Utilização', 
                'A aplicação RideTune destina-se a auxiliar na afinação e cálculo de parâmetros de suspensão de motociclos. A utilização dos cálculos e sugestões fornecidos é da exclusiva responsabilidade do condutor.'
              )}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' }}
            >
              <FileText size={20} color="#38bdf8" />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '600' }}>Termos de Utilização</Text>
              </View>
              <ChevronRight size={18} color="#64748b" />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => openLegalModal(
                'Política de Privacidade', 
                'A RideTune respeita a sua privacidade. Os dados de afinação, perfis e configurações introduzidos são guardados maioritariamente de forma local no seu dispositivo para garantir total segurança e controlo dos seus dados.'
              )}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' }}
            >
              <ShieldCheck size={20} color="#38bdf8" />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '600' }}>Política de Privacidade</Text>
              </View>
              <ChevronRight size={18} color="#64748b" />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => openLegalModal(
                'Avisos Legais & Isenção de Responsabilidade', 
                'A RideTune é uma ferramenta de aconselhamento técnico baseada nas especificações informadas. O estado mecânico do veículo, desgaste de componentes e a condução em segurança são sempre da responsabilidade do piloto. Verifique sempre o manual oficial do fabricante da sua moto.'
              )}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}
            >
              <Scale size={20} color="#38bdf8" />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '600' }}>Avisos Legais</Text>
              </View>
              <ChevronRight size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Section: Sobre */}
          <View style={{ backgroundColor: '#111827', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', flexDirection: 'row', alignItems: 'center' }}>
            <Info size={20} color="#38bdf8" />
            <View style={{ marginLeft: 14 }}>
              <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '600' }}>Versão da App</Text>
              <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>v1.1.0 • Built for riders, by riders.</Text>
            </View>
          </View>

        </ScrollView>

        {/* Modal de Informação Legal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' }}>
            <View style={{ backgroundColor: '#111827', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '70%', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '700', flex: 1, paddingRight: 12 }}>{modalTitle}</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={{ padding: 6, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20 }}>
                  <X size={20} color="#ffffff" />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ marginBottom: 20 }}>
                <Text style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 22 }}>
                  {modalContent}
                </Text>
              </ScrollView>

              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={{ backgroundColor: '#38bdf8', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
              >
                <Text style={{ color: '#090d16', fontWeight: '700', fontSize: 15 }}>Entendido</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
}
