import React, { useState, useEffect } from "react";
import { doc, getFirestore, collection, onSnapshot, addDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";

export default function HomeScreen() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDay, setDueDay] = useState("1");
    const [dueMonth, setDueMonth] = useState("1");
    const [dueYear, setDueYear] = useState("");
    const [tasks, setTasks] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTaskId, setCurrentTaskId] = useState(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const auth = getAuth();
    const user = auth.currentUser;
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const q = query(collection(getFirestore(), 'tasks'), where("userId", "==", user.uid));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const tasks = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setTasks(tasks);
            });

            return () => unsubscribe();
        }
    }, [user]);

    const addTask = async () => {
        if (title && description && dueDay && dueMonth && dueYear && user) {
            const dueDate = `${dueDay}/${dueMonth}/${dueYear}`;
            const newTask = { title, description, dueDate, userId: user.uid };
            if (isEditing && currentTaskId) {
                await updateDoc(doc(getFirestore(), 'tasks', currentTaskId), newTask);
                setIsEditing(false);
                setCurrentTaskId(null);
            } else {
                await addDoc(collection(getFirestore(), 'tasks'), newTask);
            }
            setTitle("");
            setDescription("");
            setDueDay("1");
            setDueMonth("1");
            setDueYear("");
            setModalVisible(false);
            setErrorMessage(null);
        } else {
            setErrorMessage("Todos los campos son obligatorios.");
        }
    };

    const editTask = (id) => {
        const task = tasks.find(task => task.id === id);
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
            const [day, month, year] = task.dueDate.split('/');
            setDueDay(day);
            setDueMonth(month);
            setDueYear(year);
            setIsEditing(true);
            setCurrentTaskId(id);
            setModalVisible(true);
        }
    };

    const confirmDeleteTask = (id) => {
        setTaskToDelete(id);
        setDeleteModalVisible(true);
    };

    const deleteTask = async () => {
        if (taskToDelete) {
            await deleteDoc(doc(getFirestore(), 'tasks', taskToDelete));
            setDeleteModalVisible(false);
            setTaskToDelete(null);
        }
    };

    const openAddTaskModal = () => {
        setTitle("");
        setDescription("");
        setDueDay("1");
        setDueMonth("1");
        setDueYear("");
        setIsEditing(false);
        setModalVisible(true);
    };

    return (
        <div style={styles.container}>
            <button onClick={openAddTaskModal} style={styles.addButton}>Agregar Tarea</button>
            <ul style={styles.taskList}>
                {tasks.map(task => (
                    <li key={task.id} style={styles.task}>
                        <h3 style={styles.taskTitle}>{task.title}</h3>
                        <p>{task.description}</p>
                        <p>Fecha de entrega: {task.dueDate}</p>
                        <div style={styles.taskButtons}>
                            <button onClick={() => editTask(task.id)} style={styles.editButton}>Editar</button>
                            <button onClick={() => confirmDeleteTask(task.id)} style={styles.deleteButton}>Eliminar</button>
                        </div>
                    </li>
                ))}
            </ul>
            {modalVisible && (
                <div style={styles.modalContainer}>
                    <div style={styles.modalView}>
                        <input
                            type="text"
                            placeholder="Título"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={styles.input}
                        />
                        <textarea
                            placeholder="Descripción"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={styles.descriptionInput}
                        />
                        <div style={styles.datePickerContainer}>
                            <select value={dueDay} onChange={(e) => setDueDay(e.target.value)} style={styles.picker}>
                                {[...Array(31).keys()].map(day => (
                                    <option key={day + 1} value={day + 1}>{day + 1}</option>
                                ))}
                            </select>
                            <select value={dueMonth} onChange={(e) => setDueMonth(e.target.value)} style={styles.picker}>
                                {[...Array(12).keys()].map(month => (
                                    <option key={month + 1} value={month + 1}>{month + 1}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Año"
                                value={dueYear}
                                onChange={(e) => setDueYear(e.target.value)}
                                style={styles.yearInput}
                            />
                        </div>
                        {errorMessage && <p style={styles.errorText}>{errorMessage}</p>}
                        <div style={styles.confirmButtons}>
                            <button onClick={() => setModalVisible(false)} style={styles.cancelButton}>Cerrar</button>
                            <button onClick={addTask} style={styles.confirmButton}>{isEditing ? "Guardar Cambios" : "Agregar Tarea"}</button>
                        </div>
                    </div>
                </div>
            )}
            {deleteModalVisible && (
                <div style={styles.modalContainer}>
                    <div style={styles.modalView}>
                        <p>¿Estás seguro de que deseas eliminar esta tarea?</p>
                        <div style={styles.confirmButtons}>
                            <button onClick={() => setDeleteModalVisible(false)} style={styles.cancelButton}>Cancelar</button>
                            <button onClick={deleteTask} style={styles.confirmButton}>Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: "20px",
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
        width: "100%",
    },
    descriptionInput: {
        marginBottom: "10px",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        width: "100%",
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