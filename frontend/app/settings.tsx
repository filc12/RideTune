import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, SafeAreaView, Modal, Share } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
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
  X,
  Share2
} from 'lucide-react-native';
import { useT } from '@/src/i18n';
import { useScreenView } from '@/src/hooks/useScreenView';

export default function SettingsScreen() {
  useScreenView("definicoes");
  const router = useRouter();
  const { t } = useT();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

  const openURL = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  const handleShareSetup = async () => {
    try {
      await Share.share({
        title: `RideTune — ${t('settings.sec.community')}`,
        message: `${t('settings.community.web.sub')}: https://www.ridetune.app/setups`,
        url: 'https://www.ridetune.app/setups',
      });
    } catch (error) {
      // Ignorar cancelamento
    }
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
          <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '700' }}>{t('settings.title')}</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 24 }}>

          {/* App Branding */}
          <View style={{ alignItems: 'center', marginBottom: 28 }}>
            <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: '800', letterSpacing: -0.5 }}>RideTune</Text>
            <Text style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>{t('settings.tagline')}</Text>
          </View>

          {/* Section: Comunidade & Setups */}
          <Text style={{ color: '#38bdf8', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginLeft: 4 }}>
            {t('settings.sec.community')}
          </Text>

          <View style={{ backgroundColor: '#111827', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', marginBottom: 24 }}>
            <TouchableOpacity
              onPress={() => openURL('https://www.ridetune.app/setups')}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' }}
            >
              <Globe size={20} color="#38bdf8" />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '600' }}>{t('settings.community.web')}</Text>
                <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>{t('settings.community.web.sub')}</Text>
              </View>
              <ChevronRight size={18} color="#64748b" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShareSetup}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' }}
            >
              <Share2 size={20} color="#38bdf8" />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '600' }}>{t('settings.community.share')}</Text>
                <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>{t('settings.community.share.sub')}</Text>
              </View>
              <ChevronRight size={18} color="#64748b" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => openURL('mailto:support@ridetune.app')}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' }}
            >
              <Mail size={20} color="#38bdf8" />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '600' }}>{t('settings.support')}</Text>
                <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>{t('settings.support.sub')}</Text>
              </View>
              <ChevronRight size={18} color="#64748b" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => openURL('https://play.google.com/store/apps/details?id=com.ridetune.app')}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}
            >
              <Star size={20} color="#38bdf8" />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '600' }}>{t('settings.rate')}</Text>
                <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>{t('settings.rate.sub')}</Text>
              </View>
              <ChevronRight size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Section: Informações & Legal */}
          <Text style={{ color: '#38bdf8', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginLeft: 4 }}>
            {t('settings.sec.legal')}
          </Text>

          <View style={{ backgroundColor: '#111827', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', marginBottom: 24 }}>
            <TouchableOpacity
              onPress={() => openLegalModal(t('info.terms'), t('info.terms.body'))}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' }}
            >
              <FileText size={20} color="#38bdf8" />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '600' }}>{t('info.terms')}</Text>
              </View>
              <ChevronRight size={18} color="#64748b" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => openLegalModal(t('info.privacy'), t('info.privacy.body'))}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' }}
            >
              <ShieldCheck size={20} color="#38bdf8" />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '600' }}>{t('info.privacy')}</Text>
              </View>
              <ChevronRight size={18} color="#64748b" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => openLegalModal(t('info.legal'), t('info.legal.body'))}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}
            >
              <Scale size={20} color="#38bdf8" />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '600' }}>{t('info.legal')}</Text>
              </View>
              <ChevronRight size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Section: Sobre */}
          <View style={{ backgroundColor: '#111827', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', flexDirection: 'row', alignItems: 'center' }}>
            <Info size={20} color="#38bdf8" />
            <View style={{ marginLeft: 14 }}>
              <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '600' }}>{t('settings.version')}</Text>
              <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>v{Constants.expoConfig?.version ?? '1.0.0'} • {t('settings.built_by')}</Text>
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
                <Text style={{ color: '#090d16', fontWeight: '700', fontSize: 15 }}>{t('common.ok')}</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
}
