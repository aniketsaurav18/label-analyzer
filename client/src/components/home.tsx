export default function Hero() {
  return (
    <div className="text-center space-y-4 mb-12">
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
        Food Label Analyzer
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Upload an image of a food label or ingredient list, and we'll analyze it
        for you.
      </p>
    </div>
  );
}
