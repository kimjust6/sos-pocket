/**
 * v0 by Vercel.
 * @see https://v0.dev/t/aQ04oepEp90
 */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Component() {
  return (
    <section className="">
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex items-center">
            <h1 className="font-semibold text-lg md:text-2xl">Settings</h1>
          </div>
          <div className="border shadow-sm rounded-lg">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="sm">
                  Edit
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Payment Options</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="sm">
                  Edit
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Address Book</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="sm">
                  Edit
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Login & Security</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="sm">
                  Edit
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Communication Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="sm">
                  Edit
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </section>
  );
}
