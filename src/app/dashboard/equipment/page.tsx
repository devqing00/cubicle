"use client";

import React, { useState, useEffect, useRef } from "react";
import HugeIcon from "@/components/ui/HugeIcon";

export default function EquipmentPage() {
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
    startTest();
    return () => {
      stopTest();
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(e => console.warn("Autoplay prevented:", e));
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

  const videoDevices = devices.filter(d => d.kind === 'videoinput');
  const audioDevices = devices.filter(d => d.kind === 'audioinput');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="px-3 py-1 bg-accent-blue/10 text-accent-blue rounded-full text-[10px] font-bold uppercase tracking-wider border border-accent-blue/20 mb-3 inline-block">
          Lesson Readiness
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mb-2">
          Equipment Check & Testing
        </h1>
        <p className="font-body text-xs sm:text-sm text-text-secondary">
          Verify that your webcam, microphone audio, and speakers are fully calibrated before joining live lessons.
        </p>
      </div>

      {permissionError ? (
        <div className="bg-white border border-border-light rounded-[28px] p-10 text-center max-w-xl mx-auto space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto">
            <HugeIcon name="alert" size={28} />
          </div>
          <h3 className="font-heading text-2xl font-bold text-text-primary">Camera or Mic Blocked</h3>
          <p className="font-body text-xs sm:text-sm text-text-secondary leading-relaxed">
            Your browser has blocked access to your video camera or audio input. Please click the lock or camera icon in your address bar to allow permissions, then click try again.
          </p>
          <button 
            onClick={() => startTest()}
            className="px-8 py-3.5 bg-text-primary text-white rounded-full font-body text-xs font-semibold hover:bg-black transition-colors"
          >
            Retry Permissions
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Video Preview Canvas (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-[28px] border border-border-light shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-text-primary">
                Camera Live Feed
              </h3>
              {stream && (
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  Active
                </span>
              )}
            </div>

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
                    <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto" />
                  ) : (
                    <HugeIcon name="video" size={36} className="mx-auto text-neutral-500" />
                  )}
                  <p className="font-body text-xs">{testing ? "Starting camera stream..." : "Camera offline"}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block font-body text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                Video Input Device
              </label>
              <select 
                className="w-full bg-surface-near-white border border-border-light rounded-xl px-4 py-3 text-xs font-body text-text-primary focus:border-accent-blue transition-colors"
                value={selectedVideoDevice}
                onChange={(e) => {
                  setSelectedVideoDevice(e.target.value);
                  startTest(e.target.value, selectedAudioDevice);
                }}
                disabled={!stream}
              >
                {videoDevices.length === 0 && <option value="">Default Webcam</option>}
                {videoDevices.map((device, idx) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${idx + 1}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Audio & Speaker Testing (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Microphone Input */}
            <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-border-light shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg font-bold text-text-primary">
                  Microphone Test
                </h3>
                <span className="text-[10px] font-bold text-accent-blue uppercase tracking-wider">
                  Level: {micVolume}%
                </span>
              </div>
              <p className="font-body text-xs text-text-secondary">
                Speak into your mic to test sensitivity and input gain.
              </p>

              <div className="h-3 bg-surface-muted rounded-full overflow-hidden border border-border-light">
                <div 
                  className="h-full bg-accent-blue transition-all duration-75"
                  style={{ width: `${micVolume}%` }}
                />
              </div>

              <div>
                <label className="block font-body text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                  Audio Input Device
                </label>
                <select 
                  className="w-full bg-surface-near-white border border-border-light rounded-xl px-4 py-3 text-xs font-body text-text-primary focus:border-accent-blue transition-colors"
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
            </div>

            {/* Speaker Sound Check */}
            <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-border-light shadow-sm space-y-4">
              <h3 className="font-heading text-lg font-bold text-text-primary">
                Speaker Output Check
              </h3>
              <p className="font-body text-xs text-text-secondary">
                Play an audible test tone to confirm your headphones or speakers are connected properly.
              </p>

              <button 
                type="button"
                onClick={playTestSound}
                disabled={isPlayingSound}
                className="w-full py-3.5 bg-surface-near-white border border-border-light rounded-full text-xs font-heading font-bold text-text-primary hover:border-accent-blue hover:text-accent-blue hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-2xs"
              >
                <HugeIcon name="sparkles" size={16} />
                <span>{isPlayingSound ? "Playing 440Hz Tone..." : "Play Test Audio"}</span>
              </button>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
