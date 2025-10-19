import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { prisma } from '@/lib/prisma'
import { Label } from '@radix-ui/react-label'
import { redirect } from 'next/navigation'

export default function page() {
  async function handleLogin(formData: FormData) {
    'use server'
    const email = formData.get('email')
    const password = formData.get('password')

    const user = await prisma.user.findFirst({
      where: { email: String(email) },
    })
    if (user && user.password === password) {
      redirect('/tasks')
    }
  }

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
            defaultValue='admin'
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
            defaultValue='admin'
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
