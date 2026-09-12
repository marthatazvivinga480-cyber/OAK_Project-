import RegistrationForm from "@/components/RegistrationForm/Registration";
import Sidebar from "@/components/Sidebar";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen bg-[#F7F8FA] max-md:flex-col">
      <Sidebar />
      <main className="min-w-0 flex-1 px-6 py-12 max-md:px-4">
        <div className="mx-auto w-full max-w-[672px]">
          <h1 className="text-2xl font-semibold text-center mb-8">
            Event registration
          </h1>
          <RegistrationForm />
        </div>
      </main>
    </div>
  );
}
