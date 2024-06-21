const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
})

app.get("/test", (req, res) => {
    try{
        res.status(200).send("Hello World!");
    }catch (error) {
        res.status(500).send({ error: error.message });
    }
})

app.get("/user", async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default to page 1, limit 10
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    try {
        const result = await prisma.student.findMany({
            skip: offset,
            take: limitNum,
            include: {
                marks: true,
            },
        });

        // Fetch the total count of students for pagination metadata
        const totalStudents = await prisma.student.count();
        
        res.status(200).json({
            total: totalStudents,
            page: pageNum,
            limit: limitNum,
            students: result
        });
    } catch (error) {
        console.error('Error fetching students with marks:', error);
        res.status(500).send({ error: error.message });
    }
});

app.get("/user/:id", async (req, res) => {
    try {
        const result = await prisma.student.findUnique({
            where: {
                id: Number(req.params.id)
            },
            include: {
                marks: true,
            },
        });
        res.status(200).json(result);   
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.post("/user", async (req, res) => {
    const { firstName, lastName, rollNumber, marks } = req.body;

    try {
        // Step 1: Create a new student (User)
        const newStudent = await prisma.student.create({
            data: {
                firstName,
                lastName,
                rollNumber,
            },
        });

        // Step 2: Create marks associated with the student
        const createdMarks = await prisma.mark.createMany({
            data: marks.map(mark => ({
                studentId: newStudent.id,
                subject: mark.subject,
                mark: mark.mark,
            })),
        });

        // Fetch the student with their associated marks
        const studentWithMarks = await prisma.student.findUnique({
            where: { id: newStudent.id },
            include: { marks: true },
        });

        res.status(201).json(studentWithMarks); // Respond with the created student and associated marks
    } catch (error) {
        console.error('Error creating student with marks:', error);
        res.status(500).json({ error: 'An error occurred while creating the student.' });
    } 
});

app.put("/user/:id", async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, rollNumber, marks } = req.body;
    try {
        const updatedStudent = await prisma.student.update({
            where: { id: Number(id) },
            data: {
                firstName,
                lastName,
                rollNumber,
            },
        });

        await prisma.mark.deleteMany({
            where: {
                studentId: updatedStudent.id,
            },
        });

        const createdMarks = await prisma.mark.createMany({
            data: marks.map(mark => ({
                studentId: updatedStudent.id,
                subject: mark.subject,
                mark: mark.mark,
            })),
        });

        const studentWithMarks = await prisma.student.findUnique({
            where: { id: updatedStudent.id },
            include: { marks: true },
        });

        res.status(200).json(studentWithMarks);
    } catch (error) {
        console.error("Error updating student with marks:", error);
        res.status(500).send({ error: error.message });
    }
});

app.delete("/user/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const student = await prisma.student.findUnique({
            where: { id: Number(id) },
        });
        if (!student) {
            return res.status(404).json({ error: `Student with id ${id} not found.` });
        }
        const deletedStudent = await prisma.student.delete({
            where: { id: Number(id) },
        });
        const deletedMarksEntries = await prisma.mark.deleteMany({
            where: { studentId: Number(id) },
        });
        res.status(200).json({ deletedStudent, deletedMarksEntries });
    } catch (error) {
        console.error("Error deleting student and associated marks:", error);
        res.status(500).send({ error: error.message });
    }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});   
