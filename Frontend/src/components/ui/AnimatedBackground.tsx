const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -top-40 -left-40 animate-float" />
    <div className="absolute w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] -bottom-40 -right-40 animate-float-delayed" />
    <div className="absolute w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float-slow" />
  </div>
)

export default AnimatedBackground