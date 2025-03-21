import { openDB } from "idb";

// Inicializar IndexedDB
const dbPromise = openDB("tasksDB", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("tasks")) {
      db.createObjectStore("tasks", { keyPath: "id", autoIncrement: true });
    }
  },
});

// Guardar tarea en IndexedDB
export async function saveTaskToDB(task) {
  const db = await dbPromise;
  await db.put("tasks", task);
}

// Obtener todas las tareas de IndexedDB
export async function getTasksFromDB() {
  const db = await dbPromise;
  return db.getAll("tasks");
}

// Eliminar tarea de IndexedDB
export async function deleteTaskFromDB(id) {
  const db = await dbPromise;
  await db.delete("tasks", id);
}

// Limpiar todas las tareas de IndexedDB (cuando se sincronizan con Firebase)
export async function clearTasksDB() {
  const db = await dbPromise;
  await db.clear("tasks");
}
