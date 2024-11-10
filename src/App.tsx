import { CssBaseline, Fab, Stack } from "@mui/material";
import { AppBar, Toolbar, IconButton, Container } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Mic } from "@mui/icons-material";
import AudioRecordCard from "./Components/AudioRecordCard";

export default function App() {
  return (
    <>
      <CssBaseline />
      <AppBar position="fixed" color="primary" sx={{ top: "auto", bottom: 0 }}>
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer">
            <MenuIcon />
          </IconButton>
          <Fab
            sx={{
              position: "absolute",
              zIndex: 1,
              top: -30,
              left: 0,
              right: 0,
              margin: "0 auto",
            }}
            color="secondary"
          >
            <Mic />
          </Fab>
        </Toolbar>
      </AppBar>
      <Container>
        <Stack direction="column" gap={2} sx={{ my: 3 }}>
          <AudioRecordCard title="Question one" description="More detailed description goes here if needed" />
          <AudioRecordCard title="Question two" description="More detailed description goes here if needed" />
        </Stack>
      </Container>
    </>
  );
}
