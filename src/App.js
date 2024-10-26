import React, { useState } from "react"; // Importing React and useState hook
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"; // Importing drag-and-drop components
import { Bar } from "react-chartjs-2"; // Importing Bar chart from chart.js
import "chart.js/auto"; // Auto import chart.js components
import "./App.css"; // Importing CSS styles

// Initial workout blocks data
const initialBlocks = [
  { id: "1", content: "Warm-up", km: 2 },
  { id: "2", content: "Active", km: 5 },
  { id: "3", content: "Cool-down", km: 3 },
  { id: "4", content: "Step Repeats", km: 4 },
  { id: "5", content: "Ramp Up", km: 6 },
  { id: "6", content: "Ramp Down", km: 4 },
];

const App = () => {
  // State to manage workout blocks, graph data, and logs
  const [blocks, setBlocks] = useState(initialBlocks);
  const [graphData, setGraphData] = useState([]);
  const [log, setLog] = useState([]);

  // Function to handle the end of a drag event
  const handleDragEnd = (result) => {
    if (!result.destination) return; // If there's no destination, exit
    const draggedBlock = blocks[result.source.index]; // Get the dragged block
    addToGraph(draggedBlock); // Add the block to the graph
  };

  // Function to add a block to the graph data
  const addToGraph = (block) => {
    setGraphData((prev) => {
      const existingBlock = prev.find((b) => b.content === block.content); // Check if block already exists
      if (existingBlock) {
        // If it exists, increment the count
        return prev.map((b) =>
          b.content === block.content ? { ...b, count: b.count + 1 } : b
        );
      } else {
        // If not, add it as a new entry
        return [...prev, { ...block, count: 1 }];
      }
    });
    addToLog(block); // Log the action
  };

  // Function to add a log entry
  const addToLog = (block) => {
    const logEntry = { id: Date.now(), content: `${block.content} - ${block.km} km`, blockId: block.id }; // Create a log entry
    setLog((prevLog) => [...prevLog, logEntry]); // Update the log state
  };

  // Function to delete a log entry
  const deleteLogEntry = (logId, blockId) => {
    setLog((prevLog) => prevLog.filter((entry) => entry.id !== logId)); // Remove the log entry
    setGraphData((prevGraph) =>
      prevGraph
        .map((block) =>
          block.id === blockId
            ? { ...block, count: block.count > 1 ? block.count - 1 : 0 } // Decrement count or set to 0
            : block
        )
        .filter((block) => block.count > 0) // Remove blocks with count 0
    );
  };

  // Function to reset all logs and graph data
  const resetAll = () => {
    setLog([]); // Clear the log
    setGraphData([]); // Clear the graph data
  };

  // Chart data for the bar chart
  const chartData = {
    labels: graphData.map((block) => block.content), // Labels for each block
    datasets: [
      {
        label: "Count of Workouts", // Label for count dataset
        data: graphData.map((block) => block.count), // Data for counts
        backgroundColor: "rgba(75,192,192,0.6)", // Color for the count bars
      },
      {
        label: "Distance (km)", // Label for distance dataset
        data: graphData.map((block) => block.km), // Data for distances
        backgroundColor: "rgba(153,102,255,0.6)", // Color for the distance bars
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-200 p-5">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-4xl font-bold text-purple-700">Workout Planner</h1>
        <button
          onClick={resetAll}
          className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg transition transform hover:scale-105"
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Workout Blocks Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-purple-600 mb-4">Workout Blocks</h2>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="workoutBlocks">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {blocks.map((block, index) => (
                    <Draggable key={block.id} draggableId={block.id} index={index}>
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          className="p-4 bg-blue-400 text-white rounded-lg cursor-pointer shadow-md transform hover:scale-105 transition"
                          onClick={() => addToGraph(block)}
                        >
                          {block.content} - {block.km} km
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* Graph Section */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-purple-600 mb-4">Workout Graph</h2>
          <div className="bg-gray-100 p-4 min-h-[300px] rounded-lg">
            {graphData.length === 0 ? (
              <p className="text-gray-500 text-center">No blocks added yet.</p>
            ) : (
              <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
            )}
          </div>
        </div>

        {/* Log Section */}
        <div className="md:col-span-3 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-purple-600 mb-4">Workout Log</h2>
          <div className="bg-gray-100 p-4 min-h-[150px] rounded-lg">
            {log.length === 0 ? (
              <p className="text-gray-500 text-center">No workouts logged yet.</p>
            ) : (
              log.map((entry) => (
                <div key={entry.id} className="flex justify-between p-3 bg-green-400 text-white my-2 rounded-lg shadow-md">
                  <span>{entry.content}</span>
                  <button
                    onClick={() => deleteLogEntry(entry.id, entry.blockId)}
                    className="bg-red-600 text-white p-2 rounded-lg shadow-md"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
