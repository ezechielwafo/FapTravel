<?php
// src/Controller/ReservationController.php

namespace App\Controller;

use App\Entity\Reservation; // Assure-toi que ton entité Reservation existe
use App\Entity\Travel;      // Assure-toi que ton entité Travel existe
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface; // Pour la validation

class ReservationController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private ValidatorInterface $validator;

    public function __construct(EntityManagerInterface $entityManager, ValidatorInterface $validator)
    {
        $this->entityManager = $entityManager;
        $this->validator = $validator;
    }

    /**
     * @Route("/api/reservations", name="api_reservations_create", methods={"POST"})
     */
    public function createReservation(Request $request): JsonResponse
    {
        // 1. Récupérer les données JSON de la requête
        $data = json_decode($request->getContent(), true);

        // Vérifier si les données ont été décodées correctement
        if (json_last_error() !== JSON_ERROR_NONE) {
            return $this->json(['success' => false, 'message' => 'Données JSON invalides.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // 2. Extraire les informations nécessaires
        $travelId = $data['travelId'] ?? null;
        $fullName = $data['fullName'] ?? null;
        $email = $data['email'] ?? null;
        $numberOfPeople = $data['numberOfPeople'] ?? null;

        // 3. Validation des données reçues
        if (!$travelId || !$fullName || !$email || $numberOfPeople === null) {
            return $this->json(['success' => false, 'message' => 'Champs requis manquants.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Valider le format de l'email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->json(['success' => false, 'message' => 'Format d\'email invalide.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Valider le nombre de personnes
        if (!is_numeric($numberOfPeople) || $numberOfPeople <= 0) {
            return $this->json(['success' => false, 'message' => 'Le nombre de personnes doit être un entier positif.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // 4. Trouver le voyage correspondant
        $travelRepository = $this->entityManager->getRepository(Travel::class);
        $travel = $travelRepository->find($travelId);

        if (!$travel) {
            return $this->json(['success' => false, 'message' => 'Voyage non trouvé.'], JsonResponse::HTTP_NOT_FOUND);
        }

        // 5. Créer une nouvelle instance de Reservation
        $reservation = new Reservation();
        $reservation->setFullName($fullName);
        $reservation->setEmail($email);
        $reservation->setNumberOfPeople((int) $numberOfPeople);
        $reservation->setTravel($travel); // Associer le voyage à la réservation
        $reservation->setReservationDate(new \DateTime()); // Définir la date de réservation

        // 6. Valider l'entité Reservation (si tu as des contraintes de validation dans ton entité)
        $errors = $this->validator->validate($reservation);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return $this->json(['success' => false, 'message' => 'Erreur de validation: ' . implode(', ', $errorMessages)], JsonResponse::HTTP_BAD_REQUEST);
        }

        // 7. Persister la réservation en base de données
        try {
            $this->entityManager->persist($reservation);
            $this->entityManager->flush();
        } catch (\Exception $e) {
            // Gérer les erreurs potentielles lors de la sauvegarde (ex: contraintes de base de données)
            return $this->json(['success' => false, 'message' => 'Erreur lors de la sauvegarde de la réservation.'], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

        // 8. Retourner une réponse JSON de succès
        return $this->json([
            'success' => true,
            'message' => 'Réservation créée avec succès!',
            'reservationId' => $reservation->getId(), // Optionnel: retourner l'ID de la réservation
        ], JsonResponse::HTTP_CREATED); // 201 Created
    }


    public function listReservations(): JsonResponse
    {
        $reservations = $this->entityManager->getRepository(Reservation::class)->findAll();

        $data = [];
        foreach ($reservations as $reservation) {
            $data[] = [
                'id' => $reservation->getId(),
                'fullName' => $reservation->getFullName(),
                'email' => $reservation->getEmail(),
                'numberOfPeople' => $reservation->getNumberOfPeople(),
                'reservationDate' => $reservation->getReservationDate()->format('Y-m-d H:i:s'),
                'travelName' => $reservation->getTravel() ? $reservation->getTravel()->getName() : 'N/A', // Assure-toi que Travel a une méthode getName()
            ];
        }

        return $this->json($data);
    }
}