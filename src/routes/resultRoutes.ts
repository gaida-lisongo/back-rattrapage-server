import { Router } from 'express';
import { ResultModel } from '../models/ResultModel';

const router = Router();
const resultModel = new ResultModel();

router.put('/', async (req, res) => {
    try {
        const { studentId, examId, score, url } = req.body;
        console.log('result', studentId, examId, score, url);
        const result = await resultModel.saveResult(studentId, examId, score, url);

        res.send(result);
    } catch (error) {
        console.log('Error', error);
        res.status(500).send(error);
    }

});

router.post('/rattrapage/:examId', async (req, res) => {
    try {
        const { examId } = req.params;
        const results = await resultModel.getExamResults(parseInt(examId));

        res.send(results);

    } catch (error) {
        console.log('Error', error);
        res.status(500).send(error);
    }
})


router.get('/student/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        console.log('studentId', studentId);
        const results = await resultModel.getStudentResults(parseInt(studentId));
        console.log('results', results);
        res.send(results);

    } catch (error) {
        console.log('Error', error);
        res.status(500).send(error);
    }
});
// router.get('/results/:id', resultController.getResultById);


export default router;