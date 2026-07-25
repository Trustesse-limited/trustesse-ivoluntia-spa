
export const metadata = {
  title: "Ivoluntia | Reset Password",
  description:
    "Ivoluntia reset password page",
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
