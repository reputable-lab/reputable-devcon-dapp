import { Requests } from './Requests'

const RequestsBody = () => {
  // Rendering the component
  return (
    // A div container with various CSS classes for styling
    <div className="relative flex h-full flex-grow flex-col gap-3 overflow-hidden px-2">
      {/* A heading for the section */}
      <h2 className="text-2xl font-bold text-black">Requests</h2>

      {/* A section that will contain the Requests component */}
      <section className="hide-scroll h-full w-full overflow-y-auto">
        {/* The Requests component is rendered here */}
        <Requests />
      </section>
    </div>
  )
}

// Exporting the RequestsBody component as the default export of this module
export default RequestsBody
