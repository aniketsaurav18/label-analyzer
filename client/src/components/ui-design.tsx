import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Food Label Analyzer</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload an image of a food label or ingredient list, and we'll analyze it for you.
          </p>
        </section>

        {/* File Upload Section */}
        <section className="max-w-xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="mb-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <h2 className="mt-4 text-xl font-semibold text-gray-700">Upload your food label image</h2>
              <p className="mt-1 text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
            <div className="mt-6">
              <label htmlFor="file-upload" className="block">
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                  </div>
                </div>
              </label>
            </div>
            <div className="mt-6">
              <Button className="w-full">Analyze Label</Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}