import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { 
  ChevronRight, 
  Globe, 
  Mail, 
  Star, 
  FileText, 
  ShieldCheck, 
  Scale, 
  Info,
  ArrowLeft 
} from 'lucide-react-native';

interface SettingsRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  isLast?: boolean;
}

const SettingsRow = ({ icon, title, subtitle, rightElement, onPress, isLast }: SettingsRowProps) => (
  <TouchableOpacity 
    onPress={onPress}
    activeOpacity={0.7}
    className={`flex-row items-center justify-between p-4 ${!isLast ? 'border-b border-white/5' : ''}`}
  >
    <View className="flex-row items-center flex-1 mr-3">
      <View className="w-9 h-9 rounded-xl bg-blue-500/10 items-center justify-center mr-3">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-white font-medium text-base">{title}</Text>
        {subtitle && <Text className="text-slate-400 text-xs mt-0.5">{subtitle}</Text>}
      </View>
    </View>
    {rightElement || <ChevronRight size={18} color="#64748b" />}
  </TouchableOpacity>
);

export default function SettingsScreen({ navigation }: any) {
  return (
    <View className="flex-1 bg-[#090d16]">
      <View className="flex-row items-center justify-between px-4 pt-12 pb-4 border-b border-white/5">
        <TouchableOpacity onPress={() => navigation?.goBack?.()} className="p-2 -ml-2">
          <ArrowLeft size={22} color="#ffffff" />
        </TouchableOpacity>
        <Text className="text-white font-semibold text-lg">Definições</Text>
        <View className="w-8" />
      </View>

      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        <View className="items-center mb-8">
          <View className="flex-row items-center gap-1.5">
            <View className="w-1.5 h-6 bg-blue-500 rounded-full" />
            <Text className="text-2xl font-bold text-white tracking-tight">
              Ride<Text className="text-blue-400">Tune</Text>
            </Text>
          </View>
          <Text className="text-slate-400 text-xs mt-1">Suspension Setup Advisor</Text>
        </View>

        <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 ml-1">
          Comunidade & Suporte
        </Text>
        <View className="bg-[#111726] rounded-2xl border border-white/5 overflow-hidden mb-6">
          <SettingsRow 
            icon={<Globe size={18} color="#60a5fa" />} 
            title="Website Oficial" 
            subtitle="Visita o nosso site"
            onPress={() => Linking.openURL('https://ride-tune.com')} 
          />
          <SettingsRow 
            icon={<Mail size={18} color="#60a5fa" />} 
            title="Apoio ao Cliente" 
            subtitle="Dúvidas ou sugestões"
            onPress={() => Linking.openURL('mailto:support@ride-tune.com')} 
          />
          <SettingsRow 
            icon={<Star size={18} color="#60a5fa" />} 
            title="Avaliar a RideTune" 
            subtitle="Deixa a tua opinião na loja"
            isLast={true}
          />
        </View>

        <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 ml-1">
          Informações & Legal
        </Text>
        <View className="bg-[#111726] rounded-2xl border border-white/5 overflow-hidden mb-8">
          <SettingsRow 
            icon={<FileText size={18} color="#60a5fa" />} 
            title="Termos de Utilização" 
          />
          <SettingsRow 
            icon={<ShieldCheck size={18} color="#60a5fa" />} 
            title="Política de Privacidade" 
          />
          <SettingsRow 
            icon={<Scale size={18} color="#60a5fa" />} 
            title="Avisos Legais" 
          />
          <SettingsRow 
            icon={<Info size={18} color="#60a5fa" />} 
            title="Versão da App" 
            rightElement={<Text className="text-slate-400 text-xs font-mono">v1.1.0</Text>}
            isLast={true}
          />
        </View>

        <Text className="text-center text-slate-500 text-xs pb-12">
          Built for riders, by riders.
        </Text>
      </ScrollView>
    </View>
  );
}
