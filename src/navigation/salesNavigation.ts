import { CommonActions, type NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from './AppNavigator';

export function resetToSalesScreen(
  navigation: NavigationProp<RootStackParamList>
) {
  navigation.dispatch(
    CommonActions.reset({
      index: 1,
      routes: [{ name: 'Home' }, { name: 'Sales' }],
    })
  );
}
