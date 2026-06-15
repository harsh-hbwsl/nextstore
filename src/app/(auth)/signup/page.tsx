import type { Metadata } from 'next';
import SignupForm from '@/components/SignupForm';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Sign up for a NextStore account to track orders and save your details.',
};

export default function SignupPage() {
  return <SignupForm />;
}
