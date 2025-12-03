import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { FaGoogle } from 'react-icons/fa';

const Login = () => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Welcome back to Kelvin</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button variant="default" type="submit" className="w-full py-3 text-xs">
          Login
        </Button>

        <Button className="w-full py-3 text-xs">
          <FaGoogle /> Login with Google
        </Button>

        <div className="flex items-center justify-center gap-2 py-2 w-full">
          <div className="flex-1 justify-center items-center border w-full" />
        </div>
        <Link href="/register" className="w-full">
          <Button
            variant="outline"
            type="submit"
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
