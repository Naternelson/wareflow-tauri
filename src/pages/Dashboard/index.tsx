import { Box, Stack, Typography } from "@mui/material"

export const Dashboard = () => {
    return (
        <Box display={"flex"} height={"100vh"} alignItems={"center"} justifyContent={"center"}>
            <Stack direction = "column" spacing = {2} minWidth={"100px"} maxWidth={"300px"} maxHeight={".8vh"}>
                <Typography variant="h1">Dashboard</Typography>
            </Stack>
        </Box>
    )
}