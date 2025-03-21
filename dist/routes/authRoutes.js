"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserModel_1 = require("../models/UserModel");
const router = (0, express_1.Router)();
// const authController = new AuthController();
const userModel = new UserModel_1.UserModel();
router.post('/login', async (req, res) => {
    try {
        console.log('login checking');
        const { matricule, mdp } = req.body;
        const user = await userModel.authenticate(matricule, mdp);
        res.send(user);
    }
    catch (error) {
        console.log('Error', error);
        res.status(500).send(error);
    }
});
router.post('/logout', async (req, res) => {
    console.log('sigin checking');
});
exports.default = router;
//# sourceMappingURL=authRoutes.js.map