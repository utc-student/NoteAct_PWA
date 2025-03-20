import React, { useState, useEffect } from "react";
import {
  doc,
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
// import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import DialogContentText from "@mui/material/DialogContentText";
// import { FirebaseError } from "firebase/app";

import { messaging, getToken, onMessage } from "../../firebase/firebaseConfig";

const mostrarNotificacion = (title, body) => {
  const opciones = { body, silent: true };
  new Notification(title, opciones);

  // Reproducir sonido personalizado
  const audio = new Audio("/notificacion.mp3");
  audio.play();

  // Vibración para dispositivos móviles
  if ("vibrate" in navigator) {
    navigator.vibrate([200, 100, 200]);
  }
};

export default function HomeScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(dayjs());
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [error, setError] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;
  // const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const q = query(
        collection(getFirestore(), "tasks"),
        where("userId", "==", user.uid)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const tasks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(tasks);
      });

      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Permission granted");
        getToken(messaging, { vapidKey: "BOc57LVyQhzryr7P46zuwZucPsgkPWJ23chCRJ1qh4tfbdKSAMf8rki1yezAm0m39XBFbmiw-idpOa1SWylzjpI" }).then((currentToken) => {
          if (currentToken) {
            console.log("Token:", currentToken);
            // Envía este token a tu backend para enviar notificaciones
          } else {
            console.log("No se pudo obtener el token.");
          }
        });
      } else {
        console.log("Permiso de notificación denegado.");
      }
    });
  
    onMessage(messaging, (payload) => {
      console.log("Mensaje recibido:", payload);
      mostrarNotificacion(payload.notification.title, payload.notification.body);
    });
  }, []);

  const addTask = async () => {
    if (title && description && date && user) {
      const dueDate = date.format("DD/MM/YYYY");
      const newTask = { title, description, dueDate, userId: user.uid };
      if (isEditing && currentTaskId) {
        await updateDoc(doc(getFirestore(), "tasks", currentTaskId), newTask);
        setIsEditing(false);
        setCurrentTaskId(null);
        toast.success("Tarea editada correctamente.");
        setModalVisible(false);
        setError(false);
      } else {
        await addDoc(collection(getFirestore(), "tasks"), newTask);
        toast.success("Tarea agregada correctamente.");
        setModalVisible(false);
        setError(false);
      }
      setTitle("");
      setDescription("");
      setModalVisible(false);
      setErrorMessage(null);
      setDate(null);
      setError(false);
    } else {
      setError(true);
      setErrorMessage("Todos los campos son obligatorios.");
    }
  };

  const editTask = (id) => {
    const task = tasks.find((task) => task.id === id);
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setIsEditing(true);
      setCurrentTaskId(id);
      setDate(dayjs(task.dueDate, "DD/MM/YYYY"));
      setModalVisible(true);
    }
  };

  const confirmDeleteTask = (id) => {
    setDeleteModalVisible(true);
    setTaskToDelete(id);
  };

  const deleteTask = async () => {
    if (taskToDelete) {
      await deleteDoc(doc(getFirestore(), "tasks", taskToDelete));
      setTaskToDelete(null);
      setError(false);
      setDeleteModalVisible(false);
    }
  };

  const openAddTaskModal = () => {
    setTitle("");
    setDescription("");
    setDate(null);
    setIsEditing(false);
    setModalVisible(true);
    setError(false);
  };

  const enviarNotificacion = async () => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      toast.error("Las notificaciones no son compatibles con este navegador.");
      return;
    }
  
    const permiso = await Notification.requestPermission();
    if (permiso !== "granted") {
      toast.error("Permiso de notificación denegado.");
      return;
    }
  
    const registration = await navigator.serviceWorker.ready;
    registration.showNotification("Nota creada", {
      body: "Se ha creado una nueva nota.",
      icon: "/logo192.png",
    });
  };
  

  

  return (
    <div style={styles.container}>
      <ToastContainer />
      <button onClick={openAddTaskModal} style={styles.addButton}>
        Agregar Tarea
      </button>

      <ul style={styles.taskList}>
        {tasks.map((task) => (
          <Card key={task.id} sx={{ minWidth: 275, mb: 2, boxShadow: 8 }}>
            <CardContent>
              <Typography variant="h4" sx={{ color: "text.secondary" }}>
                {task.title}
              </Typography>
              <Typography gutterBottom sx={{ color: "text.secondary" }}>
                {task.description}
              </Typography>
              <Typography
                sx={{ color: "text.secondary", mb: 1.5, fontSize: 14 }}
              >
                Fecha de entrega: {task.dueDate}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end" }}>
              <Button
                size="small"
                onClick={() => editTask(task.id)}
                variant="contained"
                color="primary"
              >
                Editar
              </Button>
              <Button
                size="small"
                color="error"
                variant="contained"
                onClick={() => confirmDeleteTask(task.id)}
              >
                Eliminar
              </Button>
            </CardActions>
          </Card>
        ))}
      </ul>
      {modalVisible && (
        <Dialog open={modalVisible} onClose={() => setModalVisible(false)}>
          <DialogTitle>
            {" "}
            {isEditing ? "Editar Tarea" : "Agregar Tarea"}
          </DialogTitle>
          <Divider />
          <DialogContent>
            <TextField
              fullWidth
              label="Título"
              variant="outlined"
              margin="dense"
              size="small"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Descripción"
              variant="outlined"
              margin="dense"
              size="small"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ mt: 1 }}>
              <DatePicker
                sx={{ width: "100%", mt: 2 }}
                fullWidth
                disableMobile
                margin="dense"
                label="Fecha"
                value={date}
                onChange={(date) => {
                  setDate(date);
                }}
              />
            </LocalizationProvider>
            {error && <p style={styles.errorText}>{errorMessage}</p>}
          </DialogContent>
          <DialogActions>
            <Button
              color="inherit"
              variant="contained"
              onClick={() => {
                setModalVisible(false);
                setError(false);
              }}
            >
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={() => { addTask(); enviarNotificacion(); }}>
              {" "}
              {isEditing ? "Guardar" : "Agregar"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {deleteModalVisible && (
        <>
          <Dialog
            open={deleteModalVisible}
            keepMounted
            onClose={() => {
              setDeleteModalVisible(false);
              setError(false);
            }}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>¿Seguro que deseas eliminar esta tarea?</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Una vez eliminada la tarea no se podrá recuperar.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="inherit"
                onClick={() => setDeleteModalVisible(false)}
              >
                Cancelar
              </Button>
              <Button variant="contained" color="error" onClick={deleteTask}>
                Eliminar
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#EEEEEE",
  },
  addButton: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  input: {
    marginBottom: "10px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    width: "95%",
  },
  descriptionInput: {
    marginBottom: "10px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    width: "95%",
    height: "100px",
  },
  taskList: {
    listStyle: "none",
    padding: "0",
  },
  task: {
    padding: "10px",
    borderBottom: "1px solid #ccc",
  },
  taskTitle: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  taskButtons: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "5px",
  },
  editButton: {
    backgroundColor: "blue",
    padding: "10px",
    borderRadius: "5px",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    marginRight: "10px",
  },
  deleteButton: {
    backgroundColor: "red",
    padding: "10px",
    borderRadius: "5px",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  modalContainer: {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "90%",
    maxWidth: "500px",
  },
  confirmButtons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  cancelButton: {
    backgroundColor: "gray",
    padding: "10px",
    borderRadius: "5px",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  confirmButton: {
    backgroundColor: "green",
    padding: "10px",
    borderRadius: "5px",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  errorText: {
    color: "red",
    marginBottom: "10px",
  },
  datePickerContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  picker: {
    flex: "1",
    marginRight: "10px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  yearInput: {
    flex: "1",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
};
