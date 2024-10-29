import matplotlib.pyplot as plt
import numpy as np
import tkinter as tk
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from tkinter import ttk

# Variables globales
points = []
labels = []
weights = np.zeros(3)  # w1, w2, bias

# Función para agregar puntos con el ratón
def onclick(event):
    global points, labels
    x, y = event.xdata, event.ydata
    if x is not None and y is not None:
        x = round(x, 3)
        y = round(y, 3)
        if event.button == 1:  # Clic izquierdo
            label = 1
        elif event.button == 3:  # Clic derecho
            label = -1
        else:
            return
        points.append((x, y))
        labels.append(label)
        ax.scatter(x, y, c='black')
        update_table()
        canvas.draw()
        classify_and_plot()

# Función para entrenar el modelo ADALINE
def train_adaline():
    global points, labels, weights
    if not points or not labels:
        return
    learning_rate = 0.01  # Tasa de aprendizaje
    epochs = 1000  # Número de épocas
    weights = np.zeros(3)  # w1, w2, bias

    # Convertir puntos y etiquetas en arrays de NumPy
    X = np.array([np.array([x, y, 1]) for x, y in points])  # Añadir 1 para el término de sesgo
    y = np.array(labels)
    for epoch in range(epochs):
        # Salida continua del modelo (sin función de activación escalonada)
        output = np.dot(X, weights)
        errors = y - output  # Error continuo
        weights += learning_rate * np.dot(X.T, errors)  # Ajuste de pesos basado en el error continuo
        if epoch % 100 == 0:
            classify_and_plot()  # Actualizar la gráfica cada 100 épocas
            root.update()  # Actualizar la interfaz gráfica
            root.after(300)  # Pausa de 0.3 segundos
    classify_and_plot()

# Función para clasificar puntos y graficar el hiperplano
def classify_and_plot():
    global points, weights
    if not weights.any():
        return
    w1, w2, bias = weights
    m = -w1 / w2  # Pendiente de la recta
    c = -bias / w2  # Intersección con el eje Y
    # Limpiar la gráfica antes de redibujar
    ax.clear()
    ax.set_title('Haga clic para agregar puntos')
    ax.set_xlabel('x1')
    ax.set_ylabel('x2')
    ax.grid(True)
    ax.set_xlim([-10, 10])
    ax.set_ylim([-10, 10])
    # Clasificar puntos
    for (x, y), label in zip(points, labels):
        result = w1 * x + w2 * y + bias
        color = 'red' if result >= 0 else 'blue'
        ax.scatter(x, y, c=color)
    # Graficar el hiperplano
    x_vals = np.array(ax.get_xlim())
    y_vals = m * x_vals + c
    ax.plot(x_vals, y_vals, '--')
    canvas.draw()

# Función para actualizar la tabla
def update_table():
    for row in tree.get_children():
        tree.delete(row)
    for point, label in zip(points, labels):
        tree.insert("", tk.END, values=(point[0], point[1], label))

# Función para borrar la gráfica y la tabla
def clear_all():
    global points, labels, weights
    points = []
    labels = []
    weights = np.zeros(3)
    ax.clear()
    ax.set_title('Haga clic para agregar puntos')
    ax.set_xlabel('x1')
    ax.set_ylabel('x2')
    ax.grid(True)
    ax.set_xlim([-10, 10])
    ax.set_ylim([-10, 10])
    update_table()
    canvas.draw()

# Crear la ventana principal de Tkinter
root = tk.Tk()
root.title("Clasificación de Puntos con ADALINE")

# Crear el canvas de Matplotlib y añadirlo a la ventana de Tkinter
fig, ax = plt.subplots()
canvas = FigureCanvasTkAgg(fig, master=root)
canvas.get_tk_widget().pack(side=tk.LEFT, fill=tk.BOTH, expand=1)

# Crear el panel de la tabla
frame_table = tk.Frame(root)
frame_table.pack(side=tk.RIGHT, fill=tk.BOTH, expand=1)

# Crear y configurar la tabla
tree = ttk.Treeview(frame_table, columns=("x", "y", "label"), show="headings")
tree.heading("x", text="x")
tree.heading("y", text="y")
tree.heading("label", text="label")
tree.pack(fill=tk.BOTH, expand=1)

# Configuración de la gráfica
cid = fig.canvas.mpl_connect('button_press_event', onclick)
ax.set_title('Haga clic para agregar puntos')
ax.set_xlabel('x1')
ax.set_ylabel('x2')
ax.grid(True)
ax.set_xlim([-10, 10])
ax.set_ylim([-10, 10])

# Crear los botones y posicionarlos
button_train = tk.Button(root, text="Entrenar ADALINE", command=train_adaline)
button_train.pack(side=tk.BOTTOM)
button_clear = tk.Button(root, text="Clear", command=clear_all)
button_clear.pack(side=tk.BOTTOM)

# Iniciar el bucle principal de la ventana
root.mainloop()
