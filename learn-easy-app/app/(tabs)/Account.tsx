import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { fonts } from '@/constants/theme';
import { useAppTheme } from '@/context/theme-context';
import { useDB } from '@/db/DatabaseContext';

type EditField = 'name' | 'kurs';

const EDIT_OPTIONS: { field: EditField; label: string }[] = [
  { field: 'name', label: 'Change Name' },
  { field: 'kurs', label: 'Change Course' },
];


export default function AccountScreen() {
  const db = useDB();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [intensity, setIntensity] = useState('');
  const [email, setEmail] = useState('');
  const [kurs, setKurs] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [activeField, setActiveField] = useState<EditField | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [pushEnabled, setPushEnabled] = useState(false);

  const router = useRouter();
  const { theme, isDarkMode, setDarkMode } = useAppTheme();
  const isDark = theme === 'dark';
  const cardBg = isDark ? '#1c1c1e' : '#fff';
  const borderColor = isDark ? '#444' : '#e0e0e0';
  const textColor = isDark ? '#fff' : '#000';
  const subColor = isDark ? '#aaa' : '#666';

  // Problem: Änderungen (z.B. Daily Goal) wurden im Account-Tab nicht aktualisiert – mit KI behoben
  useFocusEffect(
    useCallback(() => {
      if (!db) return;
      const fetchUser = async () => {
        // @ts-ignore
        const user = await db.general.user.findOne({ selector: { current: { $eq: true } } }).exec();
        if (user) {
          const data = user.toJSON();
          setName(data.name ?? '');
          setRole(data.role ?? '');
          setIntensity(data.intensity ? data.intensity.charAt(0).toUpperCase() + data.intensity.slice(1) : '');
          setEmail(data.email ?? '');
          setKurs(String(data.course ?? ''));
        }
      };
      fetchUser();
    }, [db])
  );

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
    Alert.alert('Profile Picture', undefined, [
      { text: 'Change Photo', onPress: openImagePicker },
      { text: 'Delete Photo', style: 'destructive', onPress: () => setProfileImage(null) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  function openEdit(field: EditField) {
    setEditOpen(false);
    if (field === 'kurs') {
      Alert.alert(
        'Change Course',
        'All your progress, completed chapters and bookmarks for the current course will be deleted and reset. Are you sure?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Continue', style: 'destructive', onPress: () => router.push('/start/Kurswahl') },
        ]
      );
      return;
    }
    const current: Record<EditField, string> = { name, kurs };
    setInputValue(current[field]);
    setActiveField(field);
  }

  function saveEdit() {
    if (!activeField) return;
    if (activeField === 'name') setName(inputValue.trim() || name);
    if (activeField === 'email') setEmail(inputValue.trim() || email);
    if (activeField === 'kurs') setKurs(inputValue.trim());
    setActiveField(null);
  }

  const modalTitle: Record<EditField, string> = {
    name: 'Change Name',
    kurs: 'Change Course',
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.heading}>Account</ThemedText>

      {/* Avatar */}
      <Pressable onPress={handleAvatarPress} style={styles.avatarWrapper}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: isDark ? '#2c2c2e' : '#f0ece8' }]}>
            <IconSymbol name="person.fill" size={52} color={isDark ? '#888' : '#b0906a'} />
          </View>
        )}
        <View style={[styles.editBadge, { backgroundColor: isDark ? '#333' : '#e0e0e0' }]}>
          <IconSymbol name="pencil" size={11} color={isDark ? '#fff' : '#333'} />
        </View>
      </Pressable>

      {/* Name / Role / Intensity */}
      <Text style={[fonts.josefin, styles.nameText, { color: textColor }]}>{name || 'Your Name'}</Text>
      <Text style={[fonts.josefin, styles.roleText, { color: subColor }]}>{role || 'Student'}</Text>
      <Text style={[fonts.josefin, styles.intensityText, { color: subColor }]}>{intensity}</Text>

      {/* Options Dropdown */}
      <View style={styles.dropdownWrapper}>
        <Pressable
          onPress={() => setEditOpen((v) => !v)}
          style={[styles.optionsButton, { backgroundColor: '#fff', borderColor: '#e0e0e0' }]}
        >
          <Text style={[fonts.josefin, styles.optionsButtonText, { color: '#111' }]}>Options</Text>
          <IconSymbol name={editOpen ? 'chevron.up' : 'chevron.down'} size={14} color="#111" />
        </Pressable>

        {editOpen && (
          <View style={[styles.dropdown, { backgroundColor: '#fff', borderColor: '#e0e0e0' }]}>
            {EDIT_OPTIONS.map((opt, i) => (
              <Pressable
                key={opt.field}
                onPress={() => openEdit(opt.field)}
                style={[
                  styles.dropdownItem,
                  i < EDIT_OPTIONS.length - 1 && { borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
                ]}
              >
                <Text style={[fonts.josefin, styles.dropdownItemText, { color: '#111' }]}>{opt.label}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Settings Card */}
      <View style={[styles.settingsCard, { backgroundColor: '#fff', borderColor: '#e0e0e0' }]}>
        {/* Card header */}
        <View style={[styles.settingsHeader, { borderBottomWidth: 1, borderBottomColor: '#e0e0e0' }]}>
          <IconSymbol name="gear" size={18} color="#888" />
          <Text style={[fonts.josefin, styles.settingsHeaderText, { color: '#888' }]}>Further Settings</Text>
        </View>

        {/* Theme */}
        <View style={[styles.settingsRow, {}]}>
          <Text style={[fonts.josefin, styles.settingsLabel, { color: '#111' }]}>Light Theme</Text>
          <Switch
            value={!isDarkMode}
            onValueChange={(v) => setDarkMode(!v)}
            trackColor={{ false: '#ccc', true: '#555' }}
            thumbColor="#fff"
          />
        </View>

        {/* Push Notifications */}
        <View style={[styles.settingsRow, {}]}>
          <Text style={[fonts.josefin, styles.settingsLabel, { color: '#111' }]}>Push Notifications</Text>
          <Switch
            value={pushEnabled}
            onValueChange={setPushEnabled}
            trackColor={{ false: '#ccc', true: '#0a7ea4' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Edit Modal */}
      <Modal visible={activeField !== null} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setActiveField(null)}>
          <Pressable style={[styles.modalBox, { backgroundColor: cardBg }]}>
            <Text style={[fonts.josefin, styles.modalTitleText, { color: textColor }]}>
              {activeField ? modalTitle[activeField] : ''}
            </Text>
            <TextInput
              style={[styles.input, { color: textColor, borderColor: isDark ? '#444' : '#ccc' }]}
              value={inputValue}
              onChangeText={setInputValue}
              autoFocus
              secureTextEntry={activeField === 'passwort'}
              placeholder={activeField === 'passwort' ? 'New Password' : ''}
              placeholderTextColor={Colors[theme].icon}
            />
            <View style={styles.modalButtons}>
              <Pressable onPress={() => setActiveField(null)} style={[styles.modalCancel, { borderColor }]}>
                <Text style={[fonts.josefin, { color: subColor }]}>Cancel</Text>
              </Pressable>
              <Pressable onPress={saveEdit} style={[styles.modalSave, { backgroundColor: isDark ? '#fff' : '#000' }]}>
                <Text style={[fonts.josefin, styles.modalSaveText, { color: isDark ? '#000' : '#fff' }]}>Save</Text>
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
    paddingTop: 72,
  },
  heading: {
    alignSelf: 'flex-start',
    marginLeft: 24,
    marginBottom: 28,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 2,
  },
  roleText: {
    fontSize: 14,
    marginBottom: 2,
  },
  intensityText: {
    fontSize: 14,
    marginBottom: 20,
  },
  dropdownWrapper: {
    alignItems: 'center',
    width: 180,
    marginBottom: 24,
    zIndex: 10,
  },
  optionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    width: '100%',
    justifyContent: 'center',
  },
  optionsButtonText: {
    fontSize: 15,
  },
  dropdown: {
    marginTop: 6,
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 13,
    paddingHorizontal: 20,
  },
  dropdownItemText: {
    fontSize: 14,
    textAlign: 'center',
  },
  settingsCard: {
    width: '85%',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingsHeaderText: {
    fontSize: 13,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  settingsLabel: {
    fontSize: 14,
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
  modalTitleText: {
    fontSize: 17,
    textAlign: 'center',
    fontWeight: '600',
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
    borderRadius: 8,
    borderWidth: 1,
  },
  modalSave: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalSaveText: {
    fontWeight: '600',
  },
});
