<?php

namespace App\Controller;

use App\Entity\Travel;
use App\Form\TravelType;
use App\Repository\TravelRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
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

    #[Route('/travel/new', name: 'app_travel_new')]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $travel = new Travel();
        $form = $this->createForm(TravelType::class, $travel);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($travel);
            $entityManager->flush();

            $this->addFlash('success', 'Le voyage a été créé avec succès !');

            return $this->redirectToRoute('app_travel_index');
        }

        return $this->render('travel/new.html.twig', [
            'travelForm' => $form->createView(),
        ]);
    }

    #[Route('/travel/{id}', name: 'app_travel_show')]
    public function show(Travel $travel): Response
    {
        return $this->render('travel/show.html.twig', [
            'travel' => $travel,
        ]);
    }

    #[Route('/travel/{id}/edit', name: 'app_travel_edit')] // <-- AJOUTE CETTE ACTION
    public function edit(Request $request, Travel $travel, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(TravelType::class, $travel);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            $this->addFlash('success', 'Le voyage a été modifié avec succès !');

            return $this->redirectToRoute('app_travel_show', ['id' => $travel->getId()]);
        }

        return $this->render('travel/edit.html.twig', [
            'travelForm' => $form->createView(),
            'travel' => $travel,
        ]);
    }


    #[Route('/travel/{id}', name: 'app_travel_delete', methods: ['POST'])]
    public function delete(Request $request, Travel $travel, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete' . $travel->getId(), $request->request->get('_token'))) {
            $entityManager->remove($travel);
            $entityManager->flush();

            $this->addFlash('success', 'Le voyage a été supprimé avec succès !');
        } else {
             $this->addFlash('danger', 'Impossible de supprimer le voyage (token CSRF invalide).');
        }

        return $this->redirectToRoute('app_travel_index');
    }
}