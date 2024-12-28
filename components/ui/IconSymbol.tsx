// This file is a fallback for using AntDesign on Android and web.

import AntDesign from '@expo/vector-icons/AntDesign';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue } from 'react-native';

// Add your SFSymbol to AntDesign mappings here.
const MAPPING = {
  // See AntDesign here: https://icons.expo.fyi
  // See SF Symbols in the SF Symbols app on Mac.
  'chevron.right.circle.fill': 'rightcircle',
  'chevron.down.circle.fill': 'downcircle',
  'speaker.wave.2': 'sound',
  magnifyingglass: 'search1',
} as Partial<
  Record<
    import('expo-symbols').SymbolViewProps['name'],
    React.ComponentProps<typeof AntDesign>['name']
  >
>;

export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SFSymbols on iOS, and AntDesign on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to AntDesign.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  weight?: SymbolWeight;
}) {
  return <AntDesign color={color} size={size} name={MAPPING[name]} />;
}
