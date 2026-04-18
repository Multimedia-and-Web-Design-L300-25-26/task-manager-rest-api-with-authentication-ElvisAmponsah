import Task from "../models/Task.js";

export const createTask = async (req, res) => {
    try {
        const { title, description, completed } = req.body;

        const task = new Task({
            title,
            description,
            completed,
            owner: req.user._id,
        });

        const createdTask = await task.save();
        res.status(201).json(createdTask);
    } catch (error) {
        res.status(400).json({ message: "Invalid task data", error: error.message });
    }
};

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user._id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        if (task.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized to delete this task" });
        }

        await task.deleteOne();
        res.json({ message: "Task removed" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
