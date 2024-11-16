const ChatBackground = () => {
  return (
    <div className="flex flex-1 flex-grow flex-col justify-between rounded-l-xl border border-gray-300 bg-white">
      <div className="font-uni flex h-full w-full flex-col items-center justify-between py-6">
        {/* A section that contains the logo and the text */}
        <section className="flex h-full flex-col items-center justify-center">
          {/* The logo image */}
          <img src="/logo.svg" alt="logo" width="100" height="100" />

          {/* The text that appears below the logo */}
          <p className="text-primary-white/60 mt-5 max-w-xs text-center">
            Send and receive messages anytime to your contacts
          </p>
        </section>

        {/* A paragraph that contains the lock icon and the text "End to end encrypted */}
        <p className="flex items-center gap-1 text-sm">
          {/* The lock icon replaced with a simple lock emoji */}
          <span role="img" aria-label="lock" className="h-4 w-4">
            🔒
          </span>
          End to end encrypted
        </p>
      </div>
    </div>
  )
}

export default ChatBackground
