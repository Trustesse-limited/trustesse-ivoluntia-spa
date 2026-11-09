

export const metadata = {
  title: "Ivoluntia | Forgot Password",
  description:
    "Ivoluntia password page",
};


export default function loginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='w-full'>
      {children}
    </div>
  );
}
