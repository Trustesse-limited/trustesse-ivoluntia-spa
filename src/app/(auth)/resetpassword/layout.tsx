
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
    <div className='max-w-[1538px] font-openSans min-h-screen flex flex-col justify-start items-center relative  px-2  w-[100%]'>
      {/* you can add nav/header here if needed */}
      {children}
    </div>
  );
}