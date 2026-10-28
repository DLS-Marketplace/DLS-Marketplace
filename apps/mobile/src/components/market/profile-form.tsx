import { useUser } from '@clerk/expo';
import { NAME_MAX_LENGTH } from '@loop/shared';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';

import { Pressable } from '@/components/ui/pressable';
import { useTheme } from '@/hooks/use-theme';
import { haptics } from '@/lib/haptics';
import { errorMessage, useCurrentUser, useUpdateProfile, type Photo } from '@/lib/queries';

import { Avatar } from './avatar';
import { Button } from './button';
import { Icon } from './icon';

/** Photo + name editor used for first-time setup and Edit profile. */
export function ProfileForm({ submitLabel, onSaved }: { submitLabel: string; onSaved?: () => void }) {
  const theme = useTheme();
  const user = useCurrentUser();
  const email = useUser().user?.primaryEmailAddress?.emailAddress;
  const updateProfile = useUpdateProfile();
  const [name, setName] = useState(user?.name ?? '');
  const [photo, setPhoto] = useState<Photo | null>(null);

  const trimmed = name.trim();
  const changed = !!photo || trimmed !== user?.name;
  const canSave = trimmed.length >= 2 && changed;

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const { uri, width, height } = result.assets[0];
      setPhoto({ uri, width, height });
    }
  };

  const save = () =>
    updateProfile
      .run({ name: trimmed !== user?.name ? trimmed : undefined, photo: photo ?? undefined })
      .then(
        () => {
          haptics.success();
          onSaved?.();
        },
        (e) => {
          haptics.error();
          Alert.alert('Couldn’t save', errorMessage(e));
        }
      );

  return (
    <View style={styles.form}>
      <Pressable onPress={pickPhoto} style={styles.avatarButton} accessibilityLabel="Change photo">
        <Avatar name={trimmed} image={photo?.uri ?? user?.image ?? null} size={112} />
        <View style={[styles.camera, { backgroundColor: theme.tint, borderColor: theme.background }]}>
          <Icon name="camera.fill" size={14} color={theme.onTint} />
        </View>
      </Pressable>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Your name"
        placeholderTextColor={theme.textSecondary}
        autoComplete="name"
        textContentType="name"
        autoCapitalize="words"
        maxLength={NAME_MAX_LENGTH}
        returnKeyType="done"
        onSubmitEditing={() => canSave && save()}
        style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
      />

      <Button
        title={submitLabel}
        disabled={!canSave}
        loading={updateProfile.isPending}
        onPress={save}
        style={styles.submit}
      />
      {!!email && <Text style={[styles.email, { color: theme.textSecondary }]}>{email}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 14,
    width: '100%',
  },
  avatarButton: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  camera: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 52,
    borderRadius: 14,
    borderCurve: 'continuous',
    paddingHorizontal: 16,
    fontSize: 17,
    // iOS can reuse the sign-in code field's native view; reset its wide spacing.
    letterSpacing: 0,
  },
  submit: {
    marginTop: 4,
  },
  email: {
    textAlign: 'center',
    fontSize: 14,
  },
});
