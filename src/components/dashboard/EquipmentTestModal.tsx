import React, { useState, useEffect, useRef } from "react";
import { XMarkIcon, VideoCameraIcon, MicrophoneIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

export default function EquipmentTestModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [testing, setTesting] = useState(false);
  const [micVolume, setMicVolume] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const reqFrameRef = useRef<number>(0);

  useEffect(() => {
    if (isOpen) {
      startTest();
    } else {
      stopTest();
    }
    return () => stopTest();
  }, [isOpen]);

  const startTest = async () => {
    setTesting(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Audio analysis for volume meter
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(mediaStream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        setMicVolume(Math.min(100, Math.round((average / 128) * 100)));
        reqFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();

    } catch (err) {
      console.error(err);
      toast.error("Could not access camera or microphone. Please check permissions.");
    }
  };

  const stopTest = () => {
    setTesting(false);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (reqFrameRef.current) {
      cancelAnimationFrame(reqFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-oboe-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-brutal relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-surface-base text-mid-gray-brown hover:text-oboe-black transition-colors"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="font-heading text-3xl font-bold text-oboe-black mb-2">Equipment Check</h2>
        <p className="font-body text-mid-gray-brown mb-8">Make sure everything is working before your lesson.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-surface-base rounded-2xl aspect-video overflow-hidden border border-border-warm relative flex items-center justify-center">
              {stream ? (
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : (
                <div className="text-center p-6">
                  {testing ? (
                    <ArrowPathIcon className="w-8 h-8 animate-spin text-chip-blue mx-auto mb-2" />
                  ) : (
                    <VideoCameraIcon className="w-8 h-8 text-mid-gray-brown mx-auto mb-2" />
                  )}
                  <p className="font-body text-sm text-mid-gray-brown">{testing ? "Accessing camera..." : "Camera off"}</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3 p-4 rounded-xl border border-border-warm bg-white shadow-sm">
              <div className={`p-2 rounded-full ${stream ? "bg-chip-green text-dark-charcoal" : "bg-surface-base text-mid-gray-brown"}`}>
                <VideoCameraIcon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-heading font-bold text-sm text-oboe-black">Camera</p>
                <p className="font-body text-xs text-mid-gray-brown">{stream ? "Working properly" : "Not connected"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-surface-base rounded-2xl border border-border-warm">
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-full ${stream ? "bg-chip-blue text-dark-charcoal" : "bg-white text-mid-gray-brown"}`}>
                  <MicrophoneIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-heading font-bold text-oboe-black">Microphone</p>
                  <p className="font-body text-xs text-mid-gray-brown">Speak to test volume</p>
                </div>
              </div>
              
              <div className="h-4 bg-white rounded-full border border-border-warm overflow-hidden relative">
                <div 
                  className="h-full bg-gradient-to-r from-chip-green to-chip-blue transition-all duration-75"
                  style={{ width: `${micVolume}%` }}
                />
              </div>
              {stream && micVolume === 0 && (
                <p className="font-body text-xs text-chip-pink mt-2">We can&apos;t hear anything. Check your mic settings.</p>
              )}
            </div>

            <button 
              onClick={stream ? stopTest : startTest}
              className={`w-full py-3 rounded-full font-bold font-body text-center transition-colors ${
                stream 
                  ? "bg-surface-base text-oboe-black hover:bg-border-warm" 
                  : "bg-oboe-black text-white hover:bg-dark-charcoal"
              }`}
            >
              {stream ? "Stop Test" : "Start Test"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
