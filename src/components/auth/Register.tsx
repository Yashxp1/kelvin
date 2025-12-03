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

const Register = () => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Get started with Kelvin</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" type="text" placeholder="John Doe" required />
            </div>
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
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button variant="default" type="submit" className="w-full py-3 text-xs">
          Create Account
        </Button>

        <Button className="w-full py-3 text-xs">
          <FaGoogle /> Get started with Google
        </Button>

        <div className="flex items-center justify-center gap-2 py-2 w-full">
          <div className="flex-1 justify-center items-center border w-full" />
        </div>
        <Link href="/login" className="w-full">
          <Button
            variant="outline"
            type="submit"
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
