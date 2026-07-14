import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, SafeAreaView } from 'react-native';
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
  ChevronRight 
} from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();

  const openURL = (url: string) => {
    Linking.openURL(url).catch(() => {});
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
              onPress={() => openURL('https://ridetune.app/terms')}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' }}
            >
              <FileText size={20} color="#38bdf8" />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '600' }}>Termos de Utilização</Text>
              </View>
              <ChevronRight size={18} color="#64748b" />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => openURL('https://ridetune.app/privacy')}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' }}
            >
              <ShieldCheck size={20} color="#38bdf8" />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '600' }}>Política de Privacidade</Text>
              </View>
              <ChevronRight size={18} color="#64748b" />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => openURL('https://ridetune.app/legal')}
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
      </View>
    </SafeAreaView>
  );
}
