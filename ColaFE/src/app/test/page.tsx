import ThreeViewer from "@/components/ThreeViewer"

export default function Page() {
  return (
    <div className="grid grid-cols-3 gap-6 p-10 h-screen">
      <div className="h-64 bg-neutral-900 rounded-xl">
        <ThreeViewer modelUrl='https://res.cloudinary.com/dlwenphlw/image/upload/v1766163232/zeroCoke_gbfbnd.glb' />
      </div>

      <div className="h-64 bg-neutral-900 rounded-xl">
        <ThreeViewer modelUrl="https://res.cloudinary.com/dlwenphlw/image/upload/v1766163232/zeroCoke_gbfbnd.glb" />
      </div>

      <div className="h-64 bg-neutral-900 rounded-xl">
        <ThreeViewer modelUrl="https://res.cloudinary.com/dlwenphlw/image/upload/v1766163232/zeroCoke_gbfbnd.glb" />
      </div>
    </div>
  )
}
