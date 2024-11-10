import { Card, CardActions, CardContent, Button, IconButton, Stack, Typography } from "@mui/material";
import { Delete, Mic, MicOff } from "@mui/icons-material";
import { useState, useRef } from "react";

interface AudioRecordCardProps {
  title?: string;
  description?: string;
}

export default function AudioRecordCard({
  title = "Description",
  description = "What work has been done?",
}: AudioRecordCardProps) {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
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
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setIsRecording(false);
  };

  return (
    <Card elevation={3} sx={{ maxWidth: 400, margin: "16px auto" }}>
      <CardContent>
        <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2 }}>
          <Typography variant="h5">{title}</Typography>
        </Stack>
        <Typography variant="body1">{description}</Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between", px: 2 }}>
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
        <IconButton color="error" onClick={() => setAudio(null)} disabled={!audio} sx={{ ml: 1 }}>
          <Delete />
        </IconButton>
      </CardActions>
      {audio && (
        <CardActions sx={{ justifyContent: "center", pb: 2 }}>
          <audio controls src={audio.src} style={{ width: "100%" }} />
        </CardActions>
      )}
    </Card>
  );
}
