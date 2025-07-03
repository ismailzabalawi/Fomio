import { Redirect } from 'expo-router';
import { CreateIcon } from '@/components/icons';

export default function CreateScreen() {
  return <Redirect href="/(modal)/create" />;
}

// Usage:
<CreateIcon size={24} />