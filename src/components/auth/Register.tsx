'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import GoogleAuth from './actions/Google';
import { useState, useTransition } from 'react';
import { RegisterAction } from './actions/register';
import { useRouter } from 'next/navigation';

const Register = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    startTransition(() => {
      RegisterAction(formData).then((data) => {
        if (data.error) {
          setError(data.error);
        }
        if (data.success) {
          setSuccess(data.success);

          setTimeout(() => {
            router.push('/login');
          }, 2000);
        }
      });
    });
  };

  return (
    <Card className="w-full font-sans max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Get started with Kelvin</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                disabled={isPending}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                disabled={isPending}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                disabled={isPending}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                required
                disabled={isPending}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mt-4">
            {error && (
              <p className="text-sm text-red-500 font-medium">{error}</p>
            )}
            {success && (
              <p className="text-sm text-green-500 font-medium">{success}</p>
            )}
          </div>

          <div className="mt-6">
            <Button
              variant="default"
              type="submit"
              className="w-full py-3 text-xs"
              disabled={isPending}
            >
              {isPending ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <GoogleAuth />

        <div className="flex items-center justify-center gap-2 py-2 w-full">
          <div className="flex-1 justify-center items-center border w-full" />
        </div>
        <Link href="/login" className="w-full">
          <Button
            variant="outline"
            type="button"
            className="w-full py-3 text-xs"
          >
            Already have an account ? Login
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default Register;
