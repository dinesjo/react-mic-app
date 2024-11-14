import { Card, CardActions, CardContent, Button, IconButton, Stack, Typography } from "@mui/material";
import { Delete, HourglassBottom, Mic, MicOff } from "@mui/icons-material";
import { useState, useRef } from "react";
interface AudioRecordCardProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

interface TranscriptionResponse {
  DisplayText: string;
  Duration: number;
  Offset: number;
  RecognitionStatus: string;
}

export default function AudioRecordCard({ title, description, icon }: AudioRecordCardProps) {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  async function startRecording() {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          transcribeAudio(base64Audio);
        };
        reader.readAsDataURL(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudio(new Audio(url));
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  }

  function stopRecording() {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      transcribeAudio();
    }
  }

  async function transcribeAudio(base64Audio?: string) {
    setIsTranscribing(true);

    if (base64Audio) {
      // Call the API to transcribe the audio
      const audioData = {
        audio: {
          language: "sv-se",
          mime: "audio/wav",
          data: base64Audio.split(",")[1], // Remove the data URL prefix
        },
      };

      try {
        const response = await fetch(import.meta.env.VITE_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(audioData),
        });
        const data = (await response.json()) as TranscriptionResponse;
        if (data.RecognitionStatus !== "Success") {
          setTranscription("API side error.");
          setIsTranscribing(false);
          return;
        }
        setTranscription(data.DisplayText || "No audio regonized.");
        setIsTranscribing(false);
      } catch (error) {
        console.error("Error transcribing audio:", error);
        setTranscription("Error transcribing audio.");
        setIsTranscribing(false);
      }
    } else {
      setIsTranscribing(false);
      setTranscription("No audio found.");
    }
  }

  function deleteAudio() {
    if (audio) {
      audio.pause();
      URL.revokeObjectURL(audio.src);
    }
    setAudio(null);
    setTranscription(null);
    setIsTranscribing(false);
  }

  return (
    <Card elevation={3} sx={{ maxWidth: 400, margin: "16px auto" }}>
      <CardContent>
        <Stack direction="row" alignItems="center" gap={1} marginBottom={2}>
          {icon}
          <Typography variant="h5">{title}</Typography>
        </Stack>
        {description && <Typography variant="body1">{description}</Typography>}
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between" }}>
        {isRecording ? (
          <Button startIcon={<MicOff />} variant="contained" color="error" onClick={stopRecording} fullWidth>
            Stop Recording
          </Button>
        ) : (
          <Button
            startIcon={<Mic />}
            variant="contained"
            color="primary"
            onClick={startRecording}
            disabled={audio !== null}
            fullWidth
          >
            Start Recording
          </Button>
        )}
        <IconButton color="error" onClick={deleteAudio} disabled={!audio} sx={{ ml: 1 }}>
          <Delete />
        </IconButton>
      </CardActions>
      {audio && (
        <CardActions sx={{ justifyContent: "center", pb: 2 }}>
          <audio controls src={audio.src} style={{ width: "100%" }} />
        </CardActions>
      )}
      {transcription && !isTranscribing && (
        <CardActions sx={{ justifyContent: "center", pb: 2 }}>
          <Typography variant="body2">{transcription}</Typography>
        </CardActions>
      )}
      {isTranscribing && (
        <CardActions sx={{ justifyContent: "center", pb: 2 }}>
          <IconButton>
            <HourglassBottom />
          </IconButton>
          <Typography variant="body2">Transcribing audio...</Typography>
        </CardActions>
      )}
    </Card>
  );
}
