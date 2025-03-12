
export default function PublicLayout({ children }: { children: React.ReactNode }) {

  return (
    <div
      className="bg-secondary h-full p-8 flex items-center justify-center"
    >
      <div className="border bg-background rounded-lg h-fit w-fit shadow-lg shadow-border flex">
        <div className="p-6 px-12 shadow-lg bg-primary shadow-primary/50 rounded-lg min-w-[400px] relative overflow-hidden">
          <img src="/logo-celagem-light.svg" className="h-full w-full relative z-10" />
          <div className="absolute w-20 top-0 bg-background/50 transform rotate-45 h-[200px] blur-3xl" />
          <div className="absolute w-20 bg-background transform rotate-45 h-[50px] right-0 top-0 blur-2xl" />
        </div>
        {children}
      </div>
    </div>
  )
}