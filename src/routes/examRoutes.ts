import { Router } from 'express';
// import { ExamController } from '../controllers/examController';
import { EpreuveModel } from '../models/EpreuveModel';

const router = Router();
const examModel = new EpreuveModel();

router.get('/', async (req, res) => {
    console.log('exam checking');
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('exam id checking', id);
        const eppreuve = await examModel.getExamById(parseInt(id));
        const questions = await examModel.getExamQuestions(parseInt(id));
        console.log('exam id checking', eppreuve);
        // console.log('exam id checking', questions);
        //date_creation: "2025-03-18T23:00:00.000Z" 
        // turn it to 18/03/2025
        const frenchDate = new Date(eppreuve.data[0].date_creation).toLocaleDateString('fr-FR');
        
        const data = {
            examenId: eppreuve.data[0].id,
            cours: eppreuve.data[0].matiere,
            duree: eppreuve.data[0].duree,
            date: frenchDate,
            annee: eppreuve.data[0].annee,
            questions: questions.data
        }

        res.send(data);        

    } catch (error) {
        console.log('Error', error);
        res.status(500).send(error);
    }
});

// Route to check user responses
router.get('/check/:id/:answer', async (req, res) => {
    try {
        const { id, answer } = req.params;
        const eppreuve = await examModel.checkAnswer(parseInt(id), answer);
        console.log('exam quiz checking', eppreuve);

        res.send(eppreuve);

    } catch (error) {
        console.log('Error', error);
        res.status(500).send(error)
        
    }
});


export default router;