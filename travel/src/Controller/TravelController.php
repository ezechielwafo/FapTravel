<?php

namespace App\Controller;

use App\Entity\Travel; // Importe l'entité Travel
use App\Form\TravelType; // Importe le formulaire TravelType
use App\Repository\TravelRepository;
use Doctrine\ORM\EntityManagerInterface; // Importe l'EntityManager
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request; // Importe Request
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class TravelController extends AbstractController
{
    #[Route('/travel', name: 'app_travel_index')]
    public function index(TravelRepository $travelRepository): Response
    {
        $travels = $travelRepository->findAll();

        return $this->render('travel/index.html.twig', [
            'travels' => $travels,
        ]);
    }

    #[Route('/travel/new', name: 'app_travel_new')] // Nouvelle route pour l'ajout
    public function new(Request $request, EntityManagerInterface $entityManager): Response // Injecte Request et EntityManager
    {
        $travel = new Travel(); // Crée une nouvelle instance de l'entité Travel
        $form = $this->createForm(TravelType::class, $travel); // Crée le formulaire lié à l'entité

        $form->handleRequest($request); // Gère la soumission du formulaire

        if ($form->isSubmitted() && $form->isValid()) {

            $entityManager->persist($travel); // Prépare l'objet $travel à être sauvegardé
            $entityManager->flush(); // Exécute la sauvegarde en base de données

            $this->addFlash('success', 'Le voyage a été créé avec succès !');

            return $this->redirectToRoute('app_travel_index');
        }

        return $this->render('travel/new.html.twig', [
            'travelForm' => $form->createView(), 
        ]);
    
    }
         #[Route('/travel/{id}', name: 'app_travel_show')] // Nouvelle route avec un paramètre {id}
    public function show(Travel $travel): Response // Symfony convertit automatiquement l'ID en objet Travel
    {
        // L'objet $travel est automatiquement récupéré par Symfony grâce au paramètre {id} et au type hinting Travel

        return $this->render('travel/show.html.twig', [
            'travel' => $travel, // Passe l'objet Travel au template
        ]);
    }
}