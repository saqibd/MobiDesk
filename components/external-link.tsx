import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import type { ComponentProps, ReactNode } from 'react';
import { Linking, Platform, Text, TouchableOpacity } from 'react-native';

type Props = Omit<ComponentProps<typeof TouchableOpacity>, 'onPress'> & {
  href: string;
  children: ReactNode;
};

export function ExternalLink({ href, children, ...rest }: Props) {
  const handlePress = async () => {
    if (Platform.OS !== 'web') {
      await openBrowserAsync(href, {
        presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
      });
    } else {
      await Linking.openURL(href);
    }
  };

  return (
    <TouchableOpacity {...rest} onPress={handlePress}>
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </TouchableOpacity>
  );
}
