import { auth } from "../../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button, Card, CardContent } from "@mui/material";
import { useAuth } from "../../firebase/AuthContext";

export default function AboutScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "90%",
          height: "50%",
          boxShadow: 5,
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "space-evenly",
            justifyContent: "space-evenly",
            width: "100%",
            height: "100%",
          }}
        >
          <Typography
            variant="h4"
            sx={{ color: "text.secondary", textAlign: "center" }}
          >
            Hasta pronto!
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "text.secondary", textAlign: "center", mt: "-50px" }}
          >
            {user.email}
          </Typography>
          <Button
            sx={{
              width: { sm: "90%", lg: "40%" },
              alignSelf: "center",
              mt: "-20px",
            }}
            color="error"
            variant="contained"
            onClick={handleSignOut}
          >
            Cerrar sesión
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
