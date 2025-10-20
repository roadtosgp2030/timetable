import { handleLogin } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'

export default function page() {
  return (
    <div className='grid h-full justify-center items-center'>
      <form action={handleLogin}>
        <h3 className='text-3xl uppercase font-semibold text-center'>Login</h3>
        <div className='grid w-sm items-center gap-3'>
          <Label htmlFor='email'>Email</Label>
          <Input
            type='text'
            id='email'
            placeholder='Email'
            defaultValue={process.env.USER_EMAIL}
            name='email'
            autoFocus
          />
        </div>
        <div className='grid w-sm items-center gap-3'>
          <Label htmlFor='password'>Password</Label>
          <Input
            type='password'
            id='password'
            placeholder='Password'
            defaultValue={process.env.USER_PASS}
            name='password'
          />
        </div>
        <div className='mt-2 text-right'>
          <Button>Login</Button>
        </div>
      </form>
    </div>
  )
}
