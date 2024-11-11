import { Box, Button, CssBaseline, Divider, Fab, Stack, Stepper } from "@mui/material";
import { AppBar, Toolbar, IconButton, Container } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AccessTimeOutlined,
  BadgeOutlined,
  BuildOutlined,
  LocationOnOutlined,
  Mic,
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
      <Container sx={{ mb: 3 }}>
        <Stack direction="column" gap={2} sx={{ my: 3 }}>
          <AudioRecordCard
            icon={
              <Box sx={{ position: "relative", width: 52, height: 52 }}>
                <BadgeOutlined sx={{ position: "absolute", top: 0 }} />
                <AccessTimeOutlined sx={{ position: "absolute", bottom: 0 }} />
              </Box>
            }
            title="Ange namn samt antal arbetade timmar"
            description="Namn på de som arbetat. Avrunda till hela timmar."
          />
          <AudioRecordCard
            icon={<LocationOnOutlined />}
            title="Vart har dagens arbete genomförts?"
            description="Ange address samt ort."
          />
          <AudioRecordCard icon={<BuildOutlined />} title="Vilka arbetsmoment har utförts?" description="" />
          <AudioRecordCard
            icon={<WarningAmberOutlined />}
            title="Har det uppstått några arbetsmiljörisker under dagen?"
            description=""
          />
          <AudioRecordCard
            icon={<ReportOutlined />}
            title="Har någon situation uppstått som försvårat arbetet?"
            description=""
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
