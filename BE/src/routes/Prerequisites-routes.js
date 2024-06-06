import express from "express";
import currentUser from "../middlewares/current-user.js";
import Link from "../models/Link.js";
import Prerequisites from "../models/Prerequisites.js";
import Profile from "../models/Profile.js";
import requireAuth from "../middlewares/require-auth.js";
import RoleAuthorization from "../models/role-auhorization.js";

const prerequisitesRouter = express.Router();

//creez endpoint de post pentru prerequisites
//din body iau datele necesare
//verific daca sunt logata ca si client
//caut link id ul adica conexiunea antrenor-client dupa user id ul curent care e clientUser
//pt ca doar un client isi introduce datele
//caut profilul dupa clientUser si extrag varsta
//creez un nou obiect de tipul schemei si ii setez datele colectate
prerequisitesRouter.post('/create/prerequisites', currentUser,requireAuth, async (req, res) => {
    const {id} = req.currentUser;
    const {weight, height, target, intolerances, activityLevel, gender} = req.body
    try {
        const role = new RoleAuthorization(req.currentUser.roles);
        if (role.name !== "CLIENT") {
            return res.status(403).json({message: "Access denied"});
        }

        const link = await Link.findOne({clientId: id});
        if (!link) {
            return res.status(404).json({message: 'Link not found'});
        }

        const profile = await Profile.findOne({userId: id})
        if (!profile) {
            return res.status(404).json({message: 'Profile not found'});
        }

        const newPrerequisites = new Prerequisites({
            weight, height, target, intolerances, activityLevel, gender, linkId: link.id, id
        })

        const savedPrerequisites = await newPrerequisites.save();
        const result = savedPrerequisites.toJSON();
        result.age = profile.age;

        return res.status(201).json(result);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

//astept ca parametru id-ul legaturii intre client si antrenor
//verific daca sunt logata ca si client
//caut prerequisites cu link id ul returnat
//caut link-ul cu id-ul dat  pt a afla userId-ul
//caut profilul cu userId ul gasit si extrag varsta
//compun return ul
prerequisitesRouter.get('/prerequisites/:linkId', async (req, res) => {
    const {linkId} = req.params;
    try {
        console.log(linkId);
        const prerequisites = await Prerequisites.findOne({linkId:linkId});

        if (!prerequisites) {
            return res.status(404).json({message: 'Prerequisites not found'});
        }

        console.log(linkId)
        const link = await Link.findById(linkId);
        if (!link) {
            return res.status(404).json({message: 'Link not found'});
        }
        const profile = await Profile.findOne({userId: link.clientId});
        if (!profile) {
            return res.status(404).json({message: 'Profile not found'});
        }

        const result = prerequisites.toJSON();
        result.age = profile.age;

        return res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

//id ul prerequisites pe care vreau sa modific se extrage din param
//din payload iau valorile campurilor pe care le vreau updatate
//caut prerequisites dupa id ul din param si fac update cu datele din payload
//caut profilul dupa userId care e current user id =>
//doar un user isi poate modifica prerequisites deci current user ul
//fac update daca e necesar la profil
//compun raspunul si l returnez
prerequisitesRouter.put('/update/prerequisites/:id', currentUser,requireAuth, async (req, res) => {
    const {id} = req.params;
    const {weight, height, target, intolerances, activityLevel, gender, age} = req.body;

    try {
        const role = new RoleAuthorization(req.currentUser.roles);
        if (role.name !== "CLIENT") {
            return res.status(403).json({message: "Access denied"});
        }

        const updatePrerequisites = await Prerequisites.findByIdAndUpdate(id,
            {weight, height, target, intolerances, activityLevel, gender},
            {new: true}
        );
        if (!updatePrerequisites) {
            return res.status(404).json({message: 'Prerequisites not found'});
        }

        const profile = await Profile.findOneAndUpdate(
            {userId: req.currentUser.id},
            {age: age},
            {new: true}
        );
        if (!profile) {
            return res.status(404).json({message: 'Profile not found'});
        }

        const result = updatePrerequisites.toJSON();
        result.age = profile.age;

        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

export default prerequisitesRouter;


