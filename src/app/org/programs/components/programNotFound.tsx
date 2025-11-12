
export default function ProgramNotFound() {
    return (
      <section className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center space-y-6">
        {/* <Image
          src="/images/not-found.png"
          alt="Program not found"
          width={300}
          height={300}
          className="object-contain"
        /> */}
        <h2 className="text-2xl font-bold text-gray-800">Program Not Found</h2>
        <p className="text-gray-600 text-sm max-w-md">
          {` The program you're looking for doesn't exist or may have been removed.
          Please check the URL or return to the dashboard.`}
        </p>
      </section>
    );
}