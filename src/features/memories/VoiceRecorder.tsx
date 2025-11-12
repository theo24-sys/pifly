import { useState } from 'react';
import { Button } from '@/shared/ui/Button';

export function VoiceRecorder({ onRecord }: { onRecord: (blob: Blob) => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/wav' });
      onRecord(blob);
      stream.getTracks().forEach(track => track.stop());
    };

    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setIsRecording(false);
  };

  return (
    <div className="space-y-4">
      <Button 
        onClick={isRecording ? stopRecording : startRecording}
        className={`px-8 py-4 text-xl ${isRecording ? 'bg-red-500' : 'bg-blue-500'}`}
      >
        {isRecording ? 'Stop 🎤' : 'Record Voice 💕'}
      </Button>
      {isRecording && <div className="text-red-500 animate-pulse">Recording...</div>}
    </div>
  );
}