"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
class AuthController {
    constructor() {
        this.authService = new authService_1.AuthService();
    }
    async login(req, res) {
        try {
            const { username, password } = req.body;
            const token = await this.authService.login(username, password);
            res.status(200).json({ token });
        }
        catch (error) {
            res.status(401).json({ message: error.message });
        }
    }
    async logout(req, res) {
        try {
            await this.authService.logout(req.user);
            res.status(200).json({ message: 'Logged out successfully' });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map