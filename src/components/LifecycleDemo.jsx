import { useEffect, useRef } from "react"
import { Chip, Paper, Stack, Typography } from "@mui/material"

function LifecycleDemo({ trackedValue, label }) {
  const isFirstTrackedRenderRef = useRef(true)

  useEffect(() => {
    console.log("[LifecycleDemo] component mounted")

    return () => {
      console.log("[LifecycleDemo] component unmounted")
    }
  }, [])

  useEffect(() => {
    if (isFirstTrackedRenderRef.current) {
      isFirstTrackedRenderRef.current = false
      return
    }

    console.log("[LifecycleDemo] component updated", {
      trackedValue,
      label,
    })
  }, [label, trackedValue])

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h6">Lifecycle Demo</Typography>
        <Typography variant="body2">
          Open the browser console to see the mount, update, and unmount logs.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
          <Chip label={`Tracking: ${label}`} color="primary" variant="outlined" />
          <Chip label={`Value: ${trackedValue}`} color="secondary" variant="outlined" />
        </Stack>
        <Typography variant="body2">
          Changing the tracked value updates the console log without remounting the
          component.
        </Typography>
      </Stack>
    </Paper>
  )
}

export default LifecycleDemo
