import type { Metadata } from 'next';
import LoginForm from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Log into your NextStore account to access dashboard and checkout.',
};

export default function LoginPage() {
  return <LoginForm />;
}
