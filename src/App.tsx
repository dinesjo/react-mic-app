import { Button, CssBaseline, Stack, Typography } from "@mui/material";
import { Container } from "@mui/material";
import {
  AppShortcutTwoTone,
  BuildOutlined,
  LocationOnOutlined,
  ReportOutlined,
  Send,
  WarningAmberOutlined,
} from "@mui/icons-material";
import AudioRecordCard from "./Components/AudioRecordCard";
import { useState } from "react";

export default function App() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      // Perform any actions after submission is complete
    }, 2000);
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="xs" sx={{ mb: 3 }}>
        <Stack
          gap={1}
          alignItems="center"
          direction="row"
          sx={{
            mt: 3,
            background: "linear-gradient(45deg, #006390, #70dda5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          <AppShortcutTwoTone
            fontSize="large"
            color="primary"
            sx={{
              ".MuiIcon-root": {
                background: "linear-gradient(45deg, #70dda5, #006390)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              },
            }}
          />
          <Typography variant="h4" component="h1">
            AI-dagbok
          </Typography>
        </Stack>
        <Stack direction="column" sx={{ my: 2 }}>
          {/* <AudioRecordCard
            icon={<AccessTimeOutlined color="info" />}
            title="Ange namn samt antal arbetade timmar"
            description="Namn på de som arbetat. Avrunda till hela timmar."
          /> */}
          <AudioRecordCard
            icon={<LocationOnOutlined color="success" />}
            title="Vart har dagens arbete genomförts?"
            description="Ange address samt ort."
          />
          <AudioRecordCard
            icon={<BuildOutlined color="primary" />}
            title="Vilka arbetsmoment har utförts?"
            description=""
          />
          <AudioRecordCard
            icon={<WarningAmberOutlined color="error" />}
            title="Har det uppstått några arbetsmiljörisker under dagen?"
            description="Om inte, lämna tom."
          />
          <AudioRecordCard
            icon={<ReportOutlined color="warning" />}
            title="Har någon situation uppstått som försvårat arbetet?"
            description="Om inte, lämna tom."
          />
        </Stack>
        <Button
          variant="contained"
          startIcon={<Send />}
          color="secondary"
          fullWidth
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          Skicka in
        </Button>
      </Container>
    </>
  );
}
