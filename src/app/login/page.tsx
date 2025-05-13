import AuthForm from "@/components/ui/AuthForm"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

function LogInPage() {
  return (
    <div
    className="mt-20 flex flex-1 flex-col items-center">
      <Card className="w-full max-w-md">
        <CardHeader className="mb-4">
          <CardTitle className="text-center text-3xl">Log In</CardTitle>

        </CardHeader>
        <AuthForm type="login" />

      </Card>
    </div>
  )
}

export default LogInPage