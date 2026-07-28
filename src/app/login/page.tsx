import Image from "next/image"
import { AuthForm } from "./AuthForm"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="container mx-auto flex min-h-screen max-w-sm flex-col justify-center p-6">
      <div className="text-center mb-8">
        <Image
          src="/FirstByteBitex4.png"
          alt="FirstByte"
          width={120}
          height={120}
          className="mx-auto mb-4"
        />
        <h1 className="text-3xl font-bold">FirstByte Dashboard</h1>
        <p className="text-muted-foreground">Sign in to continue</p>
      </div>
      <AuthForm error={error} />
    </div>
  )
}