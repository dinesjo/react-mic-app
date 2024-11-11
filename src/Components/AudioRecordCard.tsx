import { Card, CardActions, CardContent, Button, IconButton, Stack, Typography } from "@mui/material";
import { Delete, HourglassEmpty, Mic, MicOff } from "@mui/icons-material";
import { useState, useRef } from "react";

interface AudioRecordCardProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function AudioRecordCard({
  title = "Description",
  description = "What work has been done?",
  icon,
}: AudioRecordCardProps) {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  async function startRecording() {
    audioChunksRef.current = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);

    recorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const url = URL.createObjectURL(audioBlob);
      setAudio(new Audio(url));
    };

    recorder.start();
    setIsRecording(true);
  }

  function stopRecording() {
    mediaRecorder?.stop();
    setIsRecording(false);
    transcribeAudio();
  }

  async function transcribeAudio() {
    setIsTranscribing(true);
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
    const formData = new FormData();
    formData.append("audio", audioBlob);

    // Delay 2s to simulate transcription
    setTimeout(() => {
      setIsTranscribing(false);
      setTranscription(
        "This is a transcription of the audio recording. It can be quite long and detailed. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      );
    }, 2000);

    // try {
    //   const response = await fetch("", {
    //     method: "POST",
    //     body: formData,
    //   });
    //   const data = await response.json();
    //   console.log(data);
    // } catch (error) {
    //   console.error(error);
    // }
  }

  function deleteAudio() {
    audio?.pause();
    setAudio(null);
    setTranscription(null);
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
      {transcription && (
        <CardActions sx={{ justifyContent: "center", pb: 2 }}>
          <Typography variant="body2">{transcription}</Typography>
        </CardActions>
      )}
      {isTranscribing && (
        <CardActions sx={{ justifyContent: "center", pb: 2 }}>
          <IconButton>
            <HourglassEmpty />
          </IconButton>
          <Typography variant="body2">Transcribing audio...</Typography>
        </CardActions>
      )}
    </Card>
  );
}
