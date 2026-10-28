import { isClerkAPIResponseError, useSignIn, useSignUp } from '@clerk/expo';
import { useRef, useState, type ComponentRef } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/market/button';
import { Icon } from '@/components/market/icon';
import { Pressable } from '@/components/ui/pressable';
import { useTheme } from '@/hooks/use-theme';

const CODE_LENGTH = 6;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function messageOf(error: unknown, fallback: string) {
  if (isClerkAPIResponseError(error)) {
    const first = error.errors[0];
    return first?.longMessage ?? first?.message ?? fallback;
  }
  return fallback;
}

export default function SignInScreen() {
  const theme = useTheme();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const codeInput = useRef<ComponentRef<typeof TextInput>>(null);

  const trimmedEmail = email.trim().toLowerCase();

  // New emails get a sign-up instead of a sign-in; both verify with an emailed code.
  const sendCode = async () => {
    setLoading(true);
    setError(null);
    let nextMode: 'signIn' | 'signUp' = 'signIn';
    let { error } = await signIn.emailCode.sendCode({ emailAddress: trimmedEmail });
    if (isClerkAPIResponseError(error) && error.errors[0]?.code === 'form_identifier_not_found') {
      nextMode = 'signUp';
      ({ error } = await signUp.create({ emailAddress: trimmedEmail }));
      if (!error) ({ error } = await signUp.verifications.sendEmailCode());
    }
    setLoading(false);
    if (error) return setError(messageOf(error, 'Couldn’t send code'));
    setMode(nextMode);
    setStep('code');
  };

  const verify = async (otp: string) => {
    setLoading(true);
    setError(null);
    const flow = mode === 'signIn' ? signIn : signUp;
    const { error } =
      mode === 'signIn'
        ? await signIn.emailCode.verifyCode({ code: otp })
        : await signUp.verifications.verifyEmailCode({ code: otp });
    // Once the session is active the root layout moves on.
    if (!error && flow.status === 'complete') {
      const { error: finalizeError } = await flow.finalize();
      if (!finalizeError) return;
    }
    setLoading(false);
    setError(error ? messageOf(error, 'Wrong code') : 'Couldn’t sign in');
    setCode('');
    codeInput.current?.focus();
  };

  const onCodeChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, CODE_LENGTH);
    setCode(digits);
    if (digits.length === CODE_LENGTH) verify(digits);
  };

  const inputStyle = [styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.brand}>
          <View style={[styles.logo, { backgroundColor: theme.tint }]}>
            <Icon name={step === 'email' ? 'bag.fill' : 'envelope.fill'} size={30} color={theme.onTint} />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>
            {step === 'email' ? 'Loop' : 'Check your email'}
          </Text>
          {step === 'code' && (
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{trimmedEmail}</Text>
          )}
        </View>

        <View style={styles.form}>
          {step === 'email' ? (
            <>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor={theme.textSecondary}
                autoCapitalize="none"
                autoComplete="email"
                autoFocus
                keyboardType="email-address"
                textContentType="emailAddress"
                returnKeyType="go"
                onSubmitEditing={() => EMAIL_PATTERN.test(trimmedEmail) && sendCode()}
                style={inputStyle}
              />
              {error && <Text style={[styles.error, { color: theme.warning }]}>{error}</Text>}
              <Button
                title="Continue"
                disabled={!EMAIL_PATTERN.test(trimmedEmail)}
                loading={loading}
                onPress={sendCode}
              />
            </>
          ) : (
            <>
              <TextInput
                ref={codeInput}
                value={code}
                onChangeText={onCodeChange}
                placeholder="000000"
                placeholderTextColor={theme.backgroundSelected}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                autoComplete="one-time-code"
                autoFocus
                maxLength={CODE_LENGTH}
                editable={!loading}
                style={[inputStyle, styles.codeInput]}
              />
              {error && <Text style={[styles.error, { color: theme.warning }]}>{error}</Text>}
              <Button
                title="Sign in"
                disabled={code.length !== CODE_LENGTH}
                loading={loading}
                onPress={() => verify(code)}
              />
              <View style={styles.links}>
                <Pressable
                  hitSlop={12}
                  onPress={() => {
                    setStep('email');
                    setCode('');
                    setError(null);
                    setResent(false);
                  }}>
                  <Text style={[styles.link, { color: theme.tintText }]}>Change email</Text>
                </Pressable>
                <Pressable
                  hitSlop={12}
                  disabled={resent}
                  onPress={async () => {
                    await sendCode();
                    setResent(true);
                  }}>
                  <Text style={[styles.link, { color: resent ? theme.textSecondary : theme.tintText }]}>
                    {resent ? 'Sent' : 'Resend code'}
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
        {/* Clerk's bot protection renders here when it's enabled. */}
        <View nativeID="clerk-captcha" />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 32,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  brand: {
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  form: {
    gap: 12,
  },
  input: {
    height: 52,
    borderRadius: 14,
    borderCurve: 'continuous',
    paddingHorizontal: 16,
    fontSize: 17,
    letterSpacing: 0,
  },
  codeInput: {
    height: 64,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 12,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  error: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: 4,
  },
  link: {
    fontSize: 15,
    fontWeight: '600',
  },
});
