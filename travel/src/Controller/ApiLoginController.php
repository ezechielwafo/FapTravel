<?php
namespace App\Controller;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser; 
use App\Entity\User; 

class ApiLoginController extends AbstractController
{
    #[Route('/api/login', name: 'api_login_check', methods: ['POST'])]
    public function apiLogin(#[CurrentUser] ?User $user): JsonResponse
    {
        if (!$user) {
            return $this->json([
                'message' => 'Authentification échouée',
            ], JsonResponse::HTTP_UNAUTHORIZED);
        }
       return $this->json([
            'message' => 'Authentification réussie',
            'token' => $user->getToken(),
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'roles' => $user->getRoles(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
            ]
        ]);
    }

    // Si tu veux une route pour créer des utilisateurs via l'API (optionnel)
    #[Route('/api/users', name: 'api_users_create', methods: ['POST'])]
    public function createUserApi(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (json_last_error() !== JSON_ERROR_NONE || !isset($data['email'], $data['password'], $data['firstName'], $data['lastName'])) {
            return $this->json(['success' => false, 'message' => 'Données invalides.'], Response::HTTP_BAD_REQUEST);
        }

        $user = new User();
        $user->setEmail($data['email']);
        $user->setFirstName($data['firstName']);
        $user->setLastName($data['lastName']);
        $user->setRoles(['ROLE_USER']); // Rôle par défaut

        $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);

        try {
            $entityManager->persist($user);
            $entityManager->flush();
            return $this->json([
                'success' => true,
                'message' => 'Utilisateur créé avec succès.',
                'userId' => $user->getId()
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return $this->json(['success' => false, 'message' => 'Erreur lors de la création de l\'utilisateur.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}