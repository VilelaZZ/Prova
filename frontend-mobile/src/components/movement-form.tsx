import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ActionButton } from '@/components/action-button';
import { ThemedText } from '@/components/themed-text';
import { MOVEMENT_LABEL, MOVEMENT_ORDER, type MovementType } from '@/constants/stock';
import { Spacing } from '@/constants/theme';
import type { MovementResult } from '@/hooks/use-product';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  /** Envia a movimentação para a API e devolve o resultado (sucesso ou motivo da rejeição). */
  onSubmit: (tipo: MovementType, quantidade: number) => Promise<MovementResult>;
  loading: boolean;
};

/** Formulário de entrada/saída: escolhe o tipo, informa a quantidade e confirma. */
export function MovementForm({ onSubmit, loading }: Props) {
  const theme = useTheme();
  const [tipo, setTipo] = useState<MovementType>('SAIDA');
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState<MovementResult | null>(null);

  const quantidade = Number(text);
  const valid = text !== '' && Number.isInteger(quantidade) && quantidade > 0;

  const step = (delta: number) => {
    setFeedback(null);
    setText(String(Math.max(1, (valid ? quantidade : 0) + delta)));
  };

  const submit = async () => {
    if (!valid) {
      setFeedback({ ok: false, message: 'Informe uma quantidade inteira maior que zero.' });
      return;
    }
    setFeedback(null);
    const result = await onSubmit(tipo, quantidade);
    setFeedback(result);
    if (result.ok) setText('');
  };

  const accent = tipo === 'ENTRADA' ? '#1B8F55' : theme.primary;

  return (
    <View style={styles.wrapper}>
      {/* Entrada / Saída */}
      <View style={[styles.segment, { backgroundColor: theme.backgroundElement }]} accessibilityRole="radiogroup">
        {MOVEMENT_ORDER.map((m) => {
          const selected = m === tipo;
          return (
            <Pressable
              key={m}
              accessibilityRole="radio"
              accessibilityState={{ selected, disabled: loading }}
              disabled={loading}
              onPress={() => {
                setTipo(m);
                setFeedback(null);
              }}
              style={[styles.segmentOption, selected && { backgroundColor: theme.background }]}>
              <ThemedText type="smallBold" themeColor={selected ? 'text' : 'textSecondary'}>
                {MOVEMENT_LABEL[m]}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      {/* Quantidade: − [campo] + */}
      <View style={styles.qtyRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Diminuir quantidade"
          disabled={loading}
          onPress={() => step(-1)}
          style={[styles.stepper, { backgroundColor: theme.backgroundElement }]}>
          <ThemedText style={styles.stepperText}>−</ThemedText>
        </Pressable>
        <TextInput
          accessibilityLabel="Quantidade"
          value={text}
          onChangeText={(v) => {
            setText(v.replace(/\D/g, '').slice(0, 9));
            setFeedback(null);
          }}
          editable={!loading}
          keyboardType="number-pad"
          inputMode="numeric"
          placeholder="Quantidade"
          placeholderTextColor={theme.textSecondary}
          returnKeyType="done"
          onSubmitEditing={submit}
          style={[
            styles.input,
            { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: feedback && !feedback.ok ? theme.danger : theme.border },
          ]}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Aumentar quantidade"
          disabled={loading}
          onPress={() => step(1)}
          style={[styles.stepper, { backgroundColor: theme.backgroundElement }]}>
          <ThemedText style={styles.stepperText}>+</ThemedText>
        </Pressable>
      </View>

      {feedback ? (
        <View
          accessibilityLiveRegion="polite"
          style={[
            styles.feedback,
            { backgroundColor: feedback.ok ? '#DDF4E7' : '#FDE7E4' },
          ]}>
          <ThemedText type="small" style={{ color: feedback.ok ? '#1B6E45' : '#B42318', fontWeight: '600' }}>
            {feedback.message}
          </ThemedText>
        </View>
      ) : null}

      <View style={[styles.confirm, { opacity: valid || loading ? 1 : 0.6 }]}>
        <ActionButton
          label={`Registrar ${MOVEMENT_LABEL[tipo].toLowerCase()}`}
          onPress={submit}
          loading={loading}
          color={accent}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: Spacing.three },
  segment: { flexDirection: 'row', padding: Spacing.one, borderRadius: Spacing.three },
  segmentOption: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacing.three - 4,
  },
  qtyRow: { flexDirection: 'row', gap: Spacing.two, alignItems: 'stretch' },
  stepper: { width: 52, minHeight: 52, borderRadius: Spacing.two, alignItems: 'center', justifyContent: 'center' },
  stepperText: { fontSize: 24, lineHeight: 28, fontWeight: '600' },
  input: {
    flex: 1,
    minHeight: 52,
    borderRadius: Spacing.two,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  feedback: { padding: Spacing.three, borderRadius: Spacing.two },
  confirm: { alignSelf: 'stretch' },
});
