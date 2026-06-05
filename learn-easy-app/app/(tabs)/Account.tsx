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
import { colors, Colors } from '@/constants/theme';
import { fonts } from '@/constants/theme';
import { useAppTheme } from '@/context/theme-context';
import { useDB } from '@/db/DatabaseContext';
import Svg from '@/components/svg';

type EditField = 'name' | 'kurs' | 'role' | 'username' | 'intensity';

const EDIT_OPTIONS: { field: EditField; label: string }[] = [
  { field: 'name', label: 'Change Name' },
  { field: 'username', label: 'Change Username' },
  { field: 'role', label: 'Change Role' },
  { field: 'intensity', label: 'Change Intensity' },
];


export default function AccountScreen() {
  const db = useDB();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [intensity, setIntensity] = useState('');
  const [email, setEmail] = useState('');
  const [kurs, setKurs] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [activeField, setActiveField] = useState<EditField | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [pushEnabled, setPushEnabled] = useState(false);
  // mit KI bearbeitet – Course-Switch Modal, Settings-Design, Switch-Course in Settings verschoben
  const [showCourseSwitch, setShowCourseSwitch] = useState(false);
  const [showRolePicker, setShowRolePicker] = useState(false);
  const [showIntensityPicker, setShowIntensityPicker] = useState(false);

  const intensities = [
    { value: 'easy', label: 'Easy', freq: '1x a day' },
    { value: 'medium', label: 'Medium', freq: '3x a day' },
    { value: 'hard', label: 'Hard', freq: '5x a day' },
  ];

  const roles = [
    { value: 'student', label: 'Student' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'learner', label: 'Just looking for new things to learn' },
  ];

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
          setUsername(data.username ?? '');
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

  // Reagiert auf Tap auf das Profilbild:
  // Ohne Bild → öffnet direkt den Galerie-Picker.
  // Mit bestehendem Bild → zeigt Aktionsmenü mit "Change Photo" und "Delete Photo".
  function handleAvatarPress() {
    if (!profileImage) { openImagePicker(); return; }
    Alert.alert('Profile Picture', undefined, [
      { text: 'Change Photo', onPress: openImagePicker },
      { text: 'Delete Photo', style: 'destructive', onPress: () => setProfileImage(null) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  // Öffnet das passende Bearbeitungs-Modal je nach gewähltem Feld.
  // Für Kurs → Course-Switch-Modal, für Rolle/Intensität → eigene Picker-Modals,
  // für Name/Username → Text-Input-Modal mit aktuellem Wert vorausgefüllt.
  function openEdit(field: EditField) {
    setEditOpen(false);
    if (field === 'kurs') {
      setShowCourseSwitch(true);
      return;
    }
    if (field === 'role') {
      setShowRolePicker(true);
      return;
    }
    if (field === 'intensity') {
      setShowIntensityPicker(true);
      return;
    }
    const current: Record<EditField, string> = { name, kurs, role, username };
    setInputValue(current[field]);
    setActiveField(field);
  }

  // Speichert das geänderte Profilfeld:
  // Aktualisiert den lokalen State sofort für flüssige UI,
  // und schreibt den neuen Wert zusätzlich in die RxDB-Datenbank
  // damit die Änderung nach App-Neustart erhalten bleibt.
  async function saveEdit() {
    if (!activeField) return;
    if (activeField === 'name') {
      const newName = inputValue.trim() || name;
      setName(newName);
      if (db) {
        // @ts-ignore
        const user = await db.general.user.findOne({ selector: { current: { $eq: true } } }).exec();
        if (user) await user.patch({ name: newName });
      }
    }
    if (activeField === 'email') setEmail(inputValue.trim() || email);
    if (activeField === 'kurs') setKurs(inputValue.trim());
    if (activeField === 'username') {
      setUsername(inputValue.trim() || username);
      if (db) {
        // @ts-ignore
        const user = await db.general.user.findOne({ selector: { current: { $eq: true } } }).exec();
        if (user) await user.patch({ username: inputValue.trim() || username });
      }
    }
    if (activeField === 'role') {
      setRole(inputValue.trim() || role);
      if (db) {
        // @ts-ignore
        const user = await db.general.user.findOne({ selector: { current: { $eq: true } } }).exec();
        if (user) await user.patch({ role: inputValue.trim() || role });
      }
    }
    setActiveField(null);
  }

  const modalTitle: Record<EditField, string> = {
    name: 'Change Name',
    kurs: 'Change Course',
    role: 'Change Role',
    username: 'Change Username',
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={[fonts.josefin, styles.heading, ]}>Account</ThemedText>

      {/* Avatar */}
      <Pressable onPress={handleAvatarPress} style={styles.avatarWrapper}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: isDark ? '#2c2c2e' : '#f0ece8' }]}>
            
            <Svg icon="person-filled" width={32} height={32} white={true} />
          </View>
        )}
        <View style={[styles.editBadge, { backgroundColor: isDark ? '#333' : '#e0e0e0' }]}>
          <Svg icon="pencil" width={16} height={16} white={isDark} />
        </View>
      </Pressable>

      {/* Username / Role / Intensity */}
      <Text style={[fonts.josefin, styles.nameText, { color: textColor }]}>{username || name || 'Username'}</Text>
      <Text style={[fonts.josefin, styles.roleText, { color: subColor }]}>{role.charAt(0).toUpperCase() +
                    role.slice(1) || 'Student'}</Text>
      <Text style={[fonts.josefin, styles.intensityText, { color: subColor }]}>{intensity}</Text>

      {/* Options Dropdown */}
      <View style={styles.dropdownWrapper}>
        <Pressable
          onPress={() => setEditOpen((v) => !v)}
          style={[styles.optionsButton, editOpen && styles.dropdownOpen, { backgroundColor: '#fff', borderColor: '#e0e0e0' }]}
        >
          <Text style={[fonts.josefin, styles.optionsButtonText, { color: '#111' }]}>Options</Text>
          <Svg icon={editOpen ? 'chevron-up' : 'chevron-down'} width={16} height={16} white={false} />
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
          <IconSymbol name="gear" size={18} color="black" />
          <Text style={[fonts.josefin, styles.settingsHeaderText, { color: colors.black.color }]}>Further Settings</Text>
        </View>

        {/* Theme */}
        <View style={[styles.settingsRow, { borderBottomWidth: 1, borderBottomColor: '#e0e0e0' }]}>
          <Text style={[fonts.josefin, styles.settingsLabel, { color: '#111' }]}>Light Theme</Text>
          <Switch
            value={!isDarkMode}
            onValueChange={(v) => setDarkMode(!v)}
            trackColor={{ false: '#ccc', true: '#555' }}
            thumbColor="#fff"
          />
        </View>

        {/* Push Notifications */}
        <View style={[styles.settingsRow, { borderBottomWidth: 1, borderBottomColor: '#e0e0e0' }]}>
          <Text style={[fonts.josefin, styles.settingsLabel, { color: '#111' }]}>Push Notifications</Text>
          <Switch
            value={pushEnabled}
            onValueChange={setPushEnabled}
            trackColor={{ false: '#ccc', true: colors.black.color }}
            thumbColor="#fff"
          />
        </View>

        {/* Switch Course */}
        <Pressable style={styles.settingsRow} onPress={() => setShowCourseSwitch(true)}>
          <Text style={[fonts.josefin, styles.settingsLabel, { color: '#111' }]}>Switch Course</Text>
          <View style={styles.switchPlaceholder}>
            <Svg icon="chevron-right" width={16} height={16} white={false} />
          </View>
        </Pressable>
      </View>

      {/* Intensity Picker Modal */}
      <Modal visible={showIntensityPicker} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowIntensityPicker(false)}>
          <Pressable style={[styles.modalBox, { backgroundColor: cardBg }]}>
            <Text style={[fonts.josefin, styles.courseSwitchTitle, { color: textColor }]}>Change Intensity</Text>
            <View style={{ gap: 10, width: '100%' }}>
              {intensities.map(opt => {
                const active = intensity.toLowerCase() === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    onPress={async () => {
                      setIntensity(opt.label);
                      if (db) {
                        // @ts-ignore
                        const user = await db.general.user.findOne({ selector: { current: { $eq: true } } }).exec();
                        if (user) await user.patch({ intensity: opt.value });
                      }
                      setShowIntensityPicker(false);
                    }}
                    style={[styles.roleOption, { borderColor, backgroundColor: active ? (isDark ? '#fff' : '#000') : 'transparent' }]}
                  >
                    <Text style={[fonts.josefinBold, { color: active ? (isDark ? '#000' : '#fff') : textColor, fontSize: 14 }]}>{opt.label}</Text>
                    <Text style={[fonts.josefin, { color: active ? (isDark ? '#333' : '#ccc') : subColor, fontSize: 12 }]}>{opt.freq}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Role Picker Modal */}
      <Modal visible={showRolePicker} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowRolePicker(false)}>
          <Pressable style={[styles.modalBox, { backgroundColor: cardBg }]}>
            <Text style={[fonts.josefin, styles.courseSwitchTitle, { color: textColor }]}>Change Role</Text>
            <View style={{ gap: 10, width: '100%' }}>
              {roles.map(r => (
                <Pressable
                  key={r.value}
                  onPress={async () => {
                    setRole(r.value);
                    if (db) {
                      // @ts-ignore
                      const user = await db.general.user.findOne({ selector: { current: { $eq: true } } }).exec();
                      if (user) await user.patch({ role: r.value });
                    }
                    setShowRolePicker(false);
                  }}
                  style={[styles.roleOption, { borderColor, backgroundColor: role === r.value ? (isDark ? '#fff' : '#000') : 'transparent' }]}
                >
                  <Text style={[fonts.josefin, { color: role === r.value ? (isDark ? '#000' : '#fff') : textColor, fontSize: 14 }]}>{r.label}</Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Course Switch Modal */}
      <Modal visible={showCourseSwitch} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowCourseSwitch(false)}>
          <Pressable style={[styles.modalBox, { backgroundColor: cardBg }]}>
            <Text style={[fonts.josefin, styles.courseSwitchTitle, { color: textColor }]}>Switch Course</Text>
            <Text style={[fonts.josefin, styles.courseSwitchBody, { color: subColor }]}>
              Your bookmarks are saved and will stay. Only your chapter progress in the current course will be reset.
            </Text>
            <View style={styles.modalButtons}>
              <Pressable onPress={() => setShowCourseSwitch(false)} style={[styles.modalCancel, { borderColor }]}>
                <Text style={[fonts.josefin, { color: subColor }]}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => { setShowCourseSwitch(false); router.push('/start/Kurswahl'); }}
                style={[styles.modalSave, { backgroundColor: isDark ? '#fff' : '#000' }]}
              >
                <Text style={[fonts.josefin, styles.modalSaveText, { color: isDark ? '#000' : '#fff' }]}>Switch</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

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
    borderRadius: 16,
    borderWidth: 1,
    width: '100%',
    justifyContent: 'space-between',
  },
  optionsButtonText: {
    fontSize: 15,
  },
  dropdown: {
    width: '100%',
    borderRadius: 16,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderWidth: 1,
    overflow: 'hidden',
  },
  dropdownOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.black.color,
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
    fontSize: 16,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
  },
  settingsLabel: {
    fontSize: 15,
  },
  switchPlaceholder: {
    width: 51,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  settingsRowIcon: {
    fontSize: 18,
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
  roleOption: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    width: '100%',
  },
  courseSwitchTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  courseSwitchBody: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
