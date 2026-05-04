import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/context/theme-context';

type EditField = 'name' | 'kurs' | 'passwort' | 'email';

const EDIT_OPTIONS: { field: EditField; label: string }[] = [
  { field: 'name', label: 'Name ändern' },
  { field: 'kurs', label: 'Kurs ändern' },
  { field: 'passwort', label: 'Passwort ändern' },
  { field: 'email', label: 'Email ändern' },
];

export default function AccountScreen() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState('Max Mustermann');
  const [email, setEmail] = useState('max.mustermann@example.com');
  const [kurs, setKurs] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [activeField, setActiveField] = useState<EditField | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [pushEnabled, setPushEnabled] = useState(true);

  const { theme, isDarkMode, setDarkMode } = useAppTheme();
  const tint = isDarkMode ? '#0a7ea4' : Colors[theme].tint;
  const isDark = theme === 'dark';
  const onTintText = '#fff';

  async function openImagePicker() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) setProfileImage(result.assets[0].uri);
  }

  function handleAvatarPress() {
    if (!profileImage) { openImagePicker(); return; }
    Alert.alert('Profilbild', undefined, [
      { text: 'Foto ändern', onPress: openImagePicker },
      { text: 'Foto löschen', style: 'destructive', onPress: () => setProfileImage(null) },
      { text: 'Abbrechen', style: 'cancel' },
    ]);
  }

  function openEdit(field: EditField) {
    const current: Record<EditField, string> = { name, email, kurs, passwort: '' };
    setInputValue(current[field]);
    setActiveField(field);
    setEditOpen(false);
  }

  function saveEdit() {
    if (!activeField) return;
    if (activeField === 'name') setName(inputValue.trim() || name);
    if (activeField === 'email') setEmail(inputValue.trim() || email);
    if (activeField === 'kurs') setKurs(inputValue.trim());
    setActiveField(null);
  }

  const modalTitle: Record<EditField, string> = {
    name: 'Name ändern',
    email: 'Email ändern',
    kurs: 'Kurs ändern',
    passwort: 'Passwort ändern',
  };

  const cardBg = isDark ? '#1c1c1e' : '#fff';
  const borderColor = isDark ? '#333' : '#e0e0e0';

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.heading}>Account</ThemedText>

      {/* Avatar */}
      <Pressable onPress={handleAvatarPress} style={styles.avatarWrapper}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatarPlaceholder, { borderColor: tint }]}>
            <IconSymbol name="person.fill" size={48} color={tint} />
          </View>
        )}
        <View style={[styles.editBadge, { backgroundColor: tint }]}>
          <IconSymbol name="paperplane.fill" size={12} color="#fff" />
        </View>
      </Pressable>

      {/* Name + Email */}
      <ThemedText type="defaultSemiBold" style={styles.name}>{name}</ThemedText>
      <ThemedText style={[styles.emailText, { color: Colors[theme].icon }]}>{email}</ThemedText>

      {/* Edit Dropdown */}
      <View style={styles.dropdownWrapper}>
        <Pressable
          onPress={() => setEditOpen((v) => !v)}
          style={[styles.editButton, { backgroundColor: tint }]}
        >
          <ThemedText style={styles.editButtonText}>Edit</ThemedText>
          <IconSymbol
            name={editOpen ? 'chevron.left.forwardslash.chevron.right' : 'chevron.right'}
            size={14}
            color="#fff"
          />
        </Pressable>

        {editOpen && (
          <View style={[styles.dropdown, { backgroundColor: cardBg, borderColor }]}>
            {EDIT_OPTIONS.map((opt, i) => (
              <Pressable
                key={opt.field}
                onPress={() => openEdit(opt.field)}
                style={[
                  styles.dropdownItem,
                  i < EDIT_OPTIONS.length - 1 && { borderBottomWidth: 1, borderBottomColor: borderColor },
                ]}
              >
                <ThemedText style={styles.dropdownItemText}>{opt.label}</ThemedText>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Settings Card */}
      <View style={[styles.settingsCard, { backgroundColor: cardBg, borderColor }]}>
        <IconSymbol name="gear" size={22} color={tint} style={styles.settingsIcon} />

        <View style={[styles.settingsRow, { borderBottomWidth: 1, borderBottomColor: borderColor }]}>
          <ThemedText style={styles.settingsLabel}>Push Notifikation</ThemedText>
          <Switch
            value={pushEnabled}
            onValueChange={setPushEnabled}
            trackColor={{ false: '#ccc', true: tint }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.settingsRow}>
          <ThemedText style={styles.settingsLabel}>Dark Mode</ThemedText>
          <Switch
            value={isDarkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#ccc', true: tint }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Edit Modal */}
      <Modal visible={activeField !== null} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setActiveField(null)}>
          <Pressable style={[styles.modalBox, { backgroundColor: cardBg }]}>
            <ThemedText type="defaultSemiBold" style={styles.modalTitle}>
              {activeField ? modalTitle[activeField] : ''}
            </ThemedText>
            <TextInput
              style={[styles.input, { color: isDark ? '#fff' : '#000', borderColor: isDark ? '#444' : '#ccc' }]}
              value={inputValue}
              onChangeText={setInputValue}
              autoFocus
              secureTextEntry={activeField === 'passwort'}
              placeholder={activeField === 'passwort' ? 'Neues Passwort' : ''}
              placeholderTextColor={Colors[theme].icon}
            />
            <View style={styles.modalButtons}>
              <Pressable onPress={() => setActiveField(null)} style={styles.modalCancel}>
                <ThemedText style={{ color: Colors[theme].icon }}>Abbrechen</ThemedText>
              </Pressable>
              <Pressable onPress={saveEdit} style={[styles.modalSave, { backgroundColor: tint }]}>
                <ThemedText style={styles.modalSaveText}>Speichern</ThemedText>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
  },
  heading: {
    alignSelf: 'flex-start',
    marginLeft: 24,
    marginBottom: 32,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  editBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    marginBottom: 20,
  },
  dropdownWrapper: {
    alignItems: 'center',
    width: 200,
    marginBottom: 28,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  dropdown: {
    marginTop: 8,
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  dropdownItemText: {
    fontSize: 15,
    textAlign: 'center',
  },
  settingsCard: {
    width: '85%',
    borderRadius: 16,
    borderWidth: 1,
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  settingsIcon: {
    marginBottom: 8,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingsLabel: {
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: 300,
    borderRadius: 16,
    padding: 24,
    gap: 16,
  },
  modalTitle: {
    fontSize: 17,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalCancel: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  modalSave: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalSaveText: {
    color: '#fff',
    fontWeight: '600',
  },
});
