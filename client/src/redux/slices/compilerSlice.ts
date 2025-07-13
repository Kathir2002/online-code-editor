import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface compilerSliceStateType {
  fullCode: {
    html: string;
    css: string;
    javascript: string;
  };
  currentLanguage: "html" | "css" | "javascript";
  isOwner: boolean;
}

const initialState: compilerSliceStateType = {
  fullCode: {
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>To-Do List</title>
      <link rel="stylesheet" href="styles.css">
    </head>
    <body>
      <div class="container">
        <h1>To-Do List</h1>
        <input type="text" id="taskInput" placeholder="Add new task">
        <button onclick="addTask()">Add Task</button>
        <ul id="taskList"></ul>
      </div>
      <script src="script.js"></script>
    </body>
    </html>
    `,
    css: `body {
      font-family: Arial, sans-serif;
    }
    
    .container {
      max-width: 400px;
      margin: 20px auto;
    }
    
    input[type="text"] {
      width: 100%;
      padding: 8px;
      margin-bottom: 10px;
    }
    
    button {
      padding: 8px 16px;
      background-color: #4CAF50;
      color: white;
      border: none;
      cursor: pointer;
    }
    
    button:hover {
      background-color: #45a049;
    }
    
    ul {
      list-style-type: none;
      padding: 0;
    }
    
    li {
      margin-bottom: 5px;
    }
    
    .completed {
      text-decoration: line-through;
      color: #888;
    }
    `,
    javascript: `function addTask() {
      var taskInput = document.getElementById("taskInput");
      var taskText = taskInput.value.trim();
    
      if (taskText !== "") {
        var taskList = document.getElementById("taskList");
        var newTask = document.createElement("li");
        newTask.textContent = taskText;
        newTask.onclick = toggleTask;
        taskList.appendChild(newTask);
        taskInput.value = "";
      } else {
        alert("Please enter a task!");
      }
    }
    
    function toggleTask() {
      this.classList.toggle("completed");
    }
    `,
  },
  currentLanguage: "html",
  isOwner: false,
};

const compilerSlice = createSlice({
  name: "compilerSlice",
  initialState,
  reducers: {
    updateCurrentLanguage: (
      state,
      action: PayloadAction<compilerSliceStateType["currentLanguage"]>
    ) => {      
      state.currentLanguage = action.payload;
    },
    updateCodeValue: (state, action: PayloadAction<string>) => {
      state.fullCode[state.currentLanguage] = action.payload;
    },
    updateJSCode: (state, action: PayloadAction<string>) => {
      state.fullCode.javascript = action.payload;
    },
    updateIsOwner: (state, action: PayloadAction<boolean>) => {
      state.isOwner = action.payload;
    },
    updateFullCode: (
      state,
      action: PayloadAction<compilerSliceStateType["fullCode"]>
    ) => {
      state.fullCode = action.payload;
    },
  },
});

export default compilerSlice.reducer;

export const {
  updateCurrentLanguage,
  updateCodeValue,
  updateFullCode,
  updateIsOwner,
  updateJSCode,
} = compilerSlice.actions;
