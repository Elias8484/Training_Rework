import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Pressable, ActivityIndicator, Alert, ScrollView } from "react-native";

const API_BASE = process.env.EXPO_PUBLIC_API_BASE; 

export default function HomeScreen() {
  const [todos, setTodos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Load Todos from C# Backend
  async function loadTodos() {
    try {
      const res = await fetch(`${API_BASE}/api/todo`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error("Could not load todos", err);
    }
  }

  // Create a new Todo
  async function addTodo() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/todo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: "New Task from Mobile", is_complete: false }),
      });

      if (res.ok) {
        await loadTodos(); // Refresh list
      } else {
        throw new Error("Failed to add task");
      }
    } catch (err) {
      Alert.alert("Error", "Could not add todo: " + err);
    } finally {
      setLoading(false);
    }
  }

  // Delete to do
  async function deleteTodo(id:number){
    try {
      console.log("Deleting id:", id);
      const res = await fetch(`${API_BASE}/api/todo/${id}`, {
        method: "DELETE",
      });
      
      const text = await res.text(); // in case backend returns an error string
      console.log("DELETE status:", res.status, "body:", text);

       if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);

       await loadTodos();

    }
    catch (err: any) {
      Alert.alert("Error", "Could not delete task")
    }
  }
    

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Supabase Todo List</Text>

      <ScrollView style={styles.listContainer}>
        {todos.length === 0 ? (
          <Text style={styles.emptyText}>No tasks found.</Text>
        ) : (
          todos.map((todo) => (
            // We wrap the text and button in a horizontal View
            <View key={todo.id} style={styles.todoRow}>
              <Text style={styles.todoItem}>
                {todo.is_complete ? "✅" : "⭕"} {todo.task}
              </Text>
              
              <Pressable onPress={() => deleteTodo(todo.id)}>
                <Text style={styles.deleteText}>Delete</Text>
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable 
          style={({ pressed }) => [
            styles.button, 
            { opacity: pressed || loading ? 0.6 : 1 }
          ]} 
          onPress={addTodo} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="black" />
          ) : (
            <Text style={styles.buttonText}>Add New Task</Text>
          )}
        </Pressable>

        <Pressable style={styles.reloadButton} onPress={loadTodos}>
          <Text style={styles.reloadText}>Refresh List</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",  
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 20,
    color: "black",
    textAlign: "center",
  },
  listContainer: {
    flex: 1,
    width: '100%',
  },
  todoItem: {
    fontSize: 18,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    color: 'black',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  button: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    backgroundColor: "#f0f0f0",
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "black",              
  },
  reloadButton: {
    marginTop: 15,
  },
  reloadText: {
    textDecorationLine: "underline",
    fontSize: 16,
    color: "black",            
  },
    todoRow: {
    flexDirection: "row", // Places text and button side-by-side
    justifyContent: "space-between", // Pushes the button to the right edge
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingRight: 15,
  },
  deleteText: {
    color: "red",
    fontWeight: "600",
  },
});