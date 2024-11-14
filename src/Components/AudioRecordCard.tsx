import {
  Card,
  CardActions,
  CardContent,
  Button,
  IconButton,
  Stack,
  Typography,
  Container,
  Divider,
} from "@mui/material";
import { CheckCircle, Delete, Mic, MicOff, SubtitlesOutlined } from "@mui/icons-material";
import { useState, useRef } from "react";
import GradientCircularProgress from "./GradientCircularProgres";
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
  const [answered, setAnswered] = useState(false);

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

  function updateTranscriptionState(isTranscribing: boolean, transcription: string | null, answered: boolean) {
    setIsTranscribing(isTranscribing);
    setTranscription(transcription);
    setAnswered(answered);
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
          updateTranscriptionState(false, "API server fault.", false);
          return;
        } else if (!data.DisplayText) {
          updateTranscriptionState(false, "No words detected, try again.", false);
          return;
        }
        updateTranscriptionState(false, data.DisplayText, true);
      } catch (error) {
        console.error("Error transcribing audio:", error);
        updateTranscriptionState(false, "Error transcribing audio.", false);
      }
    } else {
      updateTranscriptionState(false, "Failed to convert WAV to Base64", false);
    }
  }

  function deleteAudio() {
    if (audio) {
      audio.pause();
      URL.revokeObjectURL(audio.src);
    }
    setAudio(null);
    updateTranscriptionState(false, null, false);
  }

  return (
    <Card elevation={3} sx={{ maxWidth: 400, margin: "16px auto", position: "relative", overflow: "visible" }}>
      {answered && (
        <IconButton sx={{ position: "absolute", top: "-1em", right: "-1em" }} disabled>
          <CheckCircle fontSize="large" color="success" />
        </IconButton>
      )}
      <CardContent>
        <Stack direction="row" alignItems="center" gap={1}>
          {icon}
          <Typography variant="h5">{title}</Typography>
        </Stack>
        {description && (
          <Typography variant="body1" sx={{ mt: 2, color: "text.secondary" }}>
            {description}
          </Typography>
        )}
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
        <Container sx={{ mb: 1 }}>
          <Stack direction="row" gap={1}>
            <SubtitlesOutlined fontSize="small" />
            <Typography variant="subtitle2">Ditt svar</Typography>
          </Stack>
          <Divider orientation="vertical" flexItem />
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {transcription}
          </Typography>
        </Container>
      )}
      {isTranscribing && (
        <CardActions sx={{ justifyContent: "center", pb: 2 }}>
          <GradientCircularProgress />
          <Typography
            variant="body2"
            sx={{
              background: "linear-gradient(45deg, #006390, #70dda5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Transcribing audio...
          </Typography>
        </CardActions>
      )}
    </Card>
  );
}
