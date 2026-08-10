"use client";

import React, { useState, useEffect, useRef } from "react";
import HugeIcon from "@/components/ui/HugeIcon";

interface EquipmentTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EquipmentTestModal({ isOpen, onClose }: EquipmentTestModalProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permissionError, setPermissionError] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>("");
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>("");
  const [micVolume, setMicVolume] = useState<number>(0);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [testing, setTesting] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      startTest();
    } else {
      stopTest();
    }
    return () => {
      stopTest();
    };
  }, [isOpen]);

  // Ensure stream is assigned to video element whenever stream changes or videoRef mounts
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(e => console.warn("Autoplay was prevented:", e));
    }
  }, [stream]);

  const startTest = async (videoId?: string, audioId?: string) => {
    setTesting(true);
    setPermissionError(false);
    stopTest();

    try {
      const constraints: MediaStreamConstraints = {
        video: videoId ? { deviceId: { exact: videoId }, width: { ideal: 1280 }, height: { ideal: 720 } } : { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: audioId ? { deviceId: { exact: audioId } } : true
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      const allDevices = await navigator.mediaDevices.enumerateDevices();
      setDevices(allDevices);

      const activeVideoTrack = mediaStream.getVideoTracks()[0];
      const activeAudioTrack = mediaStream.getAudioTracks()[0];
      if (activeVideoTrack && !videoId) setSelectedVideoDevice(activeVideoTrack.getSettings().deviceId || "");
      if (activeAudioTrack && !audioId) setSelectedAudioDevice(activeAudioTrack.getSettings().deviceId || "");

      setupAudioAnalyzer(mediaStream);
    } catch (err) {
      console.error("Error accessing media devices:", err);
      setPermissionError(true);
    } finally {
      setTesting(false);
    }
  };

  const setupAudioAnalyzer = (mediaStream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;

      const source = audioCtx.createMediaStreamSource(mediaStream);
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((average / 128) * 100));
        setMicVolume(normalized);
        animFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();
    } catch (e) {
      console.error("Audio analyzer failed to initialize", e);
    }
  };

  const stopTest = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setMicVolume(0);
  };

  const playTestSound = () => {
    setIsPlayingSound(true);
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.5);

      setTimeout(() => {
        setIsPlayingSound(false);
        ctx.close();
      }, 1500);
    } catch (e) {
      setIsPlayingSound(false);
    }
  };

  if (!isOpen) return null;

  const videoDevices = devices.filter(d => d.kind === 'videoinput');
  const audioDevices = devices.filter(d => d.kind === 'audioinput');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] p-6 sm:p-8 max-w-3xl w-full border border-border-light relative max-h-[90vh] overflow-y-auto shadow-xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border-light">
          <div>
            <span className="px-3 py-1 bg-accent-blue/10 text-accent-blue rounded-full text-[10px] font-bold uppercase tracking-wider border border-accent-blue/20 mb-2 inline-block">
              Pre-Lesson Diagnostics
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              Equipment Check
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 rounded-full hover:bg-surface-muted text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Close modal"
          >
            <HugeIcon name="cancel" size={20} />
          </button>
        </div>

        {permissionError ? (
          <div className="bg-surface-muted border border-border-light rounded-2xl p-8 text-center max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto">
              <HugeIcon name="alert" size={24} />
            </div>
            <h3 className="font-heading text-xl font-bold text-text-primary">Camera or Mic Blocked</h3>
            <p className="font-body text-xs text-text-secondary leading-relaxed">
              Your browser has blocked access to your camera or microphone. Please allow camera and audio permissions in your address bar, then click try again.
            </p>
            <button 
              onClick={() => startTest()}
              className="px-6 py-3 bg-text-primary text-white rounded-full font-body text-xs font-semibold hover:bg-black transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Camera Feed Section */}
            <div className="space-y-3">
              <div className="bg-neutral-900 rounded-2xl aspect-video overflow-hidden border border-neutral-800 relative flex items-center justify-center shadow-inner">
                {stream ? (
                  <video 
                    ref={videoRef}
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                ) : (
                  <div className="text-center p-6 text-neutral-400 space-y-2">
                    {testing ? (
                      <div className="w-6 h-6 border-2 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto" />
                    ) : (
                      <HugeIcon name="video" size={32} className="mx-auto text-neutral-500" />
                    )}
                    <p className="font-body text-xs">{testing ? "Starting camera..." : "Camera inactive"}</p>
                  </div>
                )}
                
                {stream && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-emerald-500/90 backdrop-blur-xs text-white rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-xs">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                    <span>Live HD Video</span>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block font-body text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                  Select Camera
                </label>
                <select 
                  className="w-full bg-surface-near-white border border-border-light rounded-xl px-3 py-2.5 text-xs font-body text-text-primary focus:border-accent-blue transition-colors"
                  value={selectedVideoDevice}
                  onChange={(e) => {
                    setSelectedVideoDevice(e.target.value);
                    startTest(e.target.value, selectedAudioDevice);
                  }}
                  disabled={!stream}
                >
                  {videoDevices.length === 0 && <option value="">Default Camera</option>}
                  {videoDevices.map((device, idx) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Camera ${idx + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Audio & Output Test Section */}
            <div className="space-y-4 flex flex-col justify-between">
              
              {/* Microphone Level */}
              <div className="p-5 bg-surface-near-white rounded-2xl border border-border-light space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-xs text-text-primary flex items-center gap-2">
                    <HugeIcon name="sparkles" size={16} className="text-accent-blue" />
                    Microphone Input
                  </span>
                  <span className="text-[10px] font-bold text-text-secondary uppercase">
                    Level: {micVolume}%
                  </span>
                </div>

                <div className="h-2.5 bg-surface-muted rounded-full overflow-hidden border border-border-light">
                  <div 
                    className="h-full bg-accent-blue transition-all duration-75"
                    style={{ width: `${micVolume}%` }}
                  />
                </div>

                <select 
                  className="w-full bg-white border border-border-light rounded-xl px-3 py-2 text-xs font-body text-text-primary focus:border-accent-blue transition-colors"
                  value={selectedAudioDevice}
                  onChange={(e) => {
                    setSelectedAudioDevice(e.target.value);
                    startTest(selectedVideoDevice, e.target.value);
                  }}
                  disabled={!stream}
                >
                  {audioDevices.length === 0 && <option value="">Default Microphone</option>}
                  {audioDevices.map((device, idx) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Microphone ${idx + 1}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Speaker Output Test */}
              <div className="p-5 bg-surface-near-white rounded-2xl border border-border-light space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-xs text-text-primary">
                    Speaker Sound Check
                  </span>
                  <span className="text-[10px] font-medium text-text-secondary">440Hz Sine Tone</span>
                </div>
                <button 
                  type="button"
                  onClick={playTestSound}
                  disabled={isPlayingSound}
                  className="w-full py-2.5 bg-white border border-border-light rounded-xl text-xs font-heading font-bold text-text-primary hover:border-accent-blue hover:text-accent-blue transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <HugeIcon name="sparkles" size={14} />
                  <span>{isPlayingSound ? "Playing test sound..." : "Play Test Tone"}</span>
                </button>
              </div>

              {/* Close Button */}
              <button 
                type="button"
                onClick={onClose}
                className="w-full py-3.5 rounded-full font-body text-xs font-semibold bg-text-primary text-white hover:bg-black transition-colors shadow-xs"
              >
                Everything Looks Good • Close
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
