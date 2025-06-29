import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { useNavigate } from "react-router-dom";

const QRCodeScanner = ({ onScan }) => {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!videoRef.current) return;

    // Initialize QR Scanner
    const scanner = new QrScanner(
      videoRef.current,
      (result) => handleScanResult(result),
      {
        preferredCamera: "environment", // Use back camera
        highlightScanRegion: true,
      }
    );

    scannerRef.current = scanner;
    scanner.start().catch((err) => setError(err));

    return () => {
      scanner.stop();
    };
  }, []);

  const handleScanResult = (result) => {
    if (result) {
      console.log("Scanned Data:", result.data);
      const scannedURL = result.data;

      if (scannedURL) {
        console.log("Navigating to:", scannedURL);
        window.location.href = scannedURL; // Navigate to the scanned URL
      } else {
        console.error("Invalid URL detected", scannedURL);
      }
    }
  };

  return (
    <div>
      <video ref={videoRef} style={{ width: "100%" }} />
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default QRCodeScanner;