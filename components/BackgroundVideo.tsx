const BackgroundVideo = () => {
    return (
      <div className="fixed inset-0 w-full h-full overflow-hidden z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover"
          poster="https://ampd-asset.s3.us-east-2.amazonaws.com/ampd-poster.png"
        >
          <source src="https://ampd-asset.s3.us-east-2.amazonaws.com/ampd.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-neutral-950 opacity-50"></div>
      </div>
    )
  }
  
  export default BackgroundVideo
  
  