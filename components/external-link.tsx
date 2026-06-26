<<<<<<< HEAD
import { Href, Link } from 'expo-router';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { type ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href & string };

export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={async (event) => {
        if (process.env.EXPO_OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          await openBrowserAsync(href, {
            presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
          });
        }
      }}
    />
=======
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
>>>>>>> 8f32440 (Initial app update)
  );
}
