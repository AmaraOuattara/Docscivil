import { enableScreens } from 'react-native-screens';
import RootNavigator from './src/navigation/index';

enableScreens();

export default function App() {
  return <RootNavigator />;
}
