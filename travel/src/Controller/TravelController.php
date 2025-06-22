<?php

namespace App\Controller;

use App\Entity\Travel;
use App\Form\TravelType;
use App\Repository\TravelRepository;
use Doctrine\ORM\EntityManagerInterface;
// use SebastianBergmann\Environment\Console; // <-- Supprime cette ligne
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface; // <-- Ajoute cette ligne

class TravelController extends AbstractController
{
    // Actions pour l'interface web Twig (CRUD classique)
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

    #[Route('/travel/{id}/edit', name: 'app_travel_edit')]
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

    // Actions pour l'API REST

    #[Route('/api/travels', name: 'api_travel_index', methods: ['GET'])] // <-- Route corrigée (pas de {id})
    public function apiIndex(TravelRepository $travelRepository, SerializerInterface $serializer): JsonResponse
    {
        $travels = $travelRepository->findAll();

        $jsonTravels = $serializer->serialize($travels, 'json', ['groups' => 'travel:read']);
        return new JsonResponse($jsonTravels, Response::HTTP_OK, [], true);
    }

    #[Route('/api/travels/{id}', name: 'api_travel_show', methods: ['GET'])] // <-- Nouvelle action pour afficher un voyage spécifique par ID
    public function apiShow(Travel $travel, SerializerInterface $serializer): JsonResponse
    {
        $jsonTravel = $serializer->serialize($travel, 'json', ['groups' => 'travel:read']);
        return new JsonResponse($jsonTravel, Response::HTTP_OK, [], true);
    }

    #[Route('/api/travels', name: 'api_travel_new', methods: ['POST'])] // <-- Route pour la création (pas de {id})
    public function apiNew(Request $request, SerializerInterface $serializer, EntityManagerInterface $entityManager, ValidatorInterface $validator): JsonResponse
    {
        $jsonRecu = $request->getContent();

        try {
            $travel = $serializer->deserialize($jsonRecu, Travel::class, 'json', ['groups' => 'travel:write']);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Invalid JSON data provided.'], Response::HTTP_BAD_REQUEST);
        }

        $errors = $validator->validate($travel);

        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getPropertyPath() . ': ' . $error->getMessage();
            }
            return new JsonResponse(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
        }

        $entityManager->persist($travel);
        $entityManager->flush();

        $jsonTravel = $serializer->serialize($travel, 'json', ['groups' => 'travel:read']);

        return new JsonResponse($jsonTravel, Response::HTTP_CREATED, [], true);
    }


    #[Route('/api/travels/{id}', name: 'api_travel_edit', methods: ['PUT'])]
    public function apiEdit(Request $request, Travel $travel, SerializerInterface $serializer, EntityManagerInterface $entityManager, ValidatorInterface $validator): JsonResponse
    {
        $jsonRecu = $request->getContent();

        try {
            $serializer->deserialize($jsonRecu, Travel::class, 'json', [
                'groups' => 'travel:write',
                'object_to_populate' => $travel
            ]);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Invalid JSON data provided.'], Response::HTTP_BAD_REQUEST);
        }

        $errors = $validator->validate($travel);

        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getPropertyPath() . ': ' . $error->getMessage();
            }
            return new JsonResponse(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
        }

        $entityManager->flush();

        $jsonTravel = $serializer->serialize($travel, 'json', ['groups' => 'travel:read']);

        return new JsonResponse($jsonTravel, Response::HTTP_OK, [], true);
    }

    #[Route('/api/travels/{id}', name: 'api_travel_delete', methods: ['DELETE'])]
    public function apiDelete(Travel $travel, EntityManagerInterface $entityManager): JsonResponse
    {
        $entityManager->remove($travel);
        $entityManager->flush();

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }
}