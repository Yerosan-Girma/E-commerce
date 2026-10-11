const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute w-150 h-150 bg-primary/10 rounded-full blur-[120px] -top-40 -left-40 animate-float" />
    <div className="absolute w-125 h-125 bg-secondary/10 rounded-full blur-[120px] -bottom-40 -right-40 animate-float-delayed" />
    <div className="absolute w-75 h-75 bg-accent/10 rounded-full blur-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float-slow" />
  </div>
)

export default AnimatedBackground
