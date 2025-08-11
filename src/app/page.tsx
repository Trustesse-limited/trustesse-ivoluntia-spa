import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { InputComponent } from "@/components/input"; 
export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Button>Default</Button>
        <Button variant={"disabled"}>Disabled</Button>
        <Button variant={"clicked"}>Clicked</Button>
        <Button variant={"link"}>Link</Button>
        <div className="bg-gray-500 w-full p-4">
          <Button variant={"outline"}>Outline</Button>
        </div>
        <Button variant={"secondary"}>Secondary</Button>
        <InputComponent
          type="password"
          label="Password"
          placeholder="Enter password"
          name="password"
          htmlFor="password"
        />
        <InputComponent
          type="email"
          label="Email"
          name="email"
          htmlFor="email"
          placeholder="Enter your email address"
        />
        <InputComponent
          type="name"
          label="Enter name"
          name="name"
          htmlFor="name"
          placeholder="Enter your email address"
        />
      </main>

      <div className="flex gap-8">
        <Switch></Switch>
        <Checkbox color="#000000" />
      </div>
    </div>
  );
}
