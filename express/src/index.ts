import express, { Request, Response } from 'express';
import userRoutes from './routes/user-routes';  // Assure-toi que le chemin est correct
import cors from 'cors';



const app = express();


app.use(cors())

// Middleware pour parser le corps de la requête en JSON
app.use(express.json());

// Définir le préfixe pour les routes utilisateurs
app.use('/api/users', userRoutes);  // Routes pour les utilisateurs accessibles sous /api/users

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
