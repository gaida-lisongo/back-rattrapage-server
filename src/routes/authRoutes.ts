import { Router } from 'express';
import { UserModel } from '../models/UserModel';

const router = Router();
// const authController = new AuthController();
const userModel = new UserModel();

router.post('/login', async (req, res) =>{
    try {
        console.log('login checking');
        const { matricule, mdp } = req.body;
    
        const user = await userModel.authenticate(matricule, mdp);
    
        res.send(user);
        
    } catch (error) {
        console.log('Error', error);
        res.status(500).send(error);
        
    }
});

router.post('/logout', async (req, res) => {
    console.log('sigin checking');
});

export default router;