import Navigations from '@/components/Navigations'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Navigations />
      <main className='flex-1'>{children}</main>
    </>
  )
}
