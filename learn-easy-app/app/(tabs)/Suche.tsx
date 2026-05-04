import { useState } from 'react';
import { Image, ImageSourcePropType, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Thema = {
  id: string;
  titel: string;
  bild: ImageSourcePropType | null;
};

const THEMEN: Thema[] = [
  { id: '1', titel: 'Mongolisches Reich',     bild: require('@/assets/images/themen/mongolisches-reich.png') },
  { id: '2', titel: 'Frauen in der Technik',  bild: require('@/assets/images/themen/frauen-technik.png') },
  { id: '3', titel: 'Klimawandel',            bild: require('@/assets/images/themen/klimawandel.png') },
  { id: '4', titel: 'Künstliche Intelligenz', bild: require('@/assets/images/themen/kuenstliche-intelligenz.png') },
  { id: '5', titel: 'Die Raumfahrt',          bild: require('@/assets/images/themen/raumfahrt.png') },
];

export default function SucheScreen() {
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  const filtered = THEMEN.filter(t =>
    t.titel.toLowerCase().includes(query.toLowerCase())
  );

  function toggleSave(id: string) {
    setSaved(prev => ({ ...prev, [id]: !prev[id] }));
  }

  const tint = '#0a7ea4';

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.heading}>Suche</ThemedText>
      <ThemedText style={[styles.label, { color: Colors[theme].icon }]}>
        Schreibe die Inhalte die du suchst hier ein
      </ThemedText>

      {/* Suchleiste */}
      <View style={[styles.searchBar, {
        backgroundColor: isDark ? '#2c2c2e' : '#f0f0f0',
        borderColor: isDark ? '#444' : '#ddd',
      }]}>
        <TextInput
          style={[styles.input, { color: Colors[theme].text }]}
          value={query}
          onChangeText={setQuery}
          placeholder="Text hier"
          placeholderTextColor={Colors[theme].icon}
          returnKeyType="search"
        />
        <IconSymbol name="magnifyingglass" size={18} color={Colors[theme].icon} />
      </View>

      <ThemedText style={[styles.ergebnisse, { color: tint }]}>
        {filtered.length} Ergebnisse
      </ThemedText>

      {/* Karten */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
        {filtered.map(thema => (
          <View key={thema.id} style={styles.kursBlock}>
            <ThemedText type="defaultSemiBold" style={[styles.kursTitle, { color: tint }]}>
              {thema.titel}
            </ThemedText>
            <View style={[styles.card, { backgroundColor: isDark ? '#2c2c2e' : '#e8e8e8' }]}>
              {thema.bild ? (
                <Image source={thema.bild} style={styles.cardImage} resizeMode="cover" />
              ) : (
                <IconSymbol name="photo" size={40} color={Colors[theme].icon} />
              )}
              <TouchableOpacity
                style={[
                  styles.bookmark,
                  saved[thema.id]
                    ? { backgroundColor: tint, borderWidth: 0 }
                    : { backgroundColor: 'rgba(0,0,0,0.35)', borderWidth: 2, borderColor: '#fff' },
                ]}
                onPress={() => toggleSave(thema.id)}
                activeOpacity={0.7}
              >
                <IconSymbol
                  name="bookmark.fill"
                  size={16}
                  color={saved[thema.id] ? '#fff' : 'rgba(255,255,255,0.5)'}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 72,
    paddingHorizontal: 16,
  },
  heading: {
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 6,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  ergebnisse: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  kursBlock: {
    marginBottom: 20,
  },
  kursTitle: {
    fontSize: 15,
    marginBottom: 8,
  },
  card: {
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  bookmark: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
