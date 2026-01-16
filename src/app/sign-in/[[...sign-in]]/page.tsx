import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-zinc-700 hover:bg-zinc-800 text-white rounded-md py-2",
              socialButtonsBlockButton:
                "border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800",
              formFieldInput:
                "border-gray-300 dark:border-gray-700 rounded-md focus:ring-zinc-500",
            },
          }}
        />
      </div>
    </div>
  );
}