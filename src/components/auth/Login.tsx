'use client'; // Must be client to use hooks

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
import { LoginAction } from './actions/login';
const Login = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    startTransition(() => {
      LoginAction(formData).then((data) => {
        if (data?.error) {
          setError(data.error);
        }
      });
    });
  };

  return (
    <Card className="w-full max-w-sm font-sans">
      <CardHeader>
        <CardTitle className="text-xl">Welcome back to Kelvin</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-6">
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
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
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

            {error && (
              <div className="text-sm text-red-500 font-medium">{error}</div>
            )}
          </div>

          <div className="mt-6">
            <Button
              variant="default"
              type="submit"
              className="w-full py-3 text-xs"
              disabled={isPending}
            >
              {isPending ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <GoogleAuth />
        <div className="flex items-center justify-center gap-2 py-2 w-full">
          <div className="flex-1 justify-center items-center border w-full" />
        </div>
        <Link href="/register" className="w-full">
          <Button
            variant="outline"
            type="button"
            className="w-full py-3 text-xs"
          >
            Don't have an account ? Sign Up
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default Login;
