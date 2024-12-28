import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';

export function Collapsible({
  children,
  title,
}: PropsWithChildren & { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.7}
      >
        <IconSymbol
          name={
            isOpen ? 'chevron.down.circle.fill' : 'chevron.right.circle.fill'
          }
          size={20}
          weight="light"
          color={Colors.secondary}
        />
        <Text>{title}</Text>
      </TouchableOpacity>
      {isOpen && <div style={styles.content}>{children}</div>}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});
