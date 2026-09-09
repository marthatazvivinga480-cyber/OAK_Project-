import RegistrationForm from "@/components/RegistrationForm/Registration";

export default function RegisterPage() {
  return (
    <main className="min-h-screen px-6 py-12">
      <h1 className="text-2xl font-semibold text-center mb-8">
        Event registration
      </h1>
      <RegistrationForm />
    </main>
  );
}